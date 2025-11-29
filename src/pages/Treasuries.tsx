import { useState } from 'react';
import { Plus, Wallet, Users, Shield, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockTreasuries } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import type { Treasury } from '@/types';

export default function Treasuries() {
  const [treasuries, setTreasuries] = useState<Treasury[]>(mockTreasuries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateTreasury = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const threshold = Number.parseInt(formData.get('threshold') as string);
    const signers = (formData.get('signers') as string).split(',').map(s => s.trim());

    if (!name || !description || !threshold || signers.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (threshold > signers.length) {
      toast({
        title: 'Validation Error',
        description: 'Threshold cannot exceed number of signers',
        variant: 'destructive',
      });
      return;
    }

    const newTreasury: Treasury = {
      id: String(treasuries.length + 1),
      name,
      description,
      balance: 0,
      threshold,
      signers,
      createdAt: new Date().toISOString(),
      isEmergencyPaused: false,
    };

    setTreasuries([...treasuries, newTreasury]);
    setIsDialogOpen(false);
    toast({
      title: 'Treasury Created',
      description: `${name} has been successfully created`,
    });
  };

  const toggleEmergencyPause = (id: string) => {
    setTreasuries(treasuries.map(t => 
      t.id === id ? { ...t, isEmergencyPaused: !t.isEmergencyPaused } : t
    ));
    const treasury = treasuries.find(t => t.id === id);
    toast({
      title: treasury?.isEmergencyPaused ? 'Emergency Unpaused' : 'Emergency Paused',
      description: `${treasury?.name} has been ${treasury?.isEmergencyPaused ? 'resumed' : 'paused'}`,
      variant: treasury?.isEmergencyPaused ? 'default' : 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Treasuries</h1>
          <p className="mt-1 text-muted-foreground">Manage your multi-signature treasuries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Treasury
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Treasury</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTreasury} className="space-y-4">
              <div>
                <Label htmlFor="name">Treasury Name</Label>
                <Input id="name" name="name" placeholder="e.g., Development Fund" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of this treasury"
                  required
                />
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <div>
                  <Label htmlFor="threshold">Approval Threshold</Label>
                  <Input
                    id="threshold"
                    name="threshold"
                    type="number"
                    min="1"
                    placeholder="e.g., 3"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Number of signatures required for approval
                  </p>
                </div>
                <div>
                  <Label htmlFor="signers">Signers (comma-separated)</Label>
                  <Input
                    id="signers"
                    name="signers"
                    placeholder="0x123..., 0x456..."
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Wallet addresses of authorized signers
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Treasury</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {treasuries.map((treasury) => (
          <Card key={treasury.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{treasury.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{treasury.description}</p>
                  </div>
                </div>
                {treasury.isEmergencyPaused && (
                  <Badge variant="destructive" className="gap-1">
                    <Pause className="h-3 w-3" />
                    Paused
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${treasury.balance.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Threshold</p>
                      <p className="font-semibold text-foreground">{treasury.threshold} of {treasury.signers.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Signers</p>
                      <p className="font-semibold text-foreground">{treasury.signers.length}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Authorized Signers</p>
                  <div className="space-y-1">
                    {treasury.signers.slice(0, 3).map((signer, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-success" />
                        {signer}
                      </div>
                    ))}
                    {treasury.signers.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{treasury.signers.length - 3} more
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button
                    variant={treasury.isEmergencyPaused ? 'default' : 'destructive'}
                    onClick={() => toggleEmergencyPause(treasury.id)}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    {treasury.isEmergencyPaused ? 'Resume' : 'Pause'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
