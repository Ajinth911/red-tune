import { SignOutButton } from "../SignOutButton";

interface Playlist {
  _id: string;
  name: string;
  description?: string;
}

interface SidebarProps {
  playlists: Playlist[];
  currentView: string;
  onViewChange: (view: 'home' | 'search' | 'playlists' | 'playlist', playlistId?: string) => void;
}

export function Sidebar({ playlists, currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'playlists', label: 'Your Library', icon: '📚' },
  ];

  return (
    <div className="w-64 bg-black flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">♪</span>
          </div>
          <h1 className="text-xl font-bold text-white">RedTunes</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Playlists */}
        {playlists.length > 0 && (
          <div className="mt-8">
            <h3 className="text-gray-400 text-sm font-semibold mb-3 px-3">PLAYLISTS</h3>
            <ul className="space-y-1">
              {playlists.map((playlist) => (
                <li key={playlist._id}>
                  <button
                    onClick={() => onViewChange('playlist', playlist._id)}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors truncate"
                  >
                    {playlist.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-800">
        <SignOutButton />
      </div>
    </div>
  );
}
