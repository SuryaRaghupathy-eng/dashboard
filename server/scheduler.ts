import { storage } from "./storage";
import { trackKeywordRanking } from "./serper";
import type { KeywordRanking, Settings } from "@shared/schema";

let schedulerInterval: NodeJS.Timeout | null = null;
let isRunning = false;
let currentIntervalMinutes = 5;
let lastCheckTime: Date | null = null;
let schedulerStartTime: Date | null = null;

function logScheduler(message: string): void {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [scheduler] ${message}`);
}

async function checkAllProjectRankings(): Promise<void> {
  if (isRunning) {
    logScheduler("Previous ranking check still in progress, skipping this cycle");
    return;
  }

  isRunning = true;
  lastCheckTime = new Date();
  try {
    const projects = await storage.getProjects();
    
    if (projects.length === 0) {
      logScheduler("No projects to check rankings for");
      return;
    }

    logScheduler(`Starting automatic ranking check for ${projects.length} project(s)`);

    for (const project of projects) {
      if (!project.keywords || project.keywords.length === 0) {
        logScheduler(`Skipping project "${project.name}" - no keywords`);
        continue;
      }

      try {
        const rankings: KeywordRanking[] = [];
        const checkedAt = new Date().toISOString();

        logScheduler(`Checking ${project.keywords.length} keyword(s) for project "${project.name}"`);

        for (const keyword of project.keywords) {
          try {
            const result = await trackKeywordRanking(
              keyword.text,
              project.websiteUrl,
              project.country
            );

            rankings.push({
              keywordId: keyword.id,
              keyword: keyword.text,
              found: result.found,
              position: result.overallPosition,
              page: result.page,
              positionOnPage: result.positionOnPage,
              url: result.url,
              title: result.title,
              checkedAt,
              error: result.error,
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logScheduler(`Error checking keyword "${keyword.text}": ${errorMessage}`);
            rankings.push({
              keywordId: keyword.id,
              keyword: keyword.text,
              found: false,
              position: null,
              page: null,
              positionOnPage: null,
              url: null,
              title: null,
              checkedAt,
              error: errorMessage,
            });
          }
        }

        await storage.saveRanking({
          projectId: project.id,
          rankings,
          checkedAt,
        });

        logScheduler(`Completed ranking check for project "${project.name}" - ${rankings.length} keywords checked`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logScheduler(`Error processing project "${project.name}": ${errorMessage}`);
      }
    }

    logScheduler("Automatic ranking check completed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logScheduler(`Scheduler error: ${errorMessage}`);
  } finally {
    isRunning = false;
  }
}

function startSchedulerWithInterval(intervalMinutes: number): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }

  currentIntervalMinutes = intervalMinutes;
  schedulerStartTime = new Date();
  const intervalMs = intervalMinutes * 60 * 1000;

  logScheduler(`Starting automatic ranking scheduler (every ${intervalMinutes} minutes)`);
  
  schedulerInterval = setInterval(checkAllProjectRankings, intervalMs);
  
  logScheduler(`Scheduler started - first automatic check in ${intervalMinutes} minutes`);
}

function handleSettingsChange(newSettings: Settings): void {
  if (newSettings.scheduleInterval !== currentIntervalMinutes) {
    logScheduler(`Schedule interval changed to ${newSettings.scheduleInterval} minutes, restarting scheduler`);
    startSchedulerWithInterval(newSettings.scheduleInterval);
  }
}

storage.setOnSettingsChange(handleSettingsChange);

export async function startScheduler(): Promise<void> {
  const settings = await storage.getSettings();
  startSchedulerWithInterval(settings.scheduleInterval);
}

export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    logScheduler("Scheduler stopped");
  }
}

export function runImmediateCheck(): Promise<void> {
  logScheduler("Running immediate ranking check");
  return checkAllProjectRankings();
}

export function getCurrentInterval(): number {
  return currentIntervalMinutes;
}

export function getSchedulerStatus(): {
  isRunning: boolean;
  intervalMinutes: number;
  lastCheckTime: string | null;
  nextCheckTime: string | null;
} {
  let nextCheckTime: string | null = null;
  
  if (schedulerStartTime && schedulerInterval) {
    const intervalMs = currentIntervalMinutes * 60 * 1000;
    const now = new Date().getTime();
    const startTime = schedulerStartTime.getTime();
    
    // Calculate how many intervals have passed since start
    const elapsed = now - startTime;
    const intervalsPassed = Math.floor(elapsed / intervalMs);
    const nextCheckMs = startTime + ((intervalsPassed + 1) * intervalMs);
    
    nextCheckTime = new Date(nextCheckMs).toISOString();
  }
  
  return {
    isRunning: !!schedulerInterval,
    intervalMinutes: currentIntervalMinutes,
    lastCheckTime: lastCheckTime?.toISOString() || null,
    nextCheckTime,
  };
}
