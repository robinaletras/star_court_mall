'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminMatchManager from '@/components/AdminMatchManager';
import AdminDepositManager from '@/components/AdminDepositManager';
import AdminWithdrawalManager from '@/components/AdminWithdrawalManager';
import AdminSettingsPanel from '@/components/AdminSettingsPanel';

type AdminTab = 'matches' | 'deposits' | 'withdrawals' | 'settings';

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('matches');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/fortnite-betting');
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/fortnite-betting" className="retro-button px-6 py-3 font-mono">
            ← BACK
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold font-mono neon-text" style={{ color: '#ff00ff' }}>
            ADMIN PANEL
          </h1>
          <div className="w-32"></div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b-4 border-cyan-400 pb-4">
          <button
            onClick={() => setActiveTab('matches')}
            className={`retro-button px-6 py-3 font-mono ${
              activeTab === 'matches' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: activeTab === 'matches' ? '#ffff00' : '#00ffff' }}
          >
            MATCHES
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`retro-button px-6 py-3 font-mono ${
              activeTab === 'deposits' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: activeTab === 'deposits' ? '#ffff00' : '#00ffff' }}
          >
            DEPOSITS
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`retro-button px-6 py-3 font-mono ${
              activeTab === 'withdrawals' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: activeTab === 'withdrawals' ? '#ffff00' : '#00ffff' }}
          >
            WITHDRAWALS
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`retro-button px-6 py-3 font-mono ${
              activeTab === 'settings' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: activeTab === 'settings' ? '#ffff00' : '#00ffff' }}
          >
            SETTINGS
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'matches' && <AdminMatchManager />}
          {activeTab === 'deposits' && <AdminDepositManager />}
          {activeTab === 'withdrawals' && <AdminWithdrawalManager />}
          {activeTab === 'settings' && <AdminSettingsPanel />}
        </div>
      </div>
    </div>
  );
}

