import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface PlaylistsProps {
  onViewChange: (view: 'home' | 'search' | 'playlists' | 'playlist', playlistId?: string) => void;
}

export function Playlists({ onViewChange }: PlaylistsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

  const playlists = useQuery(api.music.getUserPlaylists);
  const createPlaylist = useMutation(api.music.createPlaylist);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const playlistId = await createPlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || undefined,
        isPublic: false,
      });
      
      toast.success("Playlist created successfully!");
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateForm(false);
      onViewChange('playlist', playlistId);
    } catch (error) {
      toast.error("Failed to create playlist");
      console.error("Create playlist error:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition-colors"
        >
          Create Playlist
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Playlist</h2>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlists Grid */}
      {playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => onViewChange('playlist', playlist._id)}
              className="bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-colors group"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-red-500 to-red-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-4xl">🎵</span>
              </div>
              <h3 className="text-white font-semibold mb-1 truncate">{playlist.name}</h3>
              {playlist.description && (
                <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-4xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create your first playlist</h2>
          <p className="text-gray-400 mb-6">It's easy, we'll help you</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Create Playlist
          </button>
        </div>
      )}
    </div>
  );
}
