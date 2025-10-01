import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Song } from "../MusicApp";
import { toast } from "sonner";

interface SearchProps {
  onPlaySong: (song: Song) => void;
}

export function Search({ onPlaySong }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const searchMusic = useAction(api.music.searchMusic);
  const addRecentPlay = useMutation(api.music.addRecentPlay);
  const playlists = useQuery(api.music.getUserPlaylists);
  const addSongToPlaylist = useMutation(api.music.addSongToPlaylist);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchMusic({ query: query.trim() });
      setResults(searchResults);
    } catch (error) {
      toast.error("Failed to search music. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = async (song: Song) => {
    try {
      await addRecentPlay({
        youtubeId: song.youtubeId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
      });
      onPlaySong(song);
    } catch (error) {
      console.error("Error adding to recent plays:", error);
      onPlaySong(song);
    }
  };

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setShowPlaylistModal(true);
  };

  const handlePlaylistSelect = async (playlistId: string) => {
    if (!selectedSong) return;
    try {
      await addSongToPlaylist({
        playlistId: playlistId as any,
        youtubeId: selectedSong.youtubeId,
        title: selectedSong.title,
        artist: selectedSong.artist,
        thumbnail: selectedSong.thumbnail,
        duration: "3:30",
      });
      toast.success("Song added to playlist!");
      setShowPlaylistModal(false);
      setSelectedSong(null);
    } catch (error) {
      toast.error("Failed to add song to playlist");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Search</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((song, index) => (
            <div
              key={`${song.youtubeId}-${index}`}
              className="flex items-center p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer group transition-colors"
              onClick={() => handlePlaySong(song)}
            >
              <div className="relative">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-lg">▶️</span>
                </div>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-white font-medium truncate">{song.title}</p>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity">
                ⋯
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToPlaylist(song);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity ml-2"
              >
                ➕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No results found for "{query}"</p>
        </div>
      )}

      {/* Playlist Selection Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Add to Playlist</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists && playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() => handlePlaylistSelect(playlist._id)}
                    className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <p className="text-white font-medium">{playlist.name}</p>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No playlists found</p>
              )}
            </div>
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
