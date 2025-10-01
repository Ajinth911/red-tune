import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { MusicApp } from "./components/MusicApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Authenticated>
        <MusicApp />
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
          <header className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm h-16 flex justify-between items-center border-b border-red-500/20 shadow-sm px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">♪</span>
              </div>
              <h2 className="text-xl font-bold text-white">RedTunes</h2>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">♪</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Welcome to RedTunes</h1>
                <p className="text-gray-300">Your music, your way. Stream millions of songs.</p>
              </div>
              <SignInForm />
            </div>
          </main>
        </div>
      </Unauthenticated>
      
      <Toaster theme="dark" />
    </div>
  );
}
