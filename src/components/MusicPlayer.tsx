import { useState, useRef, useEffect } from "react";
import { Song } from "./MusicApp";

interface MusicPlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function MusicPlayer({ song, isPlaying, onPlayPause }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Simulate playback progress when playing
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Simulate audio playback with a timer
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Simulate a 3:30 song duration
          const maxDuration = 210;
          if (newTime >= maxDuration) {
            onPlayPause(); // Auto-pause when "song" ends
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, onPlayPause]);

  // Set a default duration when song changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(210); // 3:30 default duration
  }, [song.youtubeId]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
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
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
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
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
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

      {/* Note about audio playback */}
      <div className="mt-2 text-center">
        <p className="text-gray-500 text-xs">
          🎵 Simulated playback - In a real app, you'd integrate with YouTube's embedded player API
        </p>
      </div>
    </div>
  );
}
