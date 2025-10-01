import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { NowPlaying } from "./NowPlaying";
import { YouTubeMusicPlayer } from "./YouTubeMusicPlayer";

export interface Song {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
}

export function MusicApp() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'playlists' | 'playlist'>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const user = useQuery(api.auth.loggedInUser);
  const playlists = useQuery(api.music.getUserPlaylists);
  const recentPlays = useQuery(api.music.getRecentPlays);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleViewChange = (view: 'home' | 'search' | 'playlists' | 'playlist', playlistId?: string) => {
    setCurrentView(view);
    if (playlistId) {
      setSelectedPlaylistId(playlistId);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          playlists={playlists || []}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
        
        <div className="flex-1 flex flex-col">
          <MainContent
            currentView={currentView}
            selectedPlaylistId={selectedPlaylistId}
            recentPlays={recentPlays || []}
            onPlaySong={handlePlaySong}
            onViewChange={handleViewChange}
          />
        </div>
      </div>
      
      {currentSong && (
        <YouTubeMusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}
    </div>
  );
}
