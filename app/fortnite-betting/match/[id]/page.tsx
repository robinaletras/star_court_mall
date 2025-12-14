'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getMatch, getObjectives, createBet, updateUserBalance, getBets } from '@/lib/firestore';
import { Match, Objective, Bet } from '@/types';
import { calculateOdds, calculatePayout, formatCurrency, formatDate } from '@/lib/utils';
import BettingInterface from '@/components/BettingInterface';
import Link from 'next/link';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadMatchData();
    }
  }, [params.id]);

  const loadMatchData = async () => {
    try {
      const matchId = params.id as string;
      const [matchData, objectivesData] = await Promise.all([
        getMatch(matchId),
        getObjectives(matchId),
      ]);

      if (!matchData) {
        router.push('/fortnite-betting');
        return;
      }

      setMatch(matchData);
      setObjectives(objectivesData);

      // Load user bets if logged in
      if (user) {
        const bets = await getBets(user.id, matchId);
        setUserBets(bets);
      }
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBet = async (objectiveId: string, amount: number) => {
    if (!user || !match) return;

    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    if (match.status !== 'open' && match.status !== 'upcoming') {
      alert('Bets are not currently open for this match');
      return;
    }

    try {
      const objective = objectives.find(obj => obj.id === objectiveId);
      if (!objective) return;

      const odds = calculateOdds(objective);
      const potentialPayout = calculatePayout(amount, odds);

      // Create bet
      await createBet({
        userId: user.id,
        matchId: match.id,
        objectiveId,
        amount,
        potentialPayout,
        status: 'pending',
      });

      // Deduct from user balance
      await updateUserBalance(user.id, -amount);

      // Update objective total bets
      // Note: This would ideally be done in a transaction, but Firestore doesn't support transactions across collections easily
      // For production, consider using a Cloud Function

      alert('Bet placed successfully!');
      loadMatchData();
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono neon-text" style={{ color: '#00ff41' }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono neon-text" style={{ color: '#ff00ff' }}>
          MATCH NOT FOUND
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/fortnite-betting" className="retro-button px-6 py-3 font-mono">
            ← BACK
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold font-mono neon-text text-center" style={{ color: '#ff00ff' }}>
            {match.title}
          </h1>
          <div className="w-32"></div>
        </div>

        {/* Match Info */}
        <div className="bg-black/70 border-4 border-cyan-400 p-6 space-y-4">
          <div>
            <p className="text-sm font-mono mb-2" style={{ color: '#00ffff' }}>DESCRIPTION:</p>
            <p className="text-lg font-mono" style={{ color: '#00ff41' }}>{match.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>STATUS:</p>
              <p className="text-sm font-mono" style={{ color: '#00ff41' }}>
                {match.status.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>PLAYERS:</p>
              <p className="text-sm font-mono" style={{ color: '#00ff41' }}>
                {match.currentPlayers} / {match.maxPlayers}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>TOTAL POT:</p>
              <p className="text-sm font-mono" style={{ color: '#00ff41' }}>
                {formatCurrency(match.pot + match.rolloverPot)}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>FORTNITE CODE:</p>
              <p className="text-sm font-mono break-all" style={{ color: '#00ff41' }}>
                {match.fortniteCode}
              </p>
            </div>
          </div>

          {match.rolloverPot > 0 && (
            <div className="bg-yellow-900/30 border-2 border-yellow-400 p-3">
              <p className="text-sm font-mono" style={{ color: '#ffff00' }}>
                🎰 ROLLOVER POT: {formatCurrency(match.rolloverPot)} from previous match
              </p>
            </div>
          )}
        </div>

        {/* Objectives and Betting */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ffff' }}>
            BETTING OBJECTIVES
          </h2>

          {objectives.length === 0 ? (
            <div className="bg-black/50 border-4 border-cyan-400 p-8 text-center">
              <p className="text-xl font-mono" style={{ color: '#ffff00' }}>
                NO OBJECTIVES YET
              </p>
              <p className="text-sm font-mono mt-2" style={{ color: '#00ff41' }}>
                Admin will add objectives soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {objectives.map(objective => {
                const userBet = userBets.find(bet => bet.objectiveId === objective.id);
                const odds = calculateOdds(objective);
                return (
                  <BettingInterface
                    key={objective.id}
                    objective={objective}
                    odds={odds}
                    userBet={userBet}
                    matchStatus={match.status}
                    userBalance={user?.balance || 0}
                    onPlaceBet={(amount) => handlePlaceBet(objective.id, amount)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Player Application */}
        {match.status === 'upcoming' && match.currentPlayers < match.maxPlayers && (
          <div className="bg-black/70 border-4 border-green-400 p-6">
            <h3 className="text-2xl font-bold font-mono mb-4" style={{ color: '#00ff41' }}>
              WANT TO PLAY?
            </h3>
            <p className="text-sm font-mono mb-4" style={{ color: '#00ffff' }}>
              Apply to join this match and get the Fortnite code!
            </p>
            <button
              className="retro-button px-6 py-3 font-mono"
              style={{ color: '#00ff41' }}
              onClick={() => {
                // TODO: Implement player application
                alert('Player application feature coming soon!');
              }}
            >
              APPLY TO PLAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

