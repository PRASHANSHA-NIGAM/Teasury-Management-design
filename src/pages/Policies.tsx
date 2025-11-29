import { useState } from 'react';
import { Plus, Shield, DollarSign, List, Ban, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPolicies, mockTreasuries } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import type { Policy, PolicyType } from '@/types';

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTreasury, setSelectedTreasury] = useState<string>('');
  const [selectedType, setSelectedType] = useState<PolicyType>('spending_limit');
  const { toast } = useToast();

  const handleCreatePolicy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;

    if (!name || !selectedTreasury || !selectedType) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    let config = {};

    if (selectedType === 'spending_limit') {
      const dailyLimit = Number.parseFloat(formData.get('dailyLimit') as string);
      const monthlyLimit = Number.parseFloat(formData.get('monthlyLimit') as string);
      const perTransactionLimit = Number.parseFloat(formData.get('perTransactionLimit') as string);

      if (dailyLimit <= 0 || monthlyLimit <= 0 || perTransactionLimit <= 0) {
        toast({
          title: 'Validation Error',
          description: 'All limits must be greater than 0',
          variant: 'destructive',
        });
        return;
      }

      config = { dailyLimit, monthlyLimit, perTransactionLimit };
    } else if (selectedType === 'whitelist' || selectedType === 'blacklist') {
      const addresses = (formData.get('addresses') as string).split(',').map(a => a.trim()).filter(a => a);
      if (addresses.length === 0) {
        toast({
          title: 'Validation Error',
          description: 'Please provide at least one address',
          variant: 'destructive',
        });
        return;
      }
      config = { addresses };
    } else if (selectedType === 'category_limit') {
      const categoryName = formData.get('categoryName') as string;
      const categoryLimit = Number.parseFloat(formData.get('categoryLimit') as string);
      if (!categoryName || categoryLimit <= 0) {
        toast({
          title: 'Validation Error',
          description: 'Please provide valid category name and limit',
          variant: 'destructive',
        });
        return;
      }
      config = { categories: [{ name: categoryName, limit: categoryLimit }] };
    }

    const newPolicy: Policy = {
      id: String(policies.length + 1),
      treasuryId: selectedTreasury,
      name,
      type: selectedType,
      enabled: true,
      config,
      createdAt: new Date().toISOString(),
    };

    setPolicies([...policies, newPolicy]);
    setIsDialogOpen(false);
    setSelectedTreasury('');
    toast({
      title: 'Policy Created',
      description: `${name} has been successfully created`,
    });
  };

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    const policy = policies.find(p => p.id === id);
    toast({
      title: policy?.enabled ? 'Policy Disabled' : 'Policy Enabled',
      description: `${policy?.name} has been ${policy?.enabled ? 'disabled' : 'enabled'}`,
    });
  };

  const getPolicyIcon = (type: PolicyType) => {
    switch (type) {
      case 'spending_limit':
        return <DollarSign className="h-5 w-5" />;
      case 'whitelist':
        return <List className="h-5 w-5" />;
      case 'blacklist':
        return <Ban className="h-5 w-5" />;
      case 'category_limit':
        return <Shield className="h-5 w-5" />;
    }
  };

  const getPolicyTypeLabel = (type: PolicyType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filterPolicies = (type?: PolicyType) => {
    return type ? policies.filter(p => p.type === type) : policies;
  };

  const PolicyCard = ({ policy }: { policy: Policy }) => {
    const treasury = mockTreasuries.find(t => t.id === policy.treasuryId);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${policy.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {getPolicyIcon(policy.type)}
              </div>
              <div>
                <CardTitle className="text-lg">{policy.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{treasury?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                {getPolicyTypeLabel(policy.type)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePolicy(policy.id)}
              >
                {policy.enabled ? (
                  <ToggleRight className="h-5 w-5 text-success" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {policy.type === 'spending_limit' && (
              <div className="grid grid-cols-3 gap-4">
                {policy.config.dailyLimit && (
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Daily Limit</p>
                    <p className="mt-1 font-semibold text-foreground">
                      ${policy.config.dailyLimit.toLocaleString()}
                    </p>
                  </div>
                )}
                {policy.config.monthlyLimit && (
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Monthly Limit</p>
                    <p className="mt-1 font-semibold text-foreground">
                      ${policy.config.monthlyLimit.toLocaleString()}
                    </p>
                  </div>
                )}
                {policy.config.perTransactionLimit && (
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Per Transaction</p>
                    <p className="mt-1 font-semibold text-foreground">
                      ${policy.config.perTransactionLimit.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(policy.type === 'whitelist' || policy.type === 'blacklist') && policy.config.addresses && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  {policy.type === 'whitelist' ? 'Approved' : 'Blocked'} Addresses ({policy.config.addresses.length})
                </p>
                <div className="space-y-1">
                  {policy.config.addresses.slice(0, 3).map((address, index) => (
                    <div key={index} className="flex items-center gap-2 rounded bg-muted/30 p-2 font-mono text-sm text-foreground">
                      <div className={`h-2 w-2 rounded-full ${policy.type === 'whitelist' ? 'bg-success' : 'bg-destructive'}`} />
                      {address}
                    </div>
                  ))}
                  {policy.config.addresses.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{policy.config.addresses.length - 3} more addresses
                    </p>
                  )}
                </div>
              </div>
            )}

            {policy.type === 'category_limit' && policy.config.categories && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Category Limits</p>
                <div className="space-y-2">
                  {policy.config.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <span className="font-medium text-foreground">{category.name}</span>
                      <span className="font-semibold text-primary">
                        ${category.limit.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-xs text-muted-foreground">
              Created on {new Date(policy.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Policies</h1>
          <p className="mt-1 text-muted-foreground">Configure programmable spending policies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <Label htmlFor="name">Policy Name</Label>
                <Input id="name" name="name" placeholder="e.g., Daily Spending Limit" required />
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <div>
                  <Label htmlFor="treasury">Treasury</Label>
                  <Select value={selectedTreasury} onValueChange={setSelectedTreasury} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select treasury" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTreasuries.map((treasury) => (
                        <SelectItem key={treasury.id} value={treasury.id}>
                          {treasury.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Policy Type</Label>
                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value as PolicyType)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spending_limit">Spending Limit</SelectItem>
                      <SelectItem value="whitelist">Whitelist</SelectItem>
                      <SelectItem value="blacklist">Blacklist</SelectItem>
                      <SelectItem value="category_limit">Category Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedType === 'spending_limit' && (
                <div className="grid gap-4 xl:grid-cols-3">
                  <div>
                    <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
                    <Input
                      id="dailyLimit"
                      name="dailyLimit"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                    <Input
                      id="monthlyLimit"
                      name="monthlyLimit"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="perTransactionLimit">Per Transaction ($)</Label>
                    <Input
                      id="perTransactionLimit"
                      name="perTransactionLimit"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              )}

              {(selectedType === 'whitelist' || selectedType === 'blacklist') && (
                <div>
                  <Label htmlFor="addresses">Addresses (comma-separated)</Label>
                  <Input
                    id="addresses"
                    name="addresses"
                    placeholder="0x123..., 0x456..."
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter wallet addresses separated by commas
                  </p>
                </div>
              )}

              {selectedType === 'category_limit' && (
                <div className="grid gap-4 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      name="categoryName"
                      placeholder="e.g., Development"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryLimit">Limit ($)</Label>
                    <Input
                      id="categoryLimit"
                      name="categoryLimit"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Policy</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="spending_limit">Spending Limits</TabsTrigger>
          <TabsTrigger value="whitelist">Whitelists</TabsTrigger>
          <TabsTrigger value="category_limit">Category Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid gap-4 xl:grid-cols-2">
          {filterPolicies().map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </TabsContent>

        <TabsContent value="spending_limit" className="grid gap-4 xl:grid-cols-2">
          {filterPolicies('spending_limit').map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </TabsContent>

        <TabsContent value="whitelist" className="grid gap-4 xl:grid-cols-2">
          {filterPolicies('whitelist').map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </TabsContent>

        <TabsContent value="category_limit" className="grid gap-4 xl:grid-cols-2">
          {filterPolicies('category_limit').map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
