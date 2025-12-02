import { Check, Monitor, Smartphone, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { type ProjectFormData, type SearchEngine } from "@shared/schema";
import { SiGoogle, SiBaidu } from "react-icons/si";

interface StepSearchEnginesProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
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
  google: <SiGoogle className="h-6 w-6" />,
  bing: <BingIcon className="h-6 w-6" />,
  yahoo: <YahooIcon className="h-6 w-6" />,
  yandex: <YandexIcon className="h-6 w-6" />,
  baidu: <SiBaidu className="h-6 w-6" />,
};

const engineColors: Record<string, string> = {
  google: "text-[#4285F4]",
  bing: "text-[#00809D]",
  yahoo: "text-[#6001D2]",
  yandex: "text-[#FF0000]",
  baidu: "text-[#2319DC]",
};

export function StepSearchEngines({
  formData,
  updateFormData,
}: StepSearchEnginesProps) {
  const toggleEngine = (engineId: string) => {
    const updatedEngines = formData.searchEngines.map((engine) =>
      engine.id === engineId ? { ...engine, enabled: !engine.enabled } : engine
    );
    updateFormData({ searchEngines: updatedEngines });
  };

  const updateDeviceType = (
    engineId: string,
    deviceType: SearchEngine["deviceType"]
  ) => {
    const updatedEngines = formData.searchEngines.map((engine) =>
      engine.id === engineId ? { ...engine, deviceType } : engine
    );
    updateFormData({ searchEngines: updatedEngines });
  };

  const enabledCount = formData.searchEngines.filter((e) => e.enabled).length;

  return (
    <div className="space-y-8" data-testid="step-search-engines">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Search Engines</h2>
        <p className="mt-2 text-muted-foreground">
          Select which search engines to track rankings on
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Available Search Engines</Label>
          <span className="text-sm text-muted-foreground" data-testid="text-engine-count">
            {enabledCount} selected
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formData.searchEngines.map((engine) => (
            <div
              key={engine.id}
              className={cn(
                "relative rounded-lg border-2 p-4 transition-all cursor-pointer hover-elevate",
                engine.enabled
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
              onClick={() => toggleEngine(engine.id)}
              data-testid={`card-engine-${engine.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex-shrink-0", engineColors[engine.id])}>
                    {engineIcons[engine.id]}
                  </div>
                  <span className="font-medium">{engine.name}</span>
                </div>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                    engine.enabled
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {engine.enabled && <Check className="h-3 w-3" />}
                </div>
              </div>

              {engine.enabled && (
                <div
                  className="mt-4 pt-4 border-t"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Device Type
                  </Label>
                  <RadioGroup
                    value={engine.deviceType}
                    onValueChange={(value) =>
                      updateDeviceType(engine.id, value as SearchEngine["deviceType"])
                    }
                    className="mt-2 flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="desktop"
                        id={`${engine.id}-desktop`}
                        data-testid={`radio-${engine.id}-desktop`}
                      />
                      <Label
                        htmlFor={`${engine.id}-desktop`}
                        className="flex items-center gap-1.5 text-sm font-normal cursor-pointer"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        Desktop
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="mobile"
                        id={`${engine.id}-mobile`}
                        data-testid={`radio-${engine.id}-mobile`}
                      />
                      <Label
                        htmlFor={`${engine.id}-mobile`}
                        className="flex items-center gap-1.5 text-sm font-normal cursor-pointer"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        Mobile
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="both"
                        id={`${engine.id}-both`}
                        data-testid={`radio-${engine.id}-both`}
                      />
                      <Label
                        htmlFor={`${engine.id}-both`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        Both
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          ))}
        </div>

        {enabledCount === 0 && (
          <p className="text-center text-sm text-amber-600 dark:text-amber-400" data-testid="warning-no-engines">
            Please select at least one search engine to track rankings.
          </p>
        )}
      </div>
    </div>
  );
}
