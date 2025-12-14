'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMatches, Match } from '@/lib/firestore';
import Link from 'next/link';
import MatchCard from '@/components/MatchCard';
import UserDashboard from '@/components/UserDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

function FortniteBettingContent() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const allMatches = await getMatches();
      setMatches(allMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  if (loadingMatches) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono neon-text" style={{ color: '#00ff41' }}>
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="retro-button px-6 py-3 font-mono">
            ← BACK TO MALL
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold neon-text text-center" style={{ color: '#ff00ff' }}>
            FORTNITE BETTING ARENA
          </h1>
          <div className="w-32"></div> {/* Spacer */}
        </div>

        {/* User Dashboard */}
        {user && <UserDashboard user={user} />}

        {/* Matches Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold neon-text" style={{ color: '#00ffff' }}>
            AVAILABLE MATCHES
          </h2>
          
          {matches.length === 0 ? (
            <div className="bg-black/50 border-4 border-cyan-400 p-8 text-center">
              <p className="text-xl font-mono" style={{ color: '#ffff00' }}>
                NO MATCHES AVAILABLE
              </p>
              <p className="text-sm font-mono mt-2" style={{ color: '#00ff41' }}>
                Check back soon for new matches!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <div className="mt-8 text-center">
            <Link href="/fortnite-betting/admin" className="retro-button px-8 py-4 inline-block font-mono">
              ADMIN PANEL
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FortniteBettingPage() {
  return (
    <ProtectedRoute>
      <FortniteBettingContent />
    </ProtectedRoute>
  );
}

