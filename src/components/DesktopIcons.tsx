import { Button } from '@/components/ui/button';
import { Window } from './Desktop';
import { WebBrowser } from './WebBrowser';
import { 
  Folder, 
  FileText, 
  Image, 
  Music,
  Trash2,
  HardDrive,
  Github,
  Code,
  Database,
  Shield,
  Truck,
  Map,
  Eye,
  Bot,
  Wrench,
  Zap,
  Cloud,
  Navigation
} from 'lucide-react';

interface DesktopIconsProps {
  onOpenWindow: (windowData: Omit<Window, 'id' | 'zIndex'>) => void;
}

export const DesktopIcons = ({ onOpenWindow }: DesktopIconsProps) => {
  const createRepositoryBrowser = (repoName: string) => (
    { kind: 'repo-browser' as const, meta: { repoName } }
  );

  const repositories = [
    { name: 'FieldOpsSuite_v1', icon: Truck, description: 'Field Operations Management Suite' },
    { name: 'blacktop-blueprint-ai', icon: Bot, description: 'AI-powered Blacktop Design Assistant' },
    { name: 'hero-ops-suite', icon: Shield, description: 'Hero Operations Management System' },
    { name: 'division-android-reborn-os', icon: Code, description: 'Android Reborn Operating System' },
    { name: 'fleet-focus-manager', icon: Truck, description: 'Fleet Management and Focus System' },
    { name: 'asphalt-atlas-hub', icon: Map, description: 'Asphalt Atlas Management Hub' },
    { name: 'echo-comm-protocol', icon: Zap, description: 'Echo Communication Protocol System' },
    { name: 'pavemaster-suite', icon: Wrench, description: 'Professional Paving Management Suite' },
    { name: 'patrick-county-mapper', icon: Map, description: 'Patrick County Mapping Application' },
    { name: 'NXConner', icon: Github, description: 'NXConner Profile Repository' },
    { name: 'size-seeker-tracker-app', icon: Eye, description: 'Size Seeker Tracking Application' },
    { name: 'OverWatch-Ops-System-app', icon: Eye, description: 'OverWatch Operations System' },
    { name: 'OverWatch-app', icon: Eye, description: 'OverWatch Monitoring Application' },
    { name: 'asphalt-guardian-suite', icon: Shield, description: 'Asphalt Guardian Security Suite' },
    { name: 'Blacktop', icon: Code, description: 'Blacktop Core System' },
    { name: 'pave-ai-estimator', icon: Bot, description: 'AI-Powered Paving Estimator' },
    { name: 'echo-comm-rogue', icon: Zap, description: 'Echo Communication Rogue System' },
    { name: 'gemini-create-magic', icon: Bot, description: 'Gemini Create Magic Assistant' },
    { name: 'asphalt-odoo-prime', icon: Database, description: 'Asphalt Odoo Prime Integration' },
    { name: 'NeXTeCH-Systems-Asphalt-NeXus', icon: Navigation, description: 'NeXTeCH Systems Asphalt NeXus' },
    { name: 'pave-wise-weather-cast', icon: Cloud, description: 'Pave Wise Weather Forecasting' },
    { name: 'fleet-asphalt-nexus', icon: Truck, description: 'Fleet Asphalt Nexus Management' }
  ];

  const desktopItems = [
    {
      id: 'my-computer',
      name: 'My Computer',
      icon: HardDrive,
      position: { x: 20, y: 20 },
      kind: 'panel:my-computer' as const,
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: Folder,
      position: { x: 20, y: 120 },
      kind: 'panel:documents' as const,
    },
    {
      id: 'recycle-bin',
      name: 'Recycle Bin',
      icon: Trash2,
      position: { x: 20, y: 220 },
      kind: 'panel:recycle-bin' as const,
    },
    // Add repository icons
    ...repositories.map((repo, index) => ({
      id: `repo-${repo.name}`,
      name: repo.name,
      icon: repo.icon,
      position: { 
        x: 120 + (index % 8) * 100, 
        y: 20 + Math.floor(index / 8) * 100 
      },
      kind: 'repo-browser' as const,
      meta: { repoName: repo.name }
    }))
  ];

  const handleDoubleClick = (item: typeof desktopItems[0]) => {
    const isRepo = item.id.startsWith('repo-');
    // item.kind and item.meta prepared above
    onOpenWindow({
      title: isRepo ? `${item.name} - AsphaltOS Browser` : item.name,
      // @ts-expect-error extend local item typing inline
      kind: item.kind,
      // @ts-expect-error extend local item typing inline
      meta: item.meta,
      position: { x: 100, y: 50 },
      size: { width: isRepo ? 900 : 500, height: isRepo ? 600 : 400 },
      isMinimized: false,
      isMaximized: false,
    });
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
          >
            <Button
              variant="ghost"
              onDoubleClick={() => handleDoubleClick(item)}
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