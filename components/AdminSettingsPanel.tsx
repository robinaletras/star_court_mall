'use client';

import { useState, useEffect } from 'react';
import { getAdminSettings, updateAdminSettings } from '@/lib/firestore';
import { AdminSettings } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSettingsPanel() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Partial<AdminSettings>>({
    bitcoinDepositAddress: '',
    defaultOdds: 100,
    minBetAmount: 1,
    maxBetAmount: 1000,
    minWithdrawalAmount: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await getAdminSettings();
      if (currentSettings) {
        setSettings(currentSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      await updateAdminSettings(settings, user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center font-mono" style={{ color: '#00ff41' }}>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ffff' }}>
        ADMIN SETTINGS
      </h2>

      <form onSubmit={handleSave} className="bg-black/70 border-4 border-cyan-400 p-8 space-y-6">
        <div>
          <label className="block text-sm font-mono mb-2" style={{ color: '#ffff00' }}>
            BITCOIN DEPOSIT ADDRESS
          </label>
          <input
            type="text"
            value={settings.bitcoinDepositAddress || ''}
            onChange={(e) => setSettings({ ...settings, bitcoinDepositAddress: e.target.value })}
            className="w-full bg-black border-2 border-cyan-400 p-3 font-mono text-xs"
            style={{ color: '#00ff41' }}
            placeholder="Enter Bitcoin address for deposits"
            required
          />
          <p className="text-xs font-mono mt-2" style={{ color: '#00ffff' }}>
            This address will be shown to users for deposits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-mono mb-2" style={{ color: '#ffff00' }}>
              DEFAULT ODDS
            </label>
            <input
              type="number"
              value={settings.defaultOdds || 100}
              onChange={(e) => setSettings({ ...settings, defaultOdds: parseInt(e.target.value) })}
              className="w-full bg-black border-2 border-cyan-400 p-3 font-mono"
              style={{ color: '#00ff41' }}
              min={1}
              required
            />
            <p className="text-xs font-mono mt-2" style={{ color: '#00ffff' }}>
              Base odds for objectives (e.g., 100 = 100:1)
            </p>
          </div>

          <div>
            <label className="block text-sm font-mono mb-2" style={{ color: '#ffff00' }}>
              MIN BET AMOUNT ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.minBetAmount || 1}
              onChange={(e) => setSettings({ ...settings, minBetAmount: parseFloat(e.target.value) })}
              className="w-full bg-black border-2 border-cyan-400 p-3 font-mono"
              style={{ color: '#00ff41' }}
              min={0.01}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono mb-2" style={{ color: '#ffff00' }}>
              MAX BET AMOUNT ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.maxBetAmount || 1000}
              onChange={(e) => setSettings({ ...settings, maxBetAmount: parseFloat(e.target.value) })}
              className="w-full bg-black border-2 border-cyan-400 p-3 font-mono"
              style={{ color: '#00ff41' }}
              min={0.01}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono mb-2" style={{ color: '#ffff00' }}>
              MIN WITHDRAWAL AMOUNT ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.minWithdrawalAmount || 10}
              onChange={(e) => setSettings({ ...settings, minWithdrawalAmount: parseFloat(e.target.value) })}
              className="w-full bg-black border-2 border-cyan-400 p-3 font-mono"
              style={{ color: '#00ff41' }}
              min={0.01}
              required
            />
          </div>
        </div>

        {saved && (
          <div className="bg-green-900/50 border-2 border-green-400 p-3">
            <p className="text-sm font-mono" style={{ color: '#00ff41' }}>
              ✓ Settings saved successfully!
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="retro-button px-8 py-4 font-mono w-full"
          style={{ color: '#00ff41' }}
        >
          {saving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </form>
    </div>
  );
}

