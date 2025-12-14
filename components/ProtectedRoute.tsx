'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono neon-text" style={{ color: '#00ff41' }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-mono neon-text" style={{ color: '#ff00ff' }}>
            ACCESS DENIED
          </p>
          <Link href="/login" className="retro-button px-6 py-3 inline-block font-mono">
            LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

