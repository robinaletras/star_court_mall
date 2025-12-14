'use client';

import { useState, useEffect } from 'react';
import { getMatches, createMatch, updateMatch, getObjectives, createObjective, updateObjective } from '@/lib/firestore';
import { Match, Objective, ObjectiveParameters } from '@/types';
import { calculateOdds } from '@/lib/utils';
import Link from 'next/link';

export default function AdminMatchManager() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [showAddObjective, setShowAddObjective] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [matchForm, setMatchForm] = useState({
    title: '',
    description: '',
    fortniteCode: '',
    maxPlayers: 100,
  });

  const [objectiveForm, setObjectiveForm] = useState({
    title: '',
    description: '',
    type: 'weapon' as Objective['type'],
    baseOdds: 100,
    itemType: '',
    itemCount: 1,
    location: '',
    eliminationCount: 0,
    difficultyMultiplier: 1,
  });

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadObjectives(selectedMatch.id);
    }
  }, [selectedMatch]);

  const loadMatches = async () => {
    try {
      const allMatches = await getMatches();
      setMatches(allMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadObjectives = async (matchId: string) => {
    try {
      const objs = await getObjectives(matchId);
      setObjectives(objs);
    } catch (error) {
      console.error('Error loading objectives:', error);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMatch({
        ...matchForm,
        status: 'upcoming',
        currentPlayers: 0,
        playerIds: [],
        objectives: [],
        pot: 0,
        rolloverPot: 0,
        createdBy: 'admin', // TODO: Get actual admin user ID
      });
      setMatchForm({ title: '', description: '', fortniteCode: '', maxPlayers: 100 });
      setShowCreateMatch(false);
      loadMatches();
      alert('Match created successfully!');
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Failed to create match');
    }
  };

  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    const parameters: ObjectiveParameters = {
      itemType: objectiveForm.itemType || undefined,
      itemCount: objectiveForm.itemCount || undefined,
      location: objectiveForm.location || undefined,
      eliminationCount: objectiveForm.eliminationCount || undefined,
      difficultyMultiplier: objectiveForm.difficultyMultiplier,
    };

    const objective: Omit<Objective, 'id' | 'createdAt'> = {
      matchId: selectedMatch.id,
      title: objectiveForm.title,
      description: objectiveForm.description,
      type: objectiveForm.type,
      parameters,
      baseOdds: objectiveForm.baseOdds,
      calculatedOdds: 0, // Will be calculated
      totalBets: 0,
      completed: false,
    };

    // Calculate odds
    objective.calculatedOdds = calculateOdds(objective as Objective);

    try {
      await createObjective(objective);
      setObjectiveForm({
        title: '',
        description: '',
        type: 'weapon',
        baseOdds: 100,
        itemType: '',
        itemCount: 1,
        location: '',
        eliminationCount: 0,
        difficultyMultiplier: 1,
      });
      setShowAddObjective(false);
      loadObjectives(selectedMatch.id);
      alert('Objective added successfully!');
    } catch (error) {
      console.error('Error adding objective:', error);
      alert('Failed to add objective');
    }
  };

  const handleUpdateMatchStatus = async (matchId: string, status: Match['status']) => {
    try {
      await updateMatch(matchId, { status });
      loadMatches();
      if (selectedMatch?.id === matchId) {
        setSelectedMatch({ ...selectedMatch, status });
      }
    } catch (error) {
      console.error('Error updating match status:', error);
      alert('Failed to update match status');
    }
  };

  if (loading) {
    return <div className="text-center font-mono" style={{ color: '#00ff41' }}>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ffff' }}>
          MATCH MANAGEMENT
        </h2>
        <button
          onClick={() => setShowCreateMatch(true)}
          className="retro-button px-6 py-3 font-mono"
          style={{ color: '#00ff41' }}
        >
          + CREATE MATCH
        </button>
      </div>

      {/* Create Match Modal */}
      {showCreateMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-4 border-cyan-400 p-8 max-w-2xl w-full space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-mono" style={{ color: '#00ff41' }}>
                CREATE NEW MATCH
              </h3>
              <button
                onClick={() => setShowCreateMatch(false)}
                className="text-2xl font-mono"
                style={{ color: '#ff00ff' }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateMatch} className="space-y-4 font-mono">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>TITLE</label>
                <input
                  type="text"
                  value={matchForm.title}
                  onChange={(e) => setMatchForm({ ...matchForm, title: e.target.value })}
                  className="w-full bg-black border-2 border-cyan-400 p-3"
                  style={{ color: '#00ff41' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>DESCRIPTION</label>
                <textarea
                  value={matchForm.description}
                  onChange={(e) => setMatchForm({ ...matchForm, description: e.target.value })}
                  className="w-full bg-black border-2 border-cyan-400 p-3"
                  style={{ color: '#00ff41' }}
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>FORTNITE CODE</label>
                <input
                  type="text"
                  value={matchForm.fortniteCode}
                  onChange={(e) => setMatchForm({ ...matchForm, fortniteCode: e.target.value })}
                  className="w-full bg-black border-2 border-cyan-400 p-3"
                  style={{ color: '#00ff41' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>MAX PLAYERS</label>
                <input
                  type="number"
                  value={matchForm.maxPlayers}
                  onChange={(e) => setMatchForm({ ...matchForm, maxPlayers: parseInt(e.target.value) })}
                  className="w-full bg-black border-2 border-cyan-400 p-3"
                  style={{ color: '#00ff41' }}
                  min={1}
                  max={100}
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateMatch(false)}
                  className="retro-button px-6 py-3 flex-1"
                  style={{ color: '#666' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="retro-button px-6 py-3 flex-1"
                  style={{ color: '#00ff41' }}
                >
                  CREATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id} className="bg-black/70 border-4 border-cyan-400 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold font-mono mb-2" style={{ color: '#ff00ff' }}>
                  {match.title}
                </h3>
                <p className="text-sm font-mono mb-2" style={{ color: '#00ffff' }}>
                  {match.description}
                </p>
                <div className="text-xs font-mono space-y-1">
                  <p style={{ color: '#ffff00' }}>
                    Code: <span style={{ color: '#00ff41' }}>{match.fortniteCode}</span>
                  </p>
                  <p style={{ color: '#ffff00' }}>
                    Players: <span style={{ color: '#00ff41' }}>{match.currentPlayers}/{match.maxPlayers}</span>
                  </p>
                  <p style={{ color: '#ffff00' }}>
                    Status: <span style={{ color: '#00ff41' }}>{match.status}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/fortnite-betting/match/${match.id}`}
                  className="retro-button px-4 py-2 text-sm font-mono"
                  style={{ color: '#00ffff' }}
                >
                  VIEW
                </Link>
                <button
                  onClick={() => setSelectedMatch(selectedMatch?.id === match.id ? null : match)}
                  className="retro-button px-4 py-2 text-sm font-mono"
                  style={{ color: '#00ff41' }}
                >
                  {selectedMatch?.id === match.id ? 'HIDE' : 'MANAGE'}
                </button>
                <select
                  value={match.status}
                  onChange={(e) => handleUpdateMatchStatus(match.id, e.target.value as Match['status'])}
                  className="bg-black border-2 border-cyan-400 p-2 text-sm font-mono"
                  style={{ color: '#00ff41' }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Objectives Management */}
            {selectedMatch?.id === match.id && (
              <div className="mt-6 pt-6 border-t border-cyan-400 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold font-mono" style={{ color: '#ffff00' }}>
                    OBJECTIVES ({objectives.length})
                  </h4>
                  <button
                    onClick={() => setShowAddObjective(true)}
                    className="retro-button px-4 py-2 text-sm font-mono"
                    style={{ color: '#00ff41' }}
                  >
                    + ADD OBJECTIVE
                  </button>
                </div>

                {/* Add Objective Modal */}
                {showAddObjective && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-black border-4 border-pink-500 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold font-mono" style={{ color: '#ff00ff' }}>
                          ADD OBJECTIVE
                        </h3>
                        <button
                          onClick={() => setShowAddObjective(false)}
                          className="text-2xl font-mono"
                          style={{ color: '#ff00ff' }}
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleAddObjective} className="space-y-4 font-mono">
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>TITLE</label>
                          <input
                            type="text"
                            value={objectiveForm.title}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, title: e.target.value })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>DESCRIPTION</label>
                          <textarea
                            value={objectiveForm.description}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, description: e.target.value })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>TYPE</label>
                          <select
                            value={objectiveForm.type}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, type: e.target.value as Objective['type'] })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                          >
                            <option value="weapon">Weapon</option>
                            <option value="item">Item</option>
                            <option value="location">Location</option>
                            <option value="elimination">Elimination</option>
                            <option value="survival">Survival</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>BASE ODDS</label>
                          <input
                            type="number"
                            value={objectiveForm.baseOdds}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, baseOdds: parseInt(e.target.value) })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            min={1}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>ITEM TYPE (optional)</label>
                          <input
                            type="text"
                            value={objectiveForm.itemType}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, itemType: e.target.value })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            placeholder="e.g., Assault Rifle"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>ITEM COUNT</label>
                          <input
                            type="number"
                            value={objectiveForm.itemCount}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, itemCount: parseInt(e.target.value) || 1 })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            min={1}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>LOCATION (optional)</label>
                          <input
                            type="text"
                            value={objectiveForm.location}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, location: e.target.value })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>ELIMINATION COUNT</label>
                          <input
                            type="number"
                            value={objectiveForm.eliminationCount}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, eliminationCount: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ color: '#ffff00' }}>DIFFICULTY MULTIPLIER</label>
                          <input
                            type="number"
                            step="0.1"
                            value={objectiveForm.difficultyMultiplier}
                            onChange={(e) => setObjectiveForm({ ...objectiveForm, difficultyMultiplier: parseFloat(e.target.value) || 1 })}
                            className="w-full bg-black border-2 border-cyan-400 p-3"
                            style={{ color: '#00ff41' }}
                            min={0.1}
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setShowAddObjective(false)}
                            className="retro-button px-6 py-3 flex-1"
                            style={{ color: '#666' }}
                          >
                            CANCEL
                          </button>
                          <button
                            type="submit"
                            className="retro-button px-6 py-3 flex-1"
                            style={{ color: '#00ff41' }}
                          >
                            ADD
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Objectives List */}
                <div className="space-y-2">
                  {objectives.map(obj => (
                    <div key={obj.id} className="bg-black/50 border-2 border-cyan-400 p-3">
                      <p className="font-mono text-sm" style={{ color: '#00ff41' }}>
                        {obj.title} - Odds: {obj.calculatedOdds}:1
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

