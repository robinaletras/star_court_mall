'use client';

import { Objective, Bet } from '@/types';
import { calculatePayout, formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface BettingInterfaceProps {
  objective: Objective;
  odds: number;
  userBet?: Bet;
  matchStatus: string;
  userBalance: number;
  onPlaceBet: (amount: number) => void;
}

export default function BettingInterface({
  objective,
  odds,
  userBet,
  matchStatus,
  userBalance,
  onPlaceBet,
}: BettingInterfaceProps) {
  const [betAmount, setBetAmount] = useState('');
  const [showBetForm, setShowBetForm] = useState(false);

  const canBet = matchStatus === 'open' || matchStatus === 'upcoming';
  const isCompleted = objective.completed;

  const handleBet = () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > userBalance) {
      alert('Insufficient balance');
      return;
    }
    onPlaceBet(amount);
    setBetAmount('');
    setShowBetForm(false);
  };

  const potentialPayout = betAmount
    ? calculatePayout(parseFloat(betAmount) || 0, odds)
    : 0;

  return (
    <div className="bg-black/70 border-4 border-cyan-400 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold font-mono neon-text mb-2" style={{ color: '#ff00ff' }}>
            {objective.title}
          </h3>
          <p className="text-sm font-mono mb-4" style={{ color: '#00ffff' }}>
            {objective.description}
          </p>

          {/* Objective Parameters */}
          <div className="space-y-1 text-xs font-mono mb-4">
            {objective.parameters.itemType && (
              <p style={{ color: '#ffff00' }}>
                ITEM TYPE: <span style={{ color: '#00ff41' }}>{objective.parameters.itemType}</span>
              </p>
            )}
            {objective.parameters.itemCount && (
              <p style={{ color: '#ffff00' }}>
                ITEM COUNT: <span style={{ color: '#00ff41' }}>{objective.parameters.itemCount}</span>
              </p>
            )}
            {objective.parameters.location && (
              <p style={{ color: '#ffff00' }}>
                LOCATION: <span style={{ color: '#00ff41' }}>{objective.parameters.location}</span>
              </p>
            )}
            {objective.parameters.eliminationCount && (
              <p style={{ color: '#ffff00' }}>
                ELIMINATIONS: <span style={{ color: '#00ff41' }}>{objective.parameters.eliminationCount}</span>
              </p>
            )}
          </div>
        </div>

        <div className="text-right space-y-2">
          <div>
            <p className="text-xs font-mono" style={{ color: '#ffff00' }}>ODDS:</p>
            <p className="text-2xl font-bold font-mono neon-text" style={{ color: '#00ff41' }}>
              {odds}:1
            </p>
          </div>
          <div>
            <p className="text-xs font-mono" style={{ color: '#ffff00' }}>TOTAL BETS:</p>
            <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
              {formatCurrency(objective.totalBets)}
            </p>
          </div>
          {isCompleted && (
            <div>
              <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
                {objective.winner ? 'COMPLETED' : 'NOT CLAIMED'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User's Existing Bet */}
      {userBet && (
        <div className="bg-green-900/30 border-2 border-green-400 p-3">
          <p className="text-sm font-mono" style={{ color: '#00ff41' }}>
            YOUR BET: {formatCurrency(userBet.amount)} → Potential Payout: {formatCurrency(userBet.potentialPayout)}
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: '#00ffff' }}>
            Status: {userBet.status.toUpperCase()}
          </p>
        </div>
      )}

      {/* Betting Form */}
      {!userBet && canBet && !isCompleted && (
        <div>
          {!showBetForm ? (
            <button
              onClick={() => setShowBetForm(true)}
              className="retro-button px-6 py-3 font-mono w-full"
              style={{ color: '#00ff41' }}
            >
              PLACE BET
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: '#ffff00' }}>
                  BET AMOUNT ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={userBalance}
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-black border-2 border-cyan-400 p-3 font-mono"
                  style={{ color: '#00ff41' }}
                  placeholder="Enter amount"
                />
                <p className="text-xs font-mono mt-1" style={{ color: '#00ffff' }}>
                  Available: {formatCurrency(userBalance)}
                </p>
              </div>

              {betAmount && parseFloat(betAmount) > 0 && (
                <div className="bg-black/50 border-2 border-yellow-400 p-3">
                  <p className="text-xs font-mono" style={{ color: '#ffff00' }}>
                    POTENTIAL PAYOUT:
                  </p>
                  <p className="text-xl font-bold font-mono neon-text" style={{ color: '#00ff41' }}>
                    {formatCurrency(potentialPayout)}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBetForm(false);
                    setBetAmount('');
                  }}
                  className="retro-button px-4 py-2 font-mono flex-1"
                  style={{ color: '#666' }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleBet}
                  disabled={!betAmount || parseFloat(betAmount) <= 0}
                  className="retro-button px-4 py-2 font-mono flex-1"
                  style={{ color: '#00ff41' }}
                >
                  CONFIRM BET
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!canBet && !userBet && (
        <p className="text-sm font-mono text-center" style={{ color: '#666' }}>
          Betting is not available for this match
        </p>
      )}
    </div>
  );
}

