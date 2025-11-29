import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTransactions, mockTreasuries } from '@/data/mockData';
import type { Transaction, TransactionStatus } from '@/types';

export default function Transactions() {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-success" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-warning" />;
      case 'transfer':
        return <ArrowRightLeft className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const variants = {
      pending: 'bg-warning text-warning-foreground',
      completed: 'bg-success text-success-foreground',
      failed: 'bg-destructive text-destructive-foreground',
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const filterTransactions = (type?: Transaction['type']) => {
    return type ? mockTransactions.filter(t => t.type === type) : mockTransactions;
  };

  const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
    const treasury = mockTreasuries.find(t => t.id === transaction.treasuryId);

    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {getTransactionIcon(transaction.type)}
            </div>
            <div>
              <p className="font-medium text-foreground capitalize">{transaction.type}</p>
              <p className="text-sm text-muted-foreground">{treasury?.name}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className="font-mono text-sm text-foreground">{transaction.from}</p>
            <p className="text-xs text-muted-foreground">From</p>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className="font-mono text-sm text-foreground">{transaction.to}</p>
            <p className="text-xs text-muted-foreground">To</p>
          </div>
        </TableCell>
        <TableCell>
          <p className="font-semibold text-foreground">${transaction.amount.toLocaleString()}</p>
        </TableCell>
        <TableCell>
          {getStatusBadge(transaction.status)}
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className="text-sm text-foreground">
              {new Date(transaction.timestamp).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </TableCell>
        <TableCell>
          {transaction.gasUsed && (
            <p className="text-sm text-muted-foreground">{transaction.gasUsed} SUI</p>
          )}
        </TableCell>
        <TableCell>
          <a
            href={`#tx-${transaction.txHash}`}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View
            <ExternalLink className="h-3 w-3" />
          </a>
        </TableCell>
      </TableRow>
    );
  };

  const totalVolume = mockTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGasUsed = mockTransactions
    .filter(t => t.gasUsed)
    .reduce((sum, t) => sum + (t.gasUsed || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="mt-1 text-muted-foreground">Complete transaction history and audit trail</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  ${totalVolume.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ArrowRightLeft className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {mockTransactions.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <ArrowDownLeft className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gas Used</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {totalGasUsed.toFixed(3)} SUI
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <ArrowUpRight className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposit">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
              <TabsTrigger value="transfer">Transfers</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Gas</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterTransactions().map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="deposit" className="mt-6">
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Gas</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterTransactions('deposit').map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="withdrawal" className="mt-6">
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Gas</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterTransactions('withdrawal').map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="transfer" className="mt-6">
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Gas</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterTransactions('transfer').map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
