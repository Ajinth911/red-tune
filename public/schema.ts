import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  playlists: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    isPublic: v.boolean(),
    coverImage: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  playlistSongs: defineTable({
    playlistId: v.id("playlists"),
    youtubeId: v.string(),
    title: v.string(),
    artist: v.string(),
    thumbnail: v.string(),
    duration: v.string(),
    addedAt: v.number(),
  }).index("by_playlist", ["playlistId"]),

  recentPlays: defineTable({
    userId: v.id("users"),
    youtubeId: v.string(),
    title: v.string(),
    artist: v.string(),
    thumbnail: v.string(),
    playedAt: v.number(),
  }).index("by_user_and_time", ["userId", "playedAt"]),

  userPreferences: defineTable({
    userId: v.id("users"),
    favoriteGenres: v.array(v.string()),
    darkMode: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
