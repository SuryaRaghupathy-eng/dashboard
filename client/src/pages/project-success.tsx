import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ArrowRight, BarChart3, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Project } from "@shared/schema";

export default function ProjectSuccess() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">R</span>
              </div>
              <span className="text-xl font-semibold">RankTracker</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-2xl space-y-6 px-6 text-center">
            <Skeleton className="mx-auto h-20 w-20 rounded-full" />
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-4 w-96" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" data-testid="page-project-success">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-xl font-semibold">RankTracker</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-2xl space-y-8 px-6 text-center">
          <div className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-chart-2/10">
              <CheckCircle2 className="h-10 w-10 text-chart-2" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight" data-testid="text-success-title">
              Project Created Successfully!
            </h1>
            <p className="text-muted-foreground">
              Your project <span className="font-medium text-foreground">{project?.name}</span> is
              now ready to track rankings.
            </p>
          </div>

          <Card>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4 text-left">
                <span className="text-sm text-muted-foreground">Keywords</span>
                <p className="text-2xl font-semibold" data-testid="text-keyword-count">
                  {project?.keywords?.length || 0}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-left">
                <span className="text-sm text-muted-foreground">Search Engines</span>
                <p className="text-2xl font-semibold" data-testid="text-engine-count">
                  {project?.searchEngines?.filter((e) => e.enabled).length || 0}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-left">
                <span className="text-sm text-muted-foreground">Competitors</span>
                <p className="text-2xl font-semibold" data-testid="text-competitor-count">
                  {project?.competitors?.filter((c) => c.url).length || 0}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-left">
                <span className="text-sm text-muted-foreground">Website</span>
                <p className="truncate font-mono text-sm" data-testid="text-website-url">
                  {project?.websiteUrl}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2" data-testid="button-view-dashboard">
              <BarChart3 className="h-5 w-5" />
              View Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-project-settings">
              <Settings className="h-5 w-5" />
              Project Settings
            </Button>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button variant="link" className="gap-1 text-muted-foreground" data-testid="link-create-another">
                Create another project
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
