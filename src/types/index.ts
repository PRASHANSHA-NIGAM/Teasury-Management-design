export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'manager' | 'creator' | 'voter';

export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'expired';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type PolicyType = 'spending_limit' | 'whitelist' | 'blacklist' | 'category_limit';

export interface User {
  id: string;
  name: string;
  address: string;
  role: UserRole;
  avatar?: string;
}

export interface Treasury {
  id: string;
  name: string;
  description: string;
  balance: number;
  threshold: number;
  signers: string[];
  createdAt: string;
  isEmergencyPaused: boolean;
}

export interface Proposal {
  id: string;
  treasuryId: string;
  title: string;
  description: string;
  amount: number;
  recipient: string;
  category: string;
  status: ProposalStatus;
  createdBy: string;
  createdAt: string;
  lockUntil: string;
  executedAt?: string;
  votes: Vote[];
  requiredVotes: number;
}

export interface Vote {
  userId: string;
  userName: string;
  approved: boolean;
  timestamp: string;
  signature: string;
}

export interface Transaction {
  id: string;
  treasuryId: string;
  proposalId?: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  from: string;
  to: string;
  status: TransactionStatus;
  timestamp: string;
  gasUsed?: number;
  txHash: string;
}

export interface Policy {
  id: string;
  treasuryId: string;
  name: string;
  type: PolicyType;
  enabled: boolean;
  config: PolicyConfig;
  createdAt: string;
}

export interface PolicyConfig {
  dailyLimit?: number;
  monthlyLimit?: number;
  perTransactionLimit?: number;
  addresses?: string[];
  categories?: {
    name: string;
    limit: number;
  }[];
}

export interface DashboardStats {
  totalBalance: number;
  totalTreasuries: number;
  activeProposals: number;
  completedTransactions: number;
  pendingVotes: number;
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface BalanceHistory {
  date: string;
  balance: number;
}
