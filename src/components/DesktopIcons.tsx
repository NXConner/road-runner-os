import { Button } from '@/components/ui/button';
import { Window } from './Desktop';
//
import { 
  Folder, 
  Trash2,
  HardDrive,
  Github,
  Code
} from 'lucide-react';
import { getRepoDisplayName, getRepoCustomUrl, listStaticRepos } from '@/lib/repoMap';
import { useEffect, useMemo, useState } from 'react';
import { fetchGithubRepos, mapGithubToRepoConfigs } from '@/integrations/github';
import { fetchLovableProjects, mapLovableToRepoConfigs } from '@/integrations/lovable';

interface DesktopIconsProps {
  onOpenWindow: (windowData: Omit<Window, 'id' | 'zIndex'>) => void;
}

export const DesktopIcons = ({ onOpenWindow }: DesktopIconsProps) => {
  const [dynamicRepos, setDynamicRepos] = useState<Array<{ name: string; icon: any }>>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    try {
      const raw = localStorage.getItem('asphaltos.desktop.iconPositions') || '{}';
      return JSON.parse(raw);
    } catch { return {}; }
  });
  const lovableSlugs = useMemo(() => {
    const raw = localStorage.getItem('asphaltos.lovable.projectSlugs') || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingRepos(true);
      try {
        const token = localStorage.getItem('asphaltos.github.token') || undefined;
        const gh = await fetchGithubRepos('NXConner', token).catch(() => []);
        const ghConfigs = mapGithubToRepoConfigs(gh);
        const lv = await fetchLovableProjects('nxconner').catch(() => []);
        const lvConfigs = mapLovableToRepoConfigs(lv);
        const combined = [...listStaticRepos(), ...ghConfigs, ...lvConfigs];
        const uniqueNames = Array.from(new Set(combined.map(c => c.repo)));
        const iconBySource: Record<string, any> = { github: Github };
        const fallbackIcon = Code;
        const mapped = uniqueNames.map(name => {
          const found = combined.find(c => c.repo === name);
          const icon = found?.source ? (iconBySource[found.source] || fallbackIcon) : fallbackIcon;
          return { name, icon };
        });
        if (!cancelled) setDynamicRepos(mapped);
      } finally {
        if (!cancelled) setLoadingRepos(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const repositories = useMemo(() => {
    if (loadingRepos && dynamicRepos.length === 0) {
      return [
        { name: 'NXConner', icon: Github, description: 'NXConner Profile Repository' },
      ];
    }
    return dynamicRepos.map(r => ({ name: r.name, icon: r.icon, description: '' }));
  }, [dynamicRepos, loadingRepos]);

  const desktopItems = [
    {
      id: 'my-computer',
      name: 'My Computer',
      icon: HardDrive,
      position: iconPositions['my-computer'] || { x: 20, y: 20 },
      kind: 'panel:my-computer' as const,
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: Folder,
      position: iconPositions['documents'] || { x: 20, y: 120 },
      kind: 'panel:documents' as const,
    },
    {
      id: 'recycle-bin',
      name: 'Recycle Bin',
      icon: Trash2,
      position: iconPositions['recycle-bin'] || { x: 20, y: 220 },
      kind: 'panel:recycle-bin' as const,
    },
    // Profiles
    {
      id: 'profile-github',
      name: 'GitHub - NXConner',
      icon: Github,
      position: iconPositions['profile-github'] || { x: 20, y: 320 },
      kind: 'web-browser' as const,
      meta: { initialUrl: 'https://github.com/NXConner' },
    },
    {
      id: 'profile-lovable',
      name: 'Lovable - @nxconner',
      icon: Code,
      position: iconPositions['profile-lovable'] || { x: 20, y: 420 },
      kind: 'web-browser' as const,
      meta: { initialUrl: 'https://lovable.dev/@nxconner' },
    },
    // Lovable projects from localStorage slugs
    ...lovableSlugs.map((slug, idx) => ({
      id: `lovable-${slug}`,
      name: slug,
      icon: Code,
      position: iconPositions[`lovable-${slug}`] || { x: 20, y: 520 + idx * 100 },
      kind: 'web-browser' as const,
      meta: { initialUrl: `https://${slug}.lovable.app` },
    })),
    // Add repository icons
    ...repositories.map((repo, index) => ({
      id: `repo-${repo.name}`,
      name: getRepoDisplayName(repo.name),
      icon: repo.icon,
      position: iconPositions[`repo-${repo.name}`] || { x: 120 + (index % 8) * 100, y: 20 + Math.floor(index / 8) * 100 },
      kind: 'repo-browser' as const,
      meta: { repoName: repo.name, initialUrl: getRepoCustomUrl(repo.name) }
    }))
  ];

  const handleDoubleClick = (item: (typeof desktopItems)[number]) => {
    const isRepo = item.id.startsWith('repo-');
    // item.kind and item.meta prepared above
    onOpenWindow({
      title: isRepo ? `${item.name} - AsphaltOS Browser` : item.name,
      kind: item.kind,
      meta: 'meta' in item ? item.meta : undefined,
      position: { x: 100, y: 50 },
      size: { width: isRepo ? 900 : 500, height: isRepo ? 600 : 400 },
      isMinimized: false,
      isMaximized: false,
    });
  };

  const startDrag = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    const item = desktopItems.find(i => i.id === itemId);
    if (!item) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = item.position.x;
    const startTop = item.position.y;

    const handleMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const next = { x: startLeft + dx, y: startTop + dy };
      const el = document.querySelector(`[data-icon-id="${itemId}"]`) as HTMLElement | null;
      if (el) {
        el.style.left = `${next.x}px`;
        el.style.top = `${next.y}px`;
      }
    };
    const handleUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const finalPos = { x: startLeft + dx, y: startTop + dy };
      setIconPositions(prev => {
        const next = { ...prev, [itemId]: finalPos };
        try { localStorage.setItem('asphaltos.desktop.iconPositions', JSON.stringify(next)); } catch {}
        return next;
      });
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {desktopItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="absolute pointer-events-auto"
            style={{ 
              left: item.position.x, 
              top: item.position.y 
            }}
            data-icon-id={item.id}
          >
            <Button
              variant="ghost"
              onDoubleClick={() => handleDoubleClick(item)}
              onMouseDown={(e) => startDrag(e, item.id)}
              className="h-20 w-16 flex-col gap-1 p-2 hover:bg-surface-elevated/50 transition-all duration-200 hover:scale-105"
            >
              <Icon className="h-8 w-8 text-foreground" />
              <span className="text-xs text-center leading-tight text-foreground">
                {item.name}
              </span>
            </Button>
          </div>
        );
      })}
    </div>
  );
};