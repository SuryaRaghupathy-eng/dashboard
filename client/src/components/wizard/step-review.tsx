import { Pencil, Globe, Tag, Search, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type ProjectFormData, countries, timezones } from "@shared/schema";
import { SiGoogle, SiBaidu } from "react-icons/si";

interface StepReviewProps {
  formData: ProjectFormData;
  goToStep: (step: number) => void;
}

function BingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M5 3v16.5l4.75 2.5v-6.38l8.5-2.75L13 10.75V3z"/>
    </svg>
  );
}

function YahooIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 12.47l4.73-8.24h3.56L14.02 14.5V21h-4.04v-6.5L3.71 4.23h3.56L12 12.47z"/>
    </svg>
  );
}

function YandexIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.32 21V11.28c1.76-.72 3.18-2.62 3.18-5.27 0-3.38-2.13-5.01-5.48-5.01H7v20h2.87v-7.85h.58L14.41 21h3.4l-4.49-8.43v-.02zM9.87 10.96V3.58h1.36c1.9 0 3.12.95 3.12 3.3 0 2.82-1.54 4.08-3.72 4.08H9.87z"/>
    </svg>
  );
}

const engineIcons: Record<string, React.ReactNode> = {
  google: <SiGoogle className="h-4 w-4" />,
  bing: <BingIcon className="h-4 w-4" />,
  yahoo: <YahooIcon className="h-4 w-4" />,
  yandex: <YandexIcon className="h-4 w-4" />,
  baidu: <SiBaidu className="h-4 w-4" />,
};

export function StepReview({ formData, goToStep }: StepReviewProps) {
  const countryName = countries.find((c) => c.code === formData.country)?.name || formData.country;
  const timezoneName = timezones.find((t) => t.value === formData.timezone)?.label || formData.timezone;
  const enabledEngines = formData.searchEngines.filter((e) => e.enabled);

  return (
    <div className="space-y-8" data-testid="step-review">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Review Your Project</h2>
        <p className="mt-2 text-muted-foreground">
          Please review your project settings before creating
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card data-testid="review-project-details">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(1)}
              data-testid="button-edit-project-details"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Project Name</span>
                <p className="font-medium" data-testid="text-review-name">{formData.name || "—"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Website URL</span>
                <p className="font-mono text-sm" data-testid="text-review-url">
                  {formData.websiteUrl || "—"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Country</span>
                <p className="font-medium" data-testid="text-review-country">{countryName || "—"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Timezone</span>
                <p className="font-medium" data-testid="text-review-timezone">{timezoneName || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="review-keywords">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Tag className="h-5 w-5 text-chart-2" />
              </div>
              <CardTitle className="text-lg">
                Keywords
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({formData.keywords.length})
                </span>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(2)}
              data-testid="button-edit-keywords"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {formData.keywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">No keywords added</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.slice(0, 20).map((keyword) => (
                  <Badge key={keyword.id} variant="secondary">
                    {keyword.text}
                  </Badge>
                ))}
                {formData.keywords.length > 20 && (
                  <Badge variant="outline">
                    +{formData.keywords.length - 20} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="review-search-engines">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Search className="h-5 w-5 text-chart-3" />
              </div>
              <CardTitle className="text-lg">
                Search Engines
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({enabledEngines.length})
                </span>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(3)}
              data-testid="button-edit-search-engines"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {enabledEngines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No search engines selected</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {enabledEngines.map((engine) => (
                  <div
                    key={engine.id}
                    className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
                  >
                    {engineIcons[engine.id]}
                    <span className="font-medium">{engine.name}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-muted-foreground capitalize">
                      {engine.deviceType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="review-competitors">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                <Users className="h-5 w-5 text-chart-4" />
              </div>
              <CardTitle className="text-lg">
                Competitors
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({formData.competitors.filter((c) => c.url).length})
                </span>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep(4)}
              data-testid="button-edit-competitors"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {formData.competitors.filter((c) => c.url).length === 0 ? (
              <p className="text-sm text-muted-foreground">No competitors added</p>
            ) : (
              <div className="space-y-2">
                {formData.competitors
                  .filter((c) => c.url)
                  .map((competitor, index) => (
                    <div
                      key={competitor.id}
                      className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-mono text-sm">{competitor.url}</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
