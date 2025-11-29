"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { governanceService } from "@/services/governanceService";
import { Proposal } from "@/types/governance";
import { Calendar, ChevronRight, Loader2, Search, Vote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await governanceService.getProposals();
        setProposals(data);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default"; // Primary color
      case "PASSED":
        return "success"; // Green
      case "REJECTED":
        return "destructive"; // Red
      case "EXECUTED":
        return "secondary"; // Gray/Blue
      default:
        return "outline";
    }
  };

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Governance", href: "/governance" },
      ]}
    >
      <div className="space-y-6 my-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-accent/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative p-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Vote className="h-6 w-6 text-primary" />
                <h1 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  Governance
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Vote on asset sales and key decisions. Your tokens represent your voice in the HoroloFi ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <InputGroup>
          <InputGroupInput placeholder="Search proposals..." />
          <InputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>

        {/* Proposals List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Proposals</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading proposals...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <GlassCard
                  key={proposal.id}
                  className="p-6 hover:border-primary/50 transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getStatusColor(proposal.status) as any}>
                          {proposal.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Ends {new Date(proposal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {proposal.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {proposal.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="max-w-md pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Votes For: {proposal.votesFor}</span>
                          <span>Required: {Math.ceil(proposal.totalEligibleTokens * 0.51)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success transition-all duration-500"
                            style={{ width: `${(proposal.votesFor / proposal.totalEligibleTokens) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm text-muted-foreground">Sale Value</p>
                        <p className="text-lg font-bold">${proposal.currentValue.toLocaleString()}</p>
                      </div>
                      <Button asChild>
                        <Link href={`/governance/${proposal.id}`}>
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {proposals.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No active proposals found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
