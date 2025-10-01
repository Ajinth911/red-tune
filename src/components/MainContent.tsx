import { Home } from "./views/Home";
import { Search } from "./views/Search";
import { Playlists } from "./views/Playlists";
import { PlaylistView } from "./views/PlaylistView";
import { Song } from "./MusicApp";

interface MainContentProps {
  currentView: 'home' | 'search' | 'playlists' | 'playlist';
  selectedPlaylistId: string | null;
  recentPlays: any[];
  onPlaySong: (song: Song) => void;
  onViewChange: (view: 'home' | 'search' | 'playlists' | 'playlist', playlistId?: string) => void;
}

export function MainContent({ 
  currentView, 
  selectedPlaylistId, 
  recentPlays, 
  onPlaySong, 
  onViewChange 
}: MainContentProps) {
  return (
    <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 overflow-auto">
      {currentView === 'home' && (
        <Home recentPlays={recentPlays} onPlaySong={onPlaySong} />
      )}
      {currentView === 'search' && (
        <Search onPlaySong={onPlaySong} />
      )}
      {currentView === 'playlists' && (
        <Playlists onViewChange={onViewChange} />
      )}
      {currentView === 'playlist' && selectedPlaylistId && (
        <PlaylistView playlistId={selectedPlaylistId} onPlaySong={onPlaySong} />
      )}
    </div>
  );
}
