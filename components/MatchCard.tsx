'use client';

import { Match } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'upcoming': return '#ffff00';
      case 'open': return '#00ff41';
      case 'in-progress': return '#00ffff';
      case 'completed': return '#666';
      default: return '#ff00ff';
    }
  };

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'upcoming': return 'UPCOMING';
      case 'open': return 'OPEN FOR BETS';
      case 'in-progress': return 'IN PROGRESS';
      case 'completed': return 'COMPLETED';
      default: return status.toUpperCase();
    }
  };

  return (
    <Link href={`/fortnite-betting/match/${match.id}`}>
      <div className="retro-button p-6 h-full cursor-pointer group hover:scale-105 transition-transform">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold font-mono neon-text flex-1" style={{ color: '#ff00ff' }}>
              {match.title}
            </h3>
            <span 
              className="text-xs font-mono px-2 py-1 border"
              style={{ 
                color: getStatusColor(match.status),
                borderColor: getStatusColor(match.status)
              }}
            >
              {getStatusText(match.status)}
            </span>
          </div>

          <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
            {match.description}
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span style={{ color: '#ffff00' }}>PLAYERS:</span>
              <span style={{ color: '#00ff41' }}>
                {match.currentPlayers} / {match.maxPlayers}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#ffff00' }}>OBJECTIVES:</span>
              <span style={{ color: '#00ff41' }}>{match.objectives.length}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#ffff00' }}>POT:</span>
              <span style={{ color: '#00ff41' }}>${(match.pot + match.rolloverPot).toFixed(2)}</span>
            </div>
            {match.rolloverPot > 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#ff00ff' }}>ROLLOVER:</span>
                <span style={{ color: '#ff00ff' }}>${match.rolloverPot.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: '#00ff41' }}>
            <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
              CREATED: {formatDate(match.createdAt)}
            </p>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm font-mono group-hover:scale-110 transition-transform inline-block" style={{ color: '#00ffff' }}>
              [VIEW DETAILS →]
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

