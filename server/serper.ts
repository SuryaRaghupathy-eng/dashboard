import type { SerperOrganicResult } from "@shared/schema";

const SERPER_API_URL = "https://google.serper.dev/search";
const RESULTS_PER_PAGE = 10;
const MAX_PAGES = 5;

interface SerperResponse {
  organic: Array<{
    title: string;
    link: string;
    snippet?: string;
    position: number;
  }>;
  searchParameters: {
    q: string;
    gl: string;
    page: number;
  };
}

export async function fetchSerperResults(
  keyword: string,
  countryCode: string,
  page: number = 1
): Promise<SerperOrganicResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  
  if (!apiKey) {
    throw new Error("SERPER_API_KEY environment variable is not set");
  }

  const start = (page - 1) * RESULTS_PER_PAGE;

  const response = await fetch(SERPER_API_URL, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: keyword,
      gl: countryCode.toLowerCase(),
      num: RESULTS_PER_PAGE,
      start: start,
    }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
  }

  const data: SerperResponse = await response.json();
  
  if (!data.organic || data.organic.length === 0) {
    return [];
  }
  
  return data.organic.map((result, index) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet,
    position: start + index + 1,
  }));
}

export async function fetchAllPagesResults(
  keyword: string,
  countryCode: string
): Promise<{ results: SerperOrganicResult[]; error?: string }> {
  const allResults: SerperOrganicResult[] = [];
  let fetchError: string | undefined;
  
  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const pageResults = await fetchSerperResults(keyword, countryCode, page);
      allResults.push(...pageResults);
      
      if (pageResults.length < RESULTS_PER_PAGE) {
        break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`Error fetching page ${page} for keyword "${keyword}":`, errorMessage);
      fetchError = `Failed at page ${page}: ${errorMessage}`;
      break;
    }
  }
  
  return { results: allResults, error: fetchError };
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function findRankingForDomain(
  results: SerperOrganicResult[],
  targetDomain: string
): { position: number | null; url: string | null; title: string | null } {
  const targetDomainClean = extractDomain(targetDomain);
  
  for (const result of results) {
    const resultDomain = extractDomain(result.link);
    
    if (resultDomain === targetDomainClean || resultDomain.endsWith(`.${targetDomainClean}`)) {
      return {
        position: result.position,
        url: result.link,
        title: result.title,
      };
    }
  }
  
  return {
    position: null,
    url: null,
    title: null,
  };
}
