import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BalanceHistory } from '@/types';

interface BalanceChartProps {
  data: BalanceHistory[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const maxBalance = Math.max(...data.map((d) => d.balance));
  const minBalance = Math.min(...data.map((d) => d.balance));
  const range = maxBalance - minBalance;

  const getYPosition = (balance: number) => {
    return 100 - ((balance - minBalance) / range) * 100;
  };

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = getYPosition(item.balance);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treasury Balance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <polyline
              fill="url(#balanceGradient)"
              stroke="none"
              points={`0,100 ${points} 100,100`}
            />
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              points={points}
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = getYPosition(item.balance);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1"
                  fill="hsl(var(--primary))"
                  className="hover:r-2 transition-all"
                />
              );
            })}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
            {data.map((item, index) => (
              <span key={index}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold text-foreground">
              ${data[data.length - 1]?.balance.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Growth</p>
            <p className="text-2xl font-bold text-success">
              +{(((data[data.length - 1]?.balance - data[0]?.balance) / data[0]?.balance) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
