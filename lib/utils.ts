import { Objective, ObjectiveParameters } from '@/types';

/**
 * Calculate betting odds based on objective parameters
 * Base odds: 100:1
 * Factors that affect odds:
 * - Item rarity/difficulty
 * - Number of items required
 * - Location difficulty
 * - Custom difficulty multiplier
 */
export function calculateOdds(objective: Objective): number {
  let odds = objective.baseOdds || 100;
  const params = objective.parameters;

  // Apply difficulty multiplier if set
  if (params.difficultyMultiplier) {
    odds = odds * params.difficultyMultiplier;
  }

  // Adjust for item count (more items = higher odds)
  if (params.itemCount && params.itemCount > 1) {
    odds = odds * (1 + params.itemCount * 0.1);
  }

  // Adjust for elimination count
  if (params.eliminationCount && params.eliminationCount > 1) {
    odds = odds * (1 + params.eliminationCount * 0.15);
  }

  // Round to nearest integer
  return Math.round(odds);
}

/**
 * Calculate potential payout based on bet amount and odds
 */
export function calculatePayout(betAmount: number, odds: number): number {
  // For odds of 100:1, a $1 bet pays $100
  return betAmount * odds;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

