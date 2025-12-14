'use client';

import { useState, useEffect } from 'react';
import { getWithdrawalRequests, updateWithdrawalRequest, updateUserBalance } from '@/lib/firestore';
import { WithdrawalRequest } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminWithdrawalManager() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const allRequests = await getWithdrawalRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading withdrawal requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWithdrawal = async (request: WithdrawalRequest) => {
    const txHash = prompt('Enter Bitcoin transaction hash after sending:');
    if (txHash === null) return; // User cancelled

    if (!confirm(`Approve withdrawal of ${formatCurrency(request.amount)}?`)) return;

    try {
      // Deduct from user balance
      await updateUserBalance(request.userId, -request.amount);

      // Update request status
      await updateWithdrawalRequest(request.id, {
        status: 'completed',
        txHash: txHash || undefined,
        processedBy: 'admin', // TODO: Get actual admin user ID
      });

      alert('Withdrawal approved and processed!');
      loadRequests();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Failed to approve withdrawal');
    }
  };

  const handleRejectWithdrawal = async (request: WithdrawalRequest) => {
    const reason = prompt('Rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      await updateWithdrawalRequest(request.id, {
        status: 'rejected',
        adminNotes: reason || undefined,
        processedBy: 'admin', // TODO: Get actual admin user ID
      });

      alert('Withdrawal rejected');
      loadRequests();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('Failed to reject withdrawal');
    }
  };

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(req => req.status === filter);

  if (loading) {
    return <div className="text-center font-mono" style={{ color: '#00ff41' }}>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ffff' }}>
          WITHDRAWAL MANAGEMENT
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`retro-button px-4 py-2 text-sm font-mono ${
              filter === 'all' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: filter === 'all' ? '#ffff00' : '#00ffff' }}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`retro-button px-4 py-2 text-sm font-mono ${
              filter === 'pending' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: filter === 'pending' ? '#ffff00' : '#00ffff' }}
          >
            PENDING
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`retro-button px-4 py-2 text-sm font-mono ${
              filter === 'completed' ? 'border-4 border-yellow-400' : ''
            }`}
            style={{ color: filter === 'completed' ? '#ffff00' : '#00ffff' }}
          >
            COMPLETED
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-black/50 border-4 border-cyan-400 p-8 text-center">
            <p className="text-xl font-mono" style={{ color: '#ffff00' }}>
              NO WITHDRAWAL REQUESTS
            </p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div
              key={request.id}
              className="bg-black/70 border-4 border-pink-500 p-6 space-y-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>USER ID</p>
                  <p className="text-sm font-mono break-all" style={{ color: '#00ff41' }}>
                    {request.userId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>AMOUNT</p>
                  <p className="text-lg font-bold font-mono" style={{ color: '#ff00ff' }}>
                    {formatCurrency(request.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>STATUS</p>
                  <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
                    {request.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>DATE</p>
                  <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>BITCOIN ADDRESS</p>
                <p className="text-xs font-mono break-all" style={{ color: '#00ff41' }}>
                  {request.cryptoAddress}
                </p>
              </div>

              {request.txHash && (
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>TX HASH</p>
                  <p className="text-xs font-mono break-all" style={{ color: '#00ff41' }}>
                    {request.txHash}
                  </p>
                </div>
              )}

              {request.adminNotes && (
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>ADMIN NOTES</p>
                  <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
                    {request.adminNotes}
                  </p>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-pink-500">
                  <button
                    onClick={() => handleApproveWithdrawal(request)}
                    className="retro-button px-6 py-3 font-mono flex-1"
                    style={{ color: '#00ff41' }}
                  >
                    APPROVE & SEND
                  </button>
                  <button
                    onClick={() => handleRejectWithdrawal(request)}
                    className="retro-button px-6 py-3 font-mono flex-1"
                    style={{ color: '#ff00ff' }}
                  >
                    REJECT
                  </button>
                </div>
              )}

              {request.status === 'completed' && request.processedAt && (
                <div className="pt-4 border-t border-pink-500">
                  <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
                    Processed: {formatDate(request.processedAt)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

