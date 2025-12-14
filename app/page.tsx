'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 gap-4 h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold neon-text" style={{ color: '#00ff41' }}>
            STAR COURT
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold neon-text" style={{ color: '#00ffff' }}>
            MALL
          </h2>
          <div className="text-2xl md:text-3xl font-mono" style={{ color: '#ffff00' }}>
            {formatTime(time)}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-black/50 border-4 border-cyan-400 p-8 space-y-6 backdrop-blur-sm">
          <p className="text-xl md:text-2xl font-mono" style={{ color: '#00ff41' }}>
            WELCOME TO THE FUTURE
          </p>
          <p className="text-lg md:text-xl font-mono" style={{ color: '#00ffff' }}>
            Experience the 80s like never before
          </p>
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        {/* App Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Fortnite Betting App */}
          <Link href="/fortnite-betting">
            <div className="retro-button p-8 text-center cursor-pointer group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎮
              </div>
              <h3 className="text-2xl font-bold mb-2 neon-text" style={{ color: '#ff00ff' }}>
                FORTNITE
              </h3>
              <h4 className="text-xl font-bold mb-4 neon-text" style={{ color: '#ffff00' }}>
                BETTING ARENA
              </h4>
              <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
                Place bets on live matches
              </p>
              <p className="text-xs font-mono mt-2" style={{ color: '#00ff41' }}>
                [ENTER]
              </p>
            </div>
          </Link>

          {/* Coming Soon Placeholder */}
          <div className="retro-button p-8 text-center opacity-50">
            <div className="text-3xl mb-4">
              🔮
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#666' }}>
              COMING SOON
            </h3>
            <p className="text-sm font-mono" style={{ color: '#666' }}>
              More apps on the way
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 space-y-4">
          <div className="text-sm font-mono space-y-2" style={{ color: '#00ffff' }}>
            <p>© 1985 STAR COURT MALL</p>
            <p>ALL RIGHTS RESERVED</p>
          </div>
          <Link href="/login">
            <div className="retro-button px-6 py-3 inline-block font-mono">
              <span style={{ color: '#00ff41' }}>LOGIN / SIGN UP</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Animated Corner Decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-4 border-cyan-400 opacity-50"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-4 border-pink-500 opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-yellow-400 opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-green-400 opacity-50"></div>
    </div>
  );
}
