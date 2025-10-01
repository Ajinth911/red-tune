import { Song } from "../MusicApp";

interface HomeProps {
  recentPlays: any[];
  onPlaySong: (song: Song) => void;
}

export function Home({ recentPlays, onPlaySong }: HomeProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Good evening</h1>
      
      {/* Recently Played */}
      {recentPlays.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recently played</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPlays.slice(0, 6).map((play) => (
              <div
                key={`${play.youtubeId}-${play.playedAt}`}
                onClick={() => onPlaySong({
                  youtubeId: play.youtubeId,
                  title: play.title,
                  artist: play.artist,
                  thumbnail: play.thumbnail,
                })}
                className="flex items-center bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer transition-colors group"
              >
                <img
                  src={play.thumbnail}
                  alt={play.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{play.title}</p>
                  <p className="text-gray-400 text-sm truncate">{play.artist}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity ml-2">
                  ▶️
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Welcome message for new users */}
      {recentPlays.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-4xl">🎵</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Start listening</h2>
          <p className="text-gray-400 mb-6">Search for your favorite songs and create playlists</p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            Browse Music
          </button>
        </div>
      )}
    </div>
  );
}
