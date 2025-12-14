'use client';

import { useState, useEffect } from 'react';
import { getTransactions, updateTransaction, updateUserBalance } from '@/lib/firestore';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDepositManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const allTransactions = await getTransactions();
      const deposits = allTransactions.filter(tx => tx.type === 'deposit');
      setTransactions(deposits);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (transaction: Transaction) => {
    const amountStr = prompt(`Enter deposit amount to credit (current: ${formatCurrency(transaction.amount)}):`);
    if (!amountStr) return; // User cancelled

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    if (!confirm(`Approve deposit of ${formatCurrency(amount)}?`)) return;

    try {
      // Update transaction status and amount
      await updateTransaction(transaction.id, {
        amount,
        status: 'completed',
        completedBy: 'admin', // TODO: Get actual admin user ID
      });

      // Credit user account
      await updateUserBalance(transaction.userId, amount);

      alert('Deposit approved and user account credited!');
      loadTransactions();
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Failed to approve deposit');
    }
  };

  const handleRejectDeposit = async (transaction: Transaction) => {
    const reason = prompt('Rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      await updateTransaction(transaction.id, {
        status: 'rejected',
        adminNotes: reason || undefined,
        completedBy: 'admin', // TODO: Get actual admin user ID
      });

      alert('Deposit rejected');
      loadTransactions();
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      alert('Failed to reject deposit');
    }
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(tx => tx.status === filter);

  if (loading) {
    return <div className="text-center font-mono" style={{ color: '#00ff41' }}>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-mono neon-text" style={{ color: '#00ffff' }}>
          DEPOSIT MANAGEMENT
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
        {filteredTransactions.length === 0 ? (
          <div className="bg-black/50 border-4 border-cyan-400 p-8 text-center">
            <p className="text-xl font-mono" style={{ color: '#ffff00' }}>
              NO DEPOSITS FOUND
            </p>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div
              key={tx.id}
              className="bg-black/70 border-4 border-cyan-400 p-6 space-y-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>USER ID</p>
                  <p className="text-sm font-mono break-all" style={{ color: '#00ff41' }}>
                    {tx.userId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>AMOUNT</p>
                  <p className="text-lg font-bold font-mono" style={{ color: '#00ff41' }}>
                    {formatCurrency(tx.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>STATUS</p>
                  <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
                    {tx.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>DATE</p>
                  <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
              </div>

              {tx.cryptoAddress && (
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>BITCOIN ADDRESS</p>
                  <p className="text-xs font-mono break-all" style={{ color: '#00ff41' }}>
                    {tx.cryptoAddress}
                  </p>
                </div>
              )}

              {tx.txHash && (
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>TX HASH</p>
                  <p className="text-xs font-mono break-all" style={{ color: '#00ff41' }}>
                    {tx.txHash}
                  </p>
                </div>
              )}

              {tx.adminNotes && (
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: '#ffff00' }}>ADMIN NOTES</p>
                  <p className="text-sm font-mono" style={{ color: '#00ffff' }}>
                    {tx.adminNotes}
                  </p>
                </div>
              )}

              {tx.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-cyan-400">
                  <button
                    onClick={() => handleApproveDeposit(tx)}
                    className="retro-button px-6 py-3 font-mono flex-1"
                    style={{ color: '#00ff41' }}
                  >
                    APPROVE & CREDIT
                  </button>
                  <button
                    onClick={() => handleRejectDeposit(tx)}
                    className="retro-button px-6 py-3 font-mono flex-1"
                    style={{ color: '#ff00ff' }}
                  >
                    REJECT
                  </button>
                </div>
              )}

              {tx.status === 'completed' && tx.completedAt && (
                <div className="pt-4 border-t border-cyan-400">
                  <p className="text-xs font-mono" style={{ color: '#00ff41' }}>
                    Completed: {formatDate(tx.completedAt)}
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

