// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
  balance: number; // Account balance in USD
  createdAt: Date;
  updatedAt: Date;
}

// Match Types
export interface Match {
  id: string;
  title: string;
  description: string;
  fortniteCode: string;
  status: 'upcoming' | 'open' | 'in-progress' | 'completed' | 'cancelled';
  maxPlayers: number;
  currentPlayers: number;
  playerIds: string[];
  objectives: Objective[];
  pot: number; // Total pot amount
  rolloverPot: number; // Amount rolled over from previous match
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
  createdBy: string; // Admin user ID
}

// Objective Types
export interface Objective {
  id: string;
  matchId: string;
  title: string;
  description: string;
  type: 'weapon' | 'item' | 'location' | 'elimination' | 'survival' | 'custom';
  parameters: ObjectiveParameters;
  baseOdds: number; // Base odds (100:1 = 100)
  calculatedOdds: number; // Final calculated odds
  totalBets: number; // Total amount bet on this objective
  winner?: string; // Player ID who completed objective
  completed: boolean;
  createdAt: Date;
}

export interface ObjectiveParameters {
  itemType?: string; // e.g., "Assault Rifle"
  itemCount?: number;
  location?: string;
  eliminationCount?: number;
  survivalTime?: number; // in minutes
  customRules?: string;
  difficultyMultiplier?: number; // Affects odds calculation
}

// Bet Types
export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  objectiveId: string;
  amount: number;
  potentialPayout: number; // Calculated based on odds
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: Date;
  resolvedAt?: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'rejected' | 'cancelled';
  cryptoAddress?: string; // Bitcoin address for deposit/withdrawal
  txHash?: string; // Transaction hash
  adminNotes?: string;
  createdAt: Date;
  completedAt?: Date;
  completedBy?: string; // Admin user ID
}

// Withdrawal Request Types
export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  cryptoAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: Date;
  processedAt?: Date;
  processedBy?: string; // Admin user ID
  txHash?: string; // Transaction hash when sent
}

// Admin Settings
export interface AdminSettings {
  id: string;
  bitcoinDepositAddress: string;
  defaultOdds: number; // Default base odds (100)
  minBetAmount: number;
  maxBetAmount: number;
  minWithdrawalAmount: number;
  updatedAt: Date;
  updatedBy: string;
}

