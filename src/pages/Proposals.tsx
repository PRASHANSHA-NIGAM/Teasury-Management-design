import { useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProposals, mockTreasuries, mockUsers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import type { Proposal, ProposalStatus } from '@/types';

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTreasury, setSelectedTreasury] = useState<string>('');
  const { toast } = useToast();

  const handleCreateProposal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const amount = Number.parseFloat(formData.get('amount') as string);
    const recipient = formData.get('recipient') as string;
    const category = formData.get('category') as string;
    const lockDays = Number.parseInt(formData.get('lockDays') as string);

    if (!title || !description || !amount || !recipient || !category || !selectedTreasury || !lockDays) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Amount must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    const treasury = mockTreasuries.find(t => t.id === selectedTreasury);
    if (!treasury) {
      toast({
        title: 'Error',
        description: 'Selected treasury not found',
        variant: 'destructive',
      });
      return;
    }

    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + lockDays);

    const newProposal: Proposal = {
      id: String(proposals.length + 1),
      treasuryId: selectedTreasury,
      title,
      description,
      amount,
      recipient,
      category,
      status: 'pending',
      createdBy: mockUsers[0].id,
      createdAt: new Date().toISOString(),
      lockUntil: lockUntil.toISOString(),
      votes: [],
      requiredVotes: treasury.threshold,
    };

    setProposals([newProposal, ...proposals]);
    setIsDialogOpen(false);
    setSelectedTreasury('');
    toast({
      title: 'Proposal Created',
      description: `${title} has been submitted for voting`,
    });
  };

  const handleVote = (proposalId: string, approved: boolean) => {
    setProposals(proposals.map(p => {
      if (p.id === proposalId) {
        const newVote = {
          userId: mockUsers[0].id,
          userName: mockUsers[0].name,
          approved,
          timestamp: new Date().toISOString(),
          signature: `0xsig${Date.now()}`,
        };
        const updatedVotes = [...p.votes, newVote];
        const approvedVotes = updatedVotes.filter(v => v.approved).length;
        
        let newStatus: ProposalStatus = p.status;
        if (approvedVotes >= p.requiredVotes) {
          newStatus = 'approved';
        }

        return { ...p, votes: updatedVotes, status: newStatus };
      }
      return p;
    }));

    toast({
      title: approved ? 'Vote Approved' : 'Vote Rejected',
      description: `You have ${approved ? 'approved' : 'rejected'} this proposal`,
    });
  };

  const getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'executed':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: ProposalStatus) => {
    const variants = {
      pending: 'bg-warning text-warning-foreground',
      approved: 'bg-success text-success-foreground',
      rejected: 'bg-destructive text-destructive-foreground',
      executed: 'bg-primary text-primary-foreground',
      expired: 'bg-muted text-muted-foreground',
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const filterProposals = (status?: ProposalStatus) => {
    return status ? proposals.filter(p => p.status === status) : proposals;
  };

  const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const treasury = mockTreasuries.find(t => t.id === proposal.treasuryId);
    const approvedVotes = proposal.votes.filter(v => v.approved).length;
    const progress = (approvedVotes / proposal.requiredVotes) * 100;
    const hasVoted = proposal.votes.some(v => v.userId === mockUsers[0].id);
    const lockDate = new Date(proposal.lockUntil);
    const isLocked = lockDate > new Date();

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(proposal.status)}
                <CardTitle className="text-xl">{proposal.title}</CardTitle>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{proposal.description}</p>
            </div>
            {getStatusBadge(proposal.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-foreground">${proposal.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="font-semibold text-foreground">{treasury?.name}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Approval Progress</span>
              <span className="font-semibold text-foreground">
                {approvedVotes}/{proposal.requiredVotes} votes
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3 text-sm">
            <div>
              <p className="text-muted-foreground">Recipient</p>
              <p className="font-mono text-foreground">{proposal.recipient}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-semibold text-foreground">{proposal.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Lock Until</p>
              <p className="font-semibold text-foreground">
                {lockDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-semibold text-foreground">
                {new Date(proposal.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {proposal.votes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Votes</p>
              <div className="space-y-2">
                {proposal.votes.map((vote, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{vote.userName}</span>
                    <div className="flex items-center gap-2">
                      {vote.approved ? (
                        <ThumbsUp className="h-4 w-4 text-success" />
                      ) : (
                        <ThumbsDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {proposal.status === 'pending' && !hasVoted && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground"
                onClick={() => handleVote(proposal.id, true)}
                disabled={isLocked}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleVote(proposal.id, false)}
                disabled={isLocked}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}

          {isLocked && proposal.status === 'pending' && (
            <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning">
              <Clock className="mr-2 inline h-4 w-4" />
              This proposal is time-locked until {lockDate.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proposals</h1>
          <p className="mt-1 text-muted-foreground">Create and vote on treasury proposals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <Label htmlFor="title">Proposal Title</Label>
                <Input id="title" name="title" placeholder="e.g., Q2 Development Budget" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the proposal"
                  required
                />
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
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <div>
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    name="recipient"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Development, Marketing"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lockDays">Time Lock (days)</Label>
                <Input
                  id="lockDays"
                  name="lockDays"
                  type="number"
                  min="1"
                  placeholder="e.g., 7"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Number of days before the proposal can be executed
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Proposal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="executed">Executed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filterProposals().map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterProposals('pending').map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filterProposals('approved').map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </TabsContent>

        <TabsContent value="executed" className="space-y-4">
          {filterProposals('executed').map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
