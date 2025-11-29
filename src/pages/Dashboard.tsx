import { Wallet, FileText, CheckCircle, Vote } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDashboardStats, mockBalanceHistory, mockSpendingByCategory, mockProposals } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const recentProposals = mockProposals.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of your DAO treasury management</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={`$${mockDashboardStats.totalBalance.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Active Proposals"
          value={mockDashboardStats.activeProposals}
          icon={FileText}
        />
        <StatCard
          title="Completed Transactions"
          value={mockDashboardStats.completedTransactions}
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Votes"
          value={mockDashboardStats.pendingVotes}
          icon={Vote}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BalanceChart data={mockBalanceHistory} />
        <SpendingChart data={mockSpendingByCategory} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Proposals</CardTitle>
            <Link to="/proposals" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{proposal.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Amount: ${proposal.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>Votes: {proposal.votes.length}/{proposal.requiredVotes}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    proposal.status === 'approved'
                      ? 'default'
                      : proposal.status === 'pending'
                        ? 'secondary'
                        : proposal.status === 'executed'
                          ? 'default'
                          : 'destructive'
                  }
                  className={
                    proposal.status === 'approved'
                      ? 'bg-success text-success-foreground'
                      : proposal.status === 'pending'
                        ? 'bg-warning text-warning-foreground'
                        : proposal.status === 'executed'
                          ? 'bg-primary text-primary-foreground'
                          : ''
                  }
                >
                  {proposal.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
