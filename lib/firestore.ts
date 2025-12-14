import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp,
  serverTimestamp,
  writeBatch,
  Firestore
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  User, 
  Match, 
  Objective, 
  Bet, 
  Transaction, 
  WithdrawalRequest, 
  AdminSettings 
} from '@/types';

// Helper function to ensure db is initialized
function ensureDb(): Firestore {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
  }
  return db;
}

// User Operations
export async function getUser(userId: string): Promise<User | null> {
  const firestore = ensureDb();
  const userDoc = await getDoc(doc(firestore, 'users', userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function createUser(userId: string, email: string, displayName?: string): Promise<User> {
  const firestore = ensureDb();
  const userData: Omit<User, 'id'> = {
    email,
    displayName,
    role: 'user',
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(doc(firestore, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: userId, ...userData };
}

export async function updateUserBalance(userId: string, amount: number): Promise<void> {
  const firestore = ensureDb();
  const userRef = doc(firestore, 'users', userId);
  const user = await getUser(userId);
  if (!user) throw new Error('User not found');
  
  await updateDoc(userRef, {
    balance: user.balance + amount,
    updatedAt: serverTimestamp(),
  });
}

// Match Operations
export async function getMatch(matchId: string): Promise<Match | null> {
  const firestore = ensureDb();
  const matchDoc = await getDoc(doc(firestore, 'matches', matchId));
  if (!matchDoc.exists()) return null;
  const data = matchDoc.data();
  return {
    id: matchDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    startDate: data.startDate?.toDate(),
    endDate: data.endDate?.toDate(),
  } as Match;
}

export async function getMatches(status?: Match['status']): Promise<Match[]> {
  const firestore = ensureDb();
  let q = query(collection(firestore, 'matches'), orderBy('createdAt', 'desc'));
  if (status) {
    q = query(q, where('status', '==', status));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      startDate: data.startDate?.toDate(),
      endDate: data.endDate?.toDate(),
    } as Match;
  });
}

export async function createMatch(matchData: Omit<Match, 'id' | 'createdAt'>): Promise<string> {
  const firestore = ensureDb();
  const matchRef = doc(collection(firestore, 'matches'));
  await setDoc(matchRef, {
    ...matchData,
    createdAt: serverTimestamp(),
  });
  return matchRef.id;
}

export async function updateMatch(matchId: string, updates: Partial<Match>): Promise<void> {
  const firestore = ensureDb();
  await updateDoc(doc(firestore, 'matches', matchId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function addPlayerToMatch(matchId: string, playerId: string): Promise<void> {
  const match = await getMatch(matchId);
  if (!match) throw new Error('Match not found');
  if (match.playerIds.includes(playerId)) return; // Already added
  if (match.currentPlayers >= match.maxPlayers) throw new Error('Match is full');
  
  const firestore = ensureDb();
  await updateDoc(doc(firestore, 'matches', matchId), {
    playerIds: [...match.playerIds, playerId],
    currentPlayers: match.currentPlayers + 1,
  });
}

// Objective Operations
export async function getObjectives(matchId: string): Promise<Objective[]> {
  const firestore = ensureDb();
  const q = query(
    collection(firestore, 'objectives'),
    where('matchId', '==', matchId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Objective;
  });
}

export async function createObjective(objectiveData: Omit<Objective, 'id' | 'createdAt'>): Promise<string> {
  const firestore = ensureDb();
  const objectiveRef = doc(collection(firestore, 'objectives'));
  await setDoc(objectiveRef, {
    ...objectiveData,
    createdAt: serverTimestamp(),
  });
  return objectiveRef.id;
}

export async function updateObjective(objectiveId: string, updates: Partial<Objective>): Promise<void> {
  const firestore = ensureDb();
  await updateDoc(doc(firestore, 'objectives', objectiveId), updates);
}

// Bet Operations
export async function createBet(betData: Omit<Bet, 'id' | 'createdAt'>): Promise<string> {
  const firestore = ensureDb();
  const betRef = doc(collection(firestore, 'bets'));
  await setDoc(betRef, {
    ...betData,
    createdAt: serverTimestamp(),
  });
  return betRef.id;
}

export async function getBets(userId?: string, matchId?: string): Promise<Bet[]> {
  const firestore = ensureDb();
  let q = query(collection(firestore, 'bets'), orderBy('createdAt', 'desc'));
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  if (matchId) {
    q = query(q, where('matchId', '==', matchId));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      resolvedAt: data.resolvedAt?.toDate(),
    } as Bet;
  });
}

export async function updateBet(betId: string, updates: Partial<Bet>): Promise<void> {
  const firestore = ensureDb();
  await updateDoc(doc(firestore, 'bets', betId), {
    ...updates,
    resolvedAt: updates.status !== 'pending' ? serverTimestamp() : undefined,
  });
}

// Transaction Operations
export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
  const firestore = ensureDb();
  const txRef = doc(collection(firestore, 'transactions'));
  await setDoc(txRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
  });
  return txRef.id;
}

export async function getTransactions(userId?: string): Promise<Transaction[]> {
  const firestore = ensureDb();
  let q = query(collection(firestore, 'transactions'), orderBy('createdAt', 'desc'));
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      completedAt: data.completedAt?.toDate(),
    } as Transaction;
  });
}

export async function updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
  const firestore = ensureDb();
  await updateDoc(doc(firestore, 'transactions', transactionId), {
    ...updates,
    completedAt: updates.status === 'completed' ? serverTimestamp() : undefined,
  });
}

// Withdrawal Request Operations
export async function createWithdrawalRequest(
  requestData: Omit<WithdrawalRequest, 'id' | 'createdAt'>
): Promise<string> {
  const firestore = ensureDb();
  const requestRef = doc(collection(firestore, 'withdrawalRequests'));
  await setDoc(requestRef, {
    ...requestData,
    createdAt: serverTimestamp(),
  });
  return requestRef.id;
}

export async function getWithdrawalRequests(status?: WithdrawalRequest['status']): Promise<WithdrawalRequest[]> {
  const firestore = ensureDb();
  let q = query(collection(firestore, 'withdrawalRequests'), orderBy('createdAt', 'desc'));
  if (status) {
    q = query(q, where('status', '==', status));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      processedAt: data.processedAt?.toDate(),
    } as WithdrawalRequest;
  });
}

export async function updateWithdrawalRequest(
  requestId: string, 
  updates: Partial<WithdrawalRequest>
): Promise<void> {
  const firestore = ensureDb();
  await updateDoc(doc(firestore, 'withdrawalRequests', requestId), {
    ...updates,
    processedAt: updates.status === 'completed' ? serverTimestamp() : undefined,
  });
}

// Admin Settings
export async function getAdminSettings(): Promise<AdminSettings | null> {
  const firestore = ensureDb();
  const settingsDoc = await getDoc(doc(firestore, 'adminSettings', 'main'));
  if (!settingsDoc.exists()) return null;
  const data = settingsDoc.data();
  return {
    id: settingsDoc.id,
    ...data,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as AdminSettings;
}

export async function updateAdminSettings(settings: Partial<AdminSettings>, updatedBy: string): Promise<void> {
  const firestore = ensureDb();
  await setDoc(doc(firestore, 'adminSettings', 'main'), {
    ...settings,
    updatedAt: serverTimestamp(),
    updatedBy,
  }, { merge: true });
}

