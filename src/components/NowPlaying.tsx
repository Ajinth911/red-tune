import { Song } from "./MusicApp";

interface NowPlayingProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function NowPlaying({ song, isPlaying, onPlayPause }: NowPlayingProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-red-900/20 to-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Album Art */}
        <div className="relative mb-8">
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-80 h-80 rounded-lg shadow-2xl mx-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

        {/* Song Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{song.title}</h1>
          <p className="text-xl text-gray-300">{song.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button className="text-gray-400 hover:text-white transition-colors text-2xl">
            ⏮️
          </button>
          <button
            onClick={onPlayPause}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-white text-2xl">
              {isPlaying ? '⏸️' : '▶️'}
            </span>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors text-2xl">
            ⏭️
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 text-sm">0:00</span>
            <div className="flex-1 h-1 bg-gray-600 rounded-full">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <span className="text-gray-400 text-sm">3:45</span>
          </div>
        </div>
      </div>
    </div>
  );
}
