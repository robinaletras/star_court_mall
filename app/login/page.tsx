'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, displayName || undefined);
      } else {
        await signIn(email, password);
      }
      router.push('/fortnite-betting');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-black/80 border-4 border-cyan-400 p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-mono neon-text mb-2" style={{ color: '#00ff41' }}>
            {isSignUp ? 'SIGN UP' : 'LOGIN'}
          </h1>
          <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
            STAR COURT MALL
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          {isSignUp && (
            <div>
              <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>
                DISPLAY NAME (OPTIONAL)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black border-2 border-cyan-400 p-3"
                style={{ color: '#00ff41' }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-cyan-400 p-3"
              style={{ color: '#00ff41' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-cyan-400 p-3"
              style={{ color: '#00ff41' }}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border-2 border-red-500 p-3">
              <p className="text-sm" style={{ color: '#ff0000' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="retro-button px-6 py-3 w-full font-mono"
            style={{ color: '#00ff41' }}
          >
            {loading ? 'LOADING...' : isSignUp ? 'SIGN UP' : 'LOGIN'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-sm font-mono"
            style={{ color: '#00ffff' }}
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="text-center pt-4 border-t border-cyan-400">
          <Link href="/" className="text-sm font-mono" style={{ color: '#00ff41' }}>
            ← Back to Mall
          </Link>
        </div>
      </div>
    </div>
  );
}

