'use client';

import { User } from '@/types';
import { useState } from 'react';
import { createWithdrawalRequest } from '@/lib/firestore';

interface WithdrawModalProps {
  user: User;
  onClose: () => void;
}

export default function WithdrawModal({ user, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > user.balance) {
      setError('Insufficient balance');
      return;
    }

    if (!cryptoAddress.trim()) {
      setError('Please enter a Bitcoin address');
      return;
    }

    setSubmitting(true);

    try {
      await createWithdrawalRequest({
        userId: user.id,
        amount: withdrawAmount,
        cryptoAddress: cryptoAddress.trim(),
        status: 'pending',
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to update balance
      }, 2000);
    } catch (err) {
      setError('Failed to create withdrawal request. Please try again.');
      console.error('Error creating withdrawal request:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-4 border-pink-500 p-8 max-w-2xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#ff00ff' }}>
            REQUEST WITHDRAWAL
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-mono"
            style={{ color: '#ff00ff' }}
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-2xl font-mono neon-text" style={{ color: '#00ff41' }}>
              REQUEST SUBMITTED!
            </p>
            <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
              Your withdrawal request has been submitted. Admin will process it shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <div>
              <p className="text-sm mb-2" style={{ color: '#00ffff' }}>
                CURRENT BALANCE:
              </p>
              <p className="text-2xl font-bold" style={{ color: '#00ff41' }}>
                ${user.balance.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>
                WITHDRAWAL AMOUNT ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={user.balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border-2 border-cyan-400 p-3 font-mono"
                style={{ color: '#00ff41' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>
                BITCOIN ADDRESS
              </label>
              <input
                type="text"
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
                className="w-full bg-black border-2 border-cyan-400 p-3 font-mono text-xs"
                style={{ color: '#00ff41' }}
                placeholder="Enter your Bitcoin address"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border-2 border-red-500 p-3">
                <p className="text-sm" style={{ color: '#ff0000' }}>{error}</p>
              </div>
            )}

            <div className="bg-black/50 border-2 border-yellow-400 p-4">
              <p className="text-xs" style={{ color: '#ffff00' }}>
                ⚠️ IMPORTANT:
              </p>
              <ul className="text-xs mt-2 space-y-1" style={{ color: '#00ffff' }}>
                <li>• Withdrawals are manually processed by admin</li>
                <li>• You will receive Bitcoin at the address provided</li>
                <li>• Processing time: 24-48 hours</li>
                <li>• You will be notified when your withdrawal is processed</li>
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
                disabled={submitting}
                className="retro-button px-6 py-3 flex-1"
                style={{ color: '#ff00ff' }}
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

