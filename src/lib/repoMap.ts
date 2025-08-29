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

export const getRepoCustomUrl = (name: string): string | undefined => {
  return repoConfigs.find(c => c.repo === name)?.url;
};

export const listStaticRepos = (): RepoConfig[] => repoConfigs.slice();

