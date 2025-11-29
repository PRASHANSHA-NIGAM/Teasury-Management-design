import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, FileText, Shield, History, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Treasuries', href: '/treasuries', icon: Wallet },
  { name: 'Proposals', href: '/proposals', icon: FileText },
  { name: 'Policies', href: '/policies', icon: Shield },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Members', href: '/members', icon: Users },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wallet className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DAO Treasury</h1>
            <p className="text-xs text-sidebar-foreground/70">Management System</p>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-4">
        <div className="rounded-lg bg-sidebar-accent p-4">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-semibold">Emergency</span>
          </div>
          <p className="mt-2 text-xs text-sidebar-foreground/70">
            Quick access to emergency procedures and fast-track approvals
          </p>
          <Link
            to="/emergency"
            className="mt-3 block w-full rounded-md bg-warning px-3 py-2 text-center text-sm font-medium text-warning-foreground hover:bg-warning/90"
          >
            Emergency Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
