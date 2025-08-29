import type { RepoConfig } from '@/lib/repoMap';

const GITHUB_API = 'https://api.github.com';

export interface GithubRepoSummary {
  name: string;
  private: boolean;
  html_url: string;
  description?: string | null;
}

export const fetchGithubRepos = async (user: string, token?: string): Promise<GithubRepoSummary[]> => {
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const url = `${GITHUB_API}/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data = await res.json();
  return (data as any[]).map((r) => ({
    name: r.name,
    private: !!r.private,
    html_url: r.html_url,
    description: r.description,
  }));
};

export const mapGithubToRepoConfigs = (repos: GithubRepoSummary[]): RepoConfig[] => {
  return repos.map((r) => ({
    repo: r.name,
    displayName: r.name,
    url: undefined,
    source: 'github',
  }));
};

