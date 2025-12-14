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
  writeBatch
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

// User Operations
export async function getUser(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function createUser(userId: string, email: string, displayName?: string): Promise<User> {
  const userData: Omit<User, 'id'> = {
    email,
    displayName,
    role: 'user',
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: userId, ...userData };
}

export async function updateUserBalance(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const user = await getUser(userId);
  if (!user) throw new Error('User not found');
  
  await updateDoc(userRef, {
    balance: user.balance + amount,
    updatedAt: serverTimestamp(),
  });
}

// Match Operations
export async function getMatch(matchId: string): Promise<Match | null> {
  const matchDoc = await getDoc(doc(db, 'matches', matchId));
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
  let q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
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
  const matchRef = doc(collection(db, 'matches'));
  await setDoc(matchRef, {
    ...matchData,
    createdAt: serverTimestamp(),
  });
  return matchRef.id;
}

export async function updateMatch(matchId: string, updates: Partial<Match>): Promise<void> {
  await updateDoc(doc(db, 'matches', matchId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function addPlayerToMatch(matchId: string, playerId: string): Promise<void> {
  const match = await getMatch(matchId);
  if (!match) throw new Error('Match not found');
  if (match.playerIds.includes(playerId)) return; // Already added
  if (match.currentPlayers >= match.maxPlayers) throw new Error('Match is full');
  
  await updateDoc(doc(db, 'matches', matchId), {
    playerIds: [...match.playerIds, playerId],
    currentPlayers: match.currentPlayers + 1,
  });
}

// Objective Operations
export async function getObjectives(matchId: string): Promise<Objective[]> {
  const q = query(
    collection(db, 'objectives'),
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
  const objectiveRef = doc(collection(db, 'objectives'));
  await setDoc(objectiveRef, {
    ...objectiveData,
    createdAt: serverTimestamp(),
  });
  return objectiveRef.id;
}

export async function updateObjective(objectiveId: string, updates: Partial<Objective>): Promise<void> {
  await updateDoc(doc(db, 'objectives', objectiveId), updates);
}

// Bet Operations
export async function createBet(betData: Omit<Bet, 'id' | 'createdAt'>): Promise<string> {
  const betRef = doc(collection(db, 'bets'));
  await setDoc(betRef, {
    ...betData,
    createdAt: serverTimestamp(),
  });
  return betRef.id;
}

export async function getBets(userId?: string, matchId?: string): Promise<Bet[]> {
  let q = query(collection(db, 'bets'), orderBy('createdAt', 'desc'));
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
  await updateDoc(doc(db, 'bets', betId), {
    ...updates,
    resolvedAt: updates.status !== 'pending' ? serverTimestamp() : undefined,
  });
}

// Transaction Operations
export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
  const txRef = doc(collection(db, 'transactions'));
  await setDoc(txRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
  });
  return txRef.id;
}

export async function getTransactions(userId?: string): Promise<Transaction[]> {
  let q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
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
  await updateDoc(doc(db, 'transactions', transactionId), {
    ...updates,
    completedAt: updates.status === 'completed' ? serverTimestamp() : undefined,
  });
}

// Withdrawal Request Operations
export async function createWithdrawalRequest(
  requestData: Omit<WithdrawalRequest, 'id' | 'createdAt'>
): Promise<string> {
  const requestRef = doc(collection(db, 'withdrawalRequests'));
  await setDoc(requestRef, {
    ...requestData,
    createdAt: serverTimestamp(),
  });
  return requestRef.id;
}

export async function getWithdrawalRequests(status?: WithdrawalRequest['status']): Promise<WithdrawalRequest[]> {
  let q = query(collection(db, 'withdrawalRequests'), orderBy('createdAt', 'desc'));
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
  await updateDoc(doc(db, 'withdrawalRequests', requestId), {
    ...updates,
    processedAt: updates.status === 'completed' ? serverTimestamp() : undefined,
  });
}

// Admin Settings
export async function getAdminSettings(): Promise<AdminSettings | null> {
  const settingsDoc = await getDoc(doc(db, 'adminSettings', 'main'));
  if (!settingsDoc.exists()) return null;
  const data = settingsDoc.data();
  return {
    id: settingsDoc.id,
    ...data,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as AdminSettings;
}

export async function updateAdminSettings(settings: Partial<AdminSettings>, updatedBy: string): Promise<void> {
  await setDoc(doc(db, 'adminSettings', 'main'), {
    ...settings,
    updatedAt: serverTimestamp(),
    updatedBy,
  }, { merge: true });
}

