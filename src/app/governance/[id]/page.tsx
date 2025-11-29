"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { governanceService } from "@/services/governanceService";
import { Proposal } from "@/types/governance";
import { ArrowLeft, CheckCircle2, Clock, ThumbsDown, ThumbsUp, Vote, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { isConnected } = useAccount();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<'FOR' | 'AGAINST' | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return;
      try {
        const data = await governanceService.getProposalById(id);
        if (data) {
          setProposal(data);
        } else {
          toast.error("Proposal not found");
          router.push("/governance");
        }
      } catch (error) {
        console.error("Failed to fetch proposal", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposal();
  }, [id, router]);

  const handleVote = async (decision: 'FOR' | 'AGAINST') => {
    if (!isConnected) {
      toast.error("Please connect your wallet to vote");
      return;
    }
    if (!proposal) return;

    setIsVoting(true);
    try {
      // Mock token amount (in real app, fetch from wallet balance)
      const mockTokenBalance = 50;

      await governanceService.vote(proposal.id, decision, mockTokenBalance);

      // Optimistic update
      setProposal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          votesFor: decision === 'FOR' ? prev.votesFor + mockTokenBalance : prev.votesFor,
          votesAgainst: decision === 'AGAINST' ? prev.votesAgainst + mockTokenBalance : prev.votesAgainst,
        };
      });

      setUserVote(decision);
      toast.success(`Successfully voted ${decision}`);
    } catch (error) {
      toast.error("Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading proposal...</div>
        </div>
      </MainLayout>
    );
  }

  if (!proposal) return null;

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const percentFor = (proposal.votesFor / proposal.totalEligibleTokens) * 100;
  const percentAgainst = (proposal.votesAgainst / proposal.totalEligibleTokens) * 100;
  const threshold = 51; // 51% required
  const isPassed = percentFor >= threshold;

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Governance", href: "/governance" },
        { label: "Proposal Details", href: `/governance/${id}` },
      ]}
    >
      <div className="space-y-6 my-6 max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
          <Link href="/governance">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Proposals
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={proposal.status === 'ACTIVE' ? 'default' : proposal.status === 'REJECTED' ? 'destructive' : 'outline'}
                      className={proposal.status === 'PASSED' ? 'bg-success/10 text-success border-success/20' : ''}
                    >
                      {proposal.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created {new Date(proposal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{proposal.title}</h1>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {proposal.description}
                </p>

                <div className="my-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h4 className="font-medium mb-2">Asset Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Asset Name:</span>
                      <p className="font-medium">{proposal.assetName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Proposed Sale Price:</span>
                      <p className="font-medium text-lg">${proposal.currentValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Voting Results */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6">Current Results</h3>

              <div className="space-y-6">
                {/* For */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-success">
                      <ThumbsUp className="h-4 w-4" /> Agree
                    </span>
                    <span>{proposal.votesFor.toLocaleString()} Tokens ({percentFor.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all duration-500"
                      style={{ width: `${percentFor}%` }}
                    />
                  </div>
                </div>

                {/* Against */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-destructive">
                      <ThumbsDown className="h-4 w-4" /> Disagree
                    </span>
                    <span>{proposal.votesAgainst.toLocaleString()} Tokens ({percentAgainst.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive transition-all duration-500"
                      style={{ width: `${percentAgainst}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Quorum Required: 51%</span>
                  <span className={isPassed ? "text-success font-medium" : ""}>
                    {isPassed ? "Threshold Met" : "Threshold Not Met"}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar - Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <GlassCard className="p-6 border-primary/20 shadow-lg shadow-primary/5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Vote className="h-5 w-5 text-primary" />
                  Cast Your Vote
                </h3>

                {proposal.status === 'ACTIVE' ? (
                  !userVote ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-4">
                        You have <strong>50</strong> eligible tokens to vote with.
                      </p>
                      <Button
                        className="w-full bg-success hover:bg-success/90 text-white"
                        onClick={() => handleVote('FOR')}
                        disabled={isVoting}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Vote Agree
                      </Button>
                      <Button
                        className="w-full bg-destructive hover:bg-destructive/90 text-white"
                        onClick={() => handleVote('AGAINST')}
                        disabled={isVoting}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Vote Disagree
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-10 w-10 text-success mx-auto" />
                      <h4 className="font-medium">Vote Submitted</h4>
                      <p className="text-sm text-muted-foreground">
                        You voted <strong>{userVote}</strong>
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6 space-y-3 bg-muted/30 rounded-lg">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                    <h4 className="font-medium">Voting Closed</h4>
                    <p className="text-sm text-muted-foreground">
                      This proposal is no longer accepting votes.
                    </p>
                  </div>
                )}
              </GlassCard>

              {/* Admin Actions (Mock) */}
              {proposal.status === 'PASSED' && (
                <GlassCard className="p-6 border-success/20">
                  <h3 className="font-semibold mb-2 text-success">Proposal Passed</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The community has approved this sale.
                  </p>
                  <Button className="w-full" variant="outline">
                    View Sale Status
                  </Button>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
