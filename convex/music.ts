import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// YouTube API integration
export const searchMusic = action({
  args: {
    query: v.string(),
    maxResults: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YouTube API key not configured");
    }

    const maxResults = args.maxResults || 20;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(args.query)}&maxResults=${maxResults}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`YouTube API error: ${data.error?.message || 'Unknown error'}`);
      }

      return data.items.map((item: any) => ({
        youtubeId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error("YouTube search error:", error);
      throw new Error("Failed to search music");
    }
  },
});

// Get video details including duration
export const getVideoDetails = action({
  args: {
    videoIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YouTube API key not configured");
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${args.videoIds.join(',')}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`YouTube API error: ${data.error?.message || 'Unknown error'}`);
      }

      return data.items.map((item: any) => ({
        youtubeId: item.id,
        duration: item.contentDetails.duration,
      }));
    } catch (error) {
      console.error("YouTube video details error:", error);
      throw new Error("Failed to get video details");
    }
  },
});

// Playlist management
export const createPlaylist = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("playlists", {
      name: args.name,
      description: args.description,
      userId,
      isPublic: args.isPublic,
    });
  },
});

export const getUserPlaylists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("playlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addSongToPlaylist = mutation({
  args: {
    playlistId: v.id("playlists"),
    youtubeId: v.string(),
    title: v.string(),
    artist: v.string(),
    thumbnail: v.string(),
    duration: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify playlist ownership
    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found or access denied");
    }

    // Check if song already exists in playlist
    const existingSong = await ctx.db
      .query("playlistSongs")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .filter((q) => q.eq(q.field("youtubeId"), args.youtubeId))
      .first();

    if (existingSong) {
      throw new Error("Song already in playlist");
    }

    return await ctx.db.insert("playlistSongs", {
      playlistId: args.playlistId,
      youtubeId: args.youtubeId,
      title: args.title,
      artist: args.artist,
      thumbnail: args.thumbnail,
      duration: args.duration,
      addedAt: Date.now(),
    });
  },
});

export const getPlaylistSongs = query({
  args: {
    playlistId: v.id("playlists"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playlistSongs")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .order("desc")
      .collect();
  },
});

export const removeSongFromPlaylist = mutation({
  args: {
    songId: v.id("playlistSongs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const song = await ctx.db.get(args.songId);
    if (!song) {
      throw new Error("Song not found");
    }

    const playlist = await ctx.db.get(song.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.songId);
  },
});

// Recent plays tracking
export const addRecentPlay = mutation({
  args: {
    youtubeId: v.string(),
    title: v.string(),
    artist: v.string(),
    thumbnail: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }

    await ctx.db.insert("recentPlays", {
      userId,
      youtubeId: args.youtubeId,
      title: args.title,
      artist: args.artist,
      thumbnail: args.thumbnail,
      playedAt: Date.now(),
    });
  },
});

export const getRecentPlays = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("recentPlays")
      .withIndex("by_user_and_time", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});
