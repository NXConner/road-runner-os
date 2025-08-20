import { Button } from '@/components/ui/button';
import { Window } from './Desktop';
import { 
  Folder, 
  FileText, 
  Image, 
  Music,
  Trash2,
  HardDrive
} from 'lucide-react';

interface DesktopIconsProps {
  onOpenWindow: (windowData: Omit<Window, 'id' | 'zIndex'>) => void;
}

export const DesktopIcons = ({ onOpenWindow }: DesktopIconsProps) => {
  const desktopItems = [
    {
      id: 'my-computer',
      name: 'My Computer',
      icon: HardDrive,
      position: { x: 20, y: 20 },
      component: (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">My Computer</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <HardDrive className="h-5 w-5" />
              <span>Local Disk (C:)</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <Folder className="h-5 w-5" />
              <span>Documents</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <Image className="h-5 w-5" />
              <span>Pictures</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: Folder,
      position: { x: 20, y: 120 },
      component: (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Documents</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <FileText className="h-5 w-5" />
              <span>README.txt</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <FileText className="h-5 w-5" />
              <span>AsphaltOS Manual.pdf</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'recycle-bin',
      name: 'Recycle Bin',
      icon: Trash2,
      position: { x: 20, y: 220 },
      component: (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recycle Bin</h2>
          <p className="text-muted-foreground">The recycle bin is empty.</p>
        </div>
      )
    }
  ];

  const handleDoubleClick = (item: typeof desktopItems[0]) => {
    onOpenWindow({
      title: item.name,
      component: item.component,
      position: { x: 150, y: 150 },
      size: { width: 500, height: 400 },
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