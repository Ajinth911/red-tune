import { useState, useRef, useEffect } from "react";
import { Song } from "./MusicApp";

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeMusicPlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function YouTubeMusicPlayer({ song, isPlaying, onPlayPause }: YouTubeMusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
  }, []);

  const initializePlayer = () => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: song.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            setDuration(playerRef.current?.getDuration() || 0);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onPlayPause();
            }
          },
        },
      });
    }
  };

  // Update player when song changes
  useEffect(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.loadVideoById(song.youtubeId);
      setCurrentTime(0);
    }
  }, [song.youtubeId, playerReady]);

  // Handle play/pause
  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.playVideo();
        startTimeTracking();
      } else {
        playerRef.current.pauseVideo();
        stopTimeTracking();
      }
    }
  }, [isPlaying, playerReady]);

  // Update volume
  useEffect(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume, playerReady]);

  const startTimeTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerReady) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        setDuration(playerRef.current.getDuration());
      }
    }, 1000);
  };

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
      {/* Hidden YouTube Player */}
      <div id="youtube-player" style={{ display: 'none' }}></div>
      
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{song.title}</p>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              ⏮️
            </button>
            <button
              onClick={onPlayPause}
              disabled={!playerReady}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              <span className="text-black text-lg">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              ⏭️
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={!playerReady}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
            />
            <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              🔊
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-2 text-center">
        <p className="text-gray-500 text-xs">
          {playerReady ? '🎵 Real YouTube playback enabled!' : '⏳ Loading YouTube player...'}
        </p>
      </div>
    </div>
  );
}
