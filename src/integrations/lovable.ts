import type { RepoConfig } from '@/lib/repoMap';

// Placeholder for Lovable API discovery. Public listing is not documented; we use heuristics.
export interface LovableProjectSummary {
  id: string;
  slug?: string;
  name?: string;
  owner?: string;
}

// For now, return a static set if known; otherwise empty.
export const fetchLovableProjects = async (handle: string): Promise<LovableProjectSummary[]> => {
  // Lovable may not have a public list endpoint without auth; keep this graceful.
  try {
    // Attempt to fetch profile page as a signal. Not parsed here to avoid CORS and brittle scraping.
    await fetch(`https://lovable.dev/@${encodeURIComponent(handle)}`, { method: 'HEAD', mode: 'no-cors' as RequestMode });
  } catch {
    // ignore
  }
  return [];
};

export const mapLovableToRepoConfigs = (projects: LovableProjectSummary[]): RepoConfig[] => {
  return projects.map((p) => ({
    repo: p.slug || p.id,
    displayName: p.name || p.slug || p.id,
    url: p.slug ? `https://${p.slug}.lovable.app` : undefined,
    source: 'lovable',
  }));
};

