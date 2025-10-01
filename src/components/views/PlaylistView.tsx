import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Song } from "../MusicApp";
import { toast } from "sonner";

interface PlaylistViewProps {
  playlistId: string;
  onPlaySong: (song: Song) => void;
}

export function PlaylistView({ playlistId, onPlaySong }: PlaylistViewProps) {
  const playlist = useQuery(api.music.getUserPlaylists)?.find(p => p._id === playlistId);
  const songs = useQuery(api.music.getPlaylistSongs, { playlistId: playlistId as any });
  const removeSong = useMutation(api.music.removeSongFromPlaylist);

  const handleRemoveSong = async (songId: string) => {
    try {
      await removeSong({ songId: songId as any });
      toast.success("Song removed from playlist");
    } catch (error) {
      toast.error("Failed to remove song");
      console.error("Remove song error:", error);
    }
  };

  if (!playlist) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <p className="text-gray-400">Playlist not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Playlist Header */}
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
          <span className="text-white text-6xl">🎵</span>
        </div>
        <div>
          <p className="text-gray-400 text-sm font-semibold mb-2">PLAYLIST</p>
          <h1 className="text-4xl font-bold text-white mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-gray-300 mb-4">{playlist.description}</p>
          )}
          <p className="text-gray-400 text-sm">
            {songs?.length || 0} songs
          </p>
        </div>
      </div>

      {/* Songs List */}
      {songs && songs.length > 0 ? (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-800">
            <div className="col-span-1">#</div>
            <div className="col-span-6">TITLE</div>
            <div className="col-span-3">ARTIST</div>
            <div className="col-span-2">DURATION</div>
          </div>
          {songs.map((song, index) => (
            <div
              key={song._id}
              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800/50 rounded-lg cursor-pointer group transition-colors"
              onClick={() => onPlaySong({
                youtubeId: song.youtubeId,
                title: song.title,
                artist: song.artist,
                thumbnail: song.thumbnail,
                duration: song.duration,
              })}
            >
              <div className="col-span-1 flex items-center">
                <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                <span className="text-white hidden group-hover:block">▶️</span>
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{song.title}</p>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <p className="text-gray-400 truncate">{song.artist}</p>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-gray-400">{song.duration}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSong(song._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-4xl">🎵</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Let's find something for your playlist</h2>
          <p className="text-gray-400 mb-6">Search for songs to add to this playlist</p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            Find Songs
          </button>
        </div>
      )}
    </div>
  );
}
