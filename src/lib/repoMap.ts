export interface RepoConfig {
  repo: string;
  displayName?: string;
  url?: string; // custom deployed URL
  source?: 'github' | 'lovable';
}

// Override or friendly names for known repos
export const repoConfigs: RepoConfig[] = [
  { repo: 'NXConner', displayName: 'NXConner (Profile)', url: 'https://github.com/NXConner', source: 'github' },
];

export const getRepoDisplayName = (name: string): string => {
  const cfg = repoConfigs.find(c => c.repo === name);
  return cfg?.displayName || name;
};

const getUserCustomUrlMap = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem('asphaltos.repo.customUrls') || '{}';
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const getRepoCustomUrl = (name: string): string | undefined => {
  const fromStatic = repoConfigs.find(c => c.repo === name)?.url;
  if (fromStatic) return fromStatic;
  const map = getUserCustomUrlMap();
  return map[name];
};

export const listStaticRepos = (): RepoConfig[] => repoConfigs.slice();

