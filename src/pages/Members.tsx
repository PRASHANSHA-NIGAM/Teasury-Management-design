import { Shield, UserCheck, FileEdit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockUsers } from '@/data/mockData';
import type { UserRole } from '@/types';

export default function Members() {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'manager':
        return <Shield className="h-4 w-4" />;
      case 'voter':
        return <UserCheck className="h-4 w-4" />;
      case 'creator':
        return <FileEdit className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      manager: 'bg-primary text-primary-foreground',
      voter: 'bg-success text-success-foreground',
      creator: 'bg-warning text-warning-foreground',
    };
    return (
      <Badge className={variants[role]}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    );
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'manager':
        return 'Full access to all treasury operations, can create treasuries and manage policies';
      case 'voter':
        return 'Can vote on proposals and view treasury information';
      case 'creator':
        return 'Can create proposals and view treasury information';
    }
  };

  const roleStats = {
    manager: mockUsers.filter(u => u.role === 'manager').length,
    voter: mockUsers.filter(u => u.role === 'voter').length,
    creator: mockUsers.filter(u => u.role === 'creator').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Members</h1>
        <p className="mt-1 text-muted-foreground">Manage DAO members and their roles</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{roleStats.manager}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voters</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{roleStats.voter}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Creators</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{roleStats.creator}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <FileEdit className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Manager</h3>
                  <p className="text-sm text-muted-foreground">{getRoleDescription('manager')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Voter</h3>
                  <p className="text-sm text-muted-foreground">{getRoleDescription('voter')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <FileEdit className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Creator</h3>
                  <p className="text-sm text-muted-foreground">{getRoleDescription('creator')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="font-mono text-sm text-muted-foreground">{user.address}</p>
                  </div>
                </div>
                {getRoleBadge(user.role)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
