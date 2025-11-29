import { useState } from 'react';
import { AlertTriangle, Pause, Play, Zap, Phone, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mockTreasuries, mockProposals } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Emergency() {
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const handleEmergencyPause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? 'System Resumed' : 'Emergency Pause Activated',
      description: isPaused 
        ? 'All treasury operations have been resumed'
        : 'All treasury operations have been paused',
      variant: isPaused ? 'default' : 'destructive',
    });
  };

  const handleFastTrack = (proposalId: string) => {
    toast({
      title: 'Fast-Track Initiated',
      description: 'Proposal has been marked for emergency approval',
    });
  };

  const emergencyContacts = [
    { name: 'Security Team', type: 'phone', value: '+1 (555) 123-4567', icon: Phone },
    { name: 'Treasury Lead', type: 'email', value: 'treasury@dao.org', icon: Mail },
    { name: 'Emergency Chat', type: 'chat', value: 'Join Emergency Channel', icon: MessageSquare },
  ];

  const pendingProposals = mockProposals.filter(p => p.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Emergency Procedures</h1>
        <p className="mt-1 text-muted-foreground">Quick access to emergency controls and fast-track approvals</p>
      </div>

      <Alert variant="destructive" className="border-warning bg-warning/10">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <AlertTitle className="text-warning">Emergency Controls</AlertTitle>
        <AlertDescription className="text-warning-foreground">
          Use these controls only in critical situations. All emergency actions are logged and require post-incident review.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-2 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency Pause
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Immediately pause all treasury operations across all treasuries. This will prevent any new transactions, 
              proposals, or policy changes until the system is manually resumed.
            </p>
            
            <div className="rounded-lg bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">System Status</p>
                  <p className="text-sm text-muted-foreground">
                    {isPaused ? 'All operations paused' : 'All systems operational'}
                  </p>
                </div>
                <Badge variant={isPaused ? 'destructive' : 'default'} className="text-lg px-4 py-2">
                  {isPaused ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      PAUSED
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      ACTIVE
                    </>
                  )}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Affected Treasuries:</p>
              <div className="space-y-1">
                {mockTreasuries.map((treasury) => (
                  <div key={treasury.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{treasury.name}</span>
                    <Badge variant={isPaused ? 'destructive' : 'secondary'}>
                      {isPaused ? 'Paused' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant={isPaused ? 'default' : 'destructive'}
              className="w-full"
              size="lg"
              onClick={handleEmergencyPause}
            >
              {isPaused ? (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Resume All Operations
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Activate Emergency Pause
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Zap className="h-5 w-5" />
              Fast-Track Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bypass time-lock requirements for critical proposals. Fast-tracked proposals still require 
              the standard number of approvals but can be executed immediately.
            </p>

            {pendingProposals.length > 0 ? (
              <div className="space-y-3">
                {pendingProposals.map((proposal) => (
                  <div key={proposal.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{proposal.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Amount: ${proposal.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Votes: {proposal.votes.length}/{proposal.requiredVotes}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                        onClick={() => handleFastTrack(proposal.id)}
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Fast-Track
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">No pending proposals available for fast-tracking</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <contact.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Procedures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground">1. Security Breach</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Immediately activate emergency pause, contact security team, and initiate incident response protocol.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground">2. Smart Contract Vulnerability</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pause all operations, contact audit firm, and prepare for potential contract migration.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground">3. Critical Payment Required</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Use fast-track approval for urgent proposals, ensure minimum required signatures, and document justification.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground">4. Governance Attack</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Activate emergency pause, review all recent proposals and votes, and contact all treasury managers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
