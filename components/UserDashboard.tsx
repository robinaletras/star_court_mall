'use client';

import { User } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <>
      <div className="bg-black/70 border-4 border-cyan-400 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-mono mb-1" style={{ color: '#00ffff' }}>
              WELCOME, {user.displayName || user.email.toUpperCase()}
            </p>
            <p className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ff41' }}>
              {formatCurrency(user.balance)}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDeposit(true)}
              className="retro-button px-6 py-3 font-mono"
              style={{ color: '#00ff41' }}
            >
              DEPOSIT
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="retro-button px-6 py-3 font-mono"
              style={{ color: '#ff00ff' }}
            >
              WITHDRAW
            </button>
          </div>
        </div>
      </div>

      {showDeposit && (
        <DepositModal user={user} onClose={() => setShowDeposit(false)} />
      )}

      {showWithdraw && (
        <WithdrawModal user={user} onClose={() => setShowWithdraw(false)} />
      )}
    </>
  );
}

