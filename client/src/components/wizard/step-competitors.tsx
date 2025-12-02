import { Plus, Trash2, Users, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type ProjectFormData, type Competitor } from "@shared/schema";

interface StepCompetitorsProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  errors: Record<string, string>;
}

export function StepCompetitors({
  formData,
  updateFormData,
  errors,
}: StepCompetitorsProps) {
  const addCompetitor = () => {
    if (formData.competitors.length >= 10) return;
    const newCompetitor: Competitor = {
      id: crypto.randomUUID(),
      url: "",
    };
    updateFormData({
      competitors: [...formData.competitors, newCompetitor],
    });
  };

  const updateCompetitor = (id: string, url: string) => {
    const updatedCompetitors = formData.competitors.map((c) =>
      c.id === id ? { ...c, url } : c
    );
    updateFormData({ competitors: updatedCompetitors });
  };

  const removeCompetitor = (id: string) => {
    updateFormData({
      competitors: formData.competitors.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-8" data-testid="step-competitors">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Competitors</h2>
        <p className="mt-2 text-muted-foreground">
          Add competitor websites to compare your rankings against
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Competitor Websites</Label>
          <span className="text-sm text-muted-foreground" data-testid="text-competitor-count">
            {formData.competitors.length}/10 competitors
          </span>
        </div>

        {formData.competitors.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center" data-testid="empty-competitors">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No competitors added yet. Track up to 10 competitor domains.
            </p>
            <Button
              variant="outline"
              onClick={addCompetitor}
              className="mt-4"
              data-testid="button-add-first-competitor"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Competitor
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.competitors.map((competitor, index) => (
              <div
                key={competitor.id}
                className="flex items-center gap-3"
                data-testid={`competitor-row-${competitor.id}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </span>
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://competitor.com"
                    value={competitor.url}
                    onChange={(e) => updateCompetitor(competitor.id, e.target.value)}
                    className={`pl-10 font-mono text-sm ${
                      errors[`competitor_${competitor.id}`] ? "border-destructive" : ""
                    }`}
                    data-testid={`input-competitor-${competitor.id}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCompetitor(competitor.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  data-testid={`button-remove-competitor-${competitor.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {formData.competitors.length > 0 && formData.competitors.length < 10 && (
          <Button
            variant="outline"
            onClick={addCompetitor}
            className="w-full"
            data-testid="button-add-competitor"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Competitor
          </Button>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Competitors are optional. You can always add or modify them later.
        </p>
      </div>
    </div>
  );
}
