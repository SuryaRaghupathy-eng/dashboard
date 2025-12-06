import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Globe,
  MapPin,
  Clock,
  Search,
  Settings,
  BarChart3,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Monitor,
  Smartphone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@shared/schema";
import { countries, timezones } from "@shared/schema";

function getCountryName(code: string): string {
  return countries.find((c) => c.code === code)?.name || code;
}

function getTimezoneName(value: string): string {
  return timezones.find((t) => t.value === value)?.label || value;
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-9 w-9" />
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl space-y-8 px-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProjectDashboard() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Project not found</p>
        <Link href="/">
          <Button variant="ghost" className="mt-4">
            Go back
          </Button>
        </Link>
      </div>
    );
  }

  const enabledEngines = project.searchEngines?.filter((e) => e.enabled) || [];
  const keywordCount = project.keywords?.length || 0;

  return (
    <div className="flex min-h-screen flex-col bg-background" data-testid="page-project-dashboard">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-xl font-semibold">RankTracker</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-projects">
                <ArrowLeft className="h-4 w-4" />
                Projects
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl space-y-8 px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-project-name">
                  {project.name}
                </h1>
                <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                  Active
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground hover:underline"
                  data-testid="link-website-url"
                >
                  <Globe className="h-4 w-4" />
                  {project.websiteUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-settings">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button size="sm" className="gap-2" data-testid="button-check-rankings">
                <TrendingUp className="h-4 w-4" />
                Check Rankings
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card data-testid="card-keywords">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Keywords</p>
                    <p className="text-2xl font-semibold" data-testid="text-keyword-count">
                      {keywordCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-search-engines">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                    <BarChart3 className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Search Engines</p>
                    <p className="text-2xl font-semibold" data-testid="text-engine-count">
                      {enabledEngines.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-location">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                    <MapPin className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-lg font-semibold truncate" data-testid="text-country">
                      {getCountryName(project.country)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card data-testid="card-keywords-list">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg font-medium">Keywords</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" data-testid="button-add-keyword">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                {keywordCount > 0 ? (
                  <div className="space-y-2">
                    {project.keywords?.slice(0, 10).map((keyword, index) => (
                      <div
                        key={keyword.id || index}
                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                        data-testid={`row-keyword-${index}`}
                      >
                        <span className="text-sm font-medium">{keyword.text}</span>
                        {keyword.category && (
                          <Badge variant="secondary" className="text-xs">
                            {keyword.category}
                          </Badge>
                        )}
                      </div>
                    ))}
                    {keywordCount > 10 && (
                      <p className="pt-2 text-center text-sm text-muted-foreground">
                        +{keywordCount - 10} more keywords
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No keywords added yet</p>
                    <Button variant="outline" size="sm" className="mt-4 gap-1" data-testid="button-add-keywords-empty">
                      <Plus className="h-4 w-4" />
                      Add Keywords
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-search-engines-list">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg font-medium">Search Engines</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" data-testid="button-configure-engines">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
              </CardHeader>
              <CardContent>
                {enabledEngines.length > 0 ? (
                  <div className="space-y-3">
                    {enabledEngines.map((engine, index) => (
                      <div
                        key={engine.id || index}
                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                        data-testid={`row-engine-${index}`}
                      >
                        <span className="text-sm font-medium">{engine.name}</span>
                        <div className="flex items-center gap-2">
                          {(engine.deviceType === "desktop" || engine.deviceType === "both") && (
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                          )}
                          {(engine.deviceType === "mobile" || engine.deviceType === "both") && (
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No search engines enabled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-project-info" className="max-w-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    {project.websiteUrl}
                  </a>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Country / Location</p>
                  <p className="text-sm font-medium" data-testid="text-country-full">
                    {getCountryName(project.country)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Timezone</p>
                  <p className="text-sm font-medium" data-testid="text-timezone">
                    {getTimezoneName(project.timezone)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
