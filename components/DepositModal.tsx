'use client';

import { User } from '@/types';
import { useState, useEffect } from 'react';
import { getAdminSettings, createTransaction } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface DepositModalProps {
  user: User;
  onClose: () => void;
}

export default function DepositModal({ user, onClose }: DepositModalProps) {
  const { firebaseUser } = useAuth();
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBitcoinAddress();
  }, []);

  const loadBitcoinAddress = async () => {
    try {
      const settings = await getAdminSettings();
      if (settings?.bitcoinDepositAddress) {
        setBitcoinAddress(settings.bitcoinDepositAddress);
      }
    } catch (error) {
      console.error('Error loading Bitcoin address:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    alert('Address copied to clipboard!');
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !txHash.trim()) {
      alert('Please enter a transaction hash');
      return;
    }

    setSubmitting(true);
    try {
      await createTransaction({
        userId: user.id,
        type: 'deposit',
        amount: 0, // Admin will set the amount when verifying
        status: 'pending',
        cryptoAddress: bitcoinAddress,
        txHash: txHash.trim(),
      });
      alert('Deposit request submitted! Admin will verify and credit your account.');
      onClose();
    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('Failed to submit deposit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-4 border-cyan-400 p-8 max-w-2xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ff41' }}>
            DEPOSIT FUNDS
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-mono"
            style={{ color: '#ff00ff' }}
          >
            ×
          </button>
        </div>

        <div className="space-y-4 font-mono">
          <div>
            <p className="text-sm mb-2" style={{ color: '#00ffff' }}>
              CURRENT BALANCE:
            </p>
            <p className="text-2xl font-bold" style={{ color: '#00ff41' }}>
              ${user.balance.toFixed(2)}
            </p>
          </div>

          <div className="border-2 border-cyan-400 p-4 space-y-4">
            <p className="text-sm" style={{ color: '#ffff00' }}>
              SEND BITCOIN TO THIS ADDRESS:
            </p>
            
            {loading ? (
              <p className="text-sm" style={{ color: '#00ff41' }}>Loading address...</p>
            ) : bitcoinAddress ? (
              <div className="space-y-2">
                <div className="bg-black/50 p-3 border border-cyan-400 break-all">
                  <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
                    {bitcoinAddress}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="retro-button px-4 py-2 text-sm w-full"
                  style={{ color: '#00ffff' }}
                >
                  COPY ADDRESS
                </button>
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#ff00ff' }}>
                Bitcoin address not configured. Please contact admin.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmitDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono mb-2" style={{ color: '#ffff00' }}>
                TRANSACTION HASH (After sending Bitcoin)
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="w-full bg-black border-2 border-cyan-400 p-3 font-mono text-xs"
                style={{ color: '#00ff41' }}
                placeholder="Enter your Bitcoin transaction hash"
              />
            </div>

            <div className="bg-black/50 border-2 border-yellow-400 p-4">
              <p className="text-xs" style={{ color: '#ffff00' }}>
                ⚠️ IMPORTANT:
              </p>
              <ul className="text-xs mt-2 space-y-1" style={{ color: '#00ffff' }}>
                <li>• Send Bitcoin to the address above</li>
                <li>• After sending, enter your transaction hash below</li>
                <li>• Admin will verify and credit your account</li>
                <li>• Deposits are manually processed by admin</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="retro-button px-6 py-3 flex-1"
                style={{ color: '#666' }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={submitting || !txHash.trim()}
                className="retro-button px-6 py-3 flex-1"
                style={{ color: '#00ff41' }}
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

