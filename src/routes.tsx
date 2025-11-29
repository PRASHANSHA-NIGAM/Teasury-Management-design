import Dashboard from './pages/Dashboard';
import Treasuries from './pages/Treasuries';
import Proposals from './pages/Proposals';
import Policies from './pages/Policies';
import Transactions from './pages/Transactions';
import Members from './pages/Members';
import Emergency from './pages/Emergency';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    element: <Dashboard />,
  },
  {
    name: 'Treasuries',
    path: '/treasuries',
    element: <Treasuries />,
  },
  {
    name: 'Proposals',
    path: '/proposals',
    element: <Proposals />,
  },
  {
    name: 'Policies',
    path: '/policies',
    element: <Policies />,
  },
  {
    name: 'Transactions',
    path: '/transactions',
    element: <Transactions />,
  },
  {
    name: 'Members',
    path: '/members',
    element: <Members />,
  },
  {
    name: 'Emergency',
    path: '/emergency',
    element: <Emergency />,
  },
];

export default routes;
