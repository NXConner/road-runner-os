import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StartMenu } from './StartMenu';
import { Window } from './Desktop';
import { 
  Terminal, 
  Folder, 
  Settings, 
  Menu
} from 'lucide-react';

interface TaskbarProps {
  windows: Window[];
  activeWindow: string | null;
  onOpenWindow: (windowData: Omit<Window, 'id' | 'zIndex'>) => void;
  onFocusWindow: (id: string) => void;
}

export const Taskbar = ({ windows, activeWindow, onOpenWindow, onFocusWindow }: TaskbarProps) => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const apps = [
    { id: 'explorer', name: 'File Explorer', icon: Folder, kind: 'file-explorer' as const },
    { id: 'terminal', name: 'Terminal', icon: Terminal, kind: 'terminal' as const },
    { id: 'settings', name: 'Settings', icon: Settings, kind: 'settings' as const },
  ];

  const handleAppClick = (app: typeof apps[0]) => {
    const existingWindow = windows.find(w => w.title === app.name);
    if (existingWindow) {
      onFocusWindow(existingWindow.id);
    } else {
      onOpenWindow({
        title: app.name,
        kind: app.kind,
        position: { x: 100, y: 100 },
        size: { width: 600, height: 400 },
        isMinimized: false,
        isMaximized: false,
      });
    }
  };

  return (
    <>
      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu 
          onClose={() => setShowStartMenu(false)}
          onOpenApp={(_app) => {
            const app = apps.find(a => a.id === _app.id) || apps[0];
            handleAppClick(app);
            setShowStartMenu(false);
          }}
        />
      )}
      
      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-border/20 flex items-center px-4 gap-2 z-50">
        {/* Start Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setShowStartMenu(!showStartMenu)}
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 glow-yellow"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Quick Launch Apps */}
        <div className="flex gap-2 ml-2">
          {apps.map((app) => {
            const Icon = app.icon;
            const isActive = windows.some(w => w.title === app.name && w.id === activeWindow);
            return (
              <Button
                key={app.id}
                variant="ghost"
                size="lg"
                onClick={() => handleAppClick(app)}
                className={`relative ${
                  isActive 
                    ? 'bg-primary/20 text-primary border border-primary/50' 
                    : 'hover:bg-surface-elevated'
                } transition-all duration-200`}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Window Buttons */}
        <div className="flex gap-1 ml-4">
          {windows.filter(w => !w.isMinimized).map((window) => (
            <Button
              key={window.id}
              variant="ghost"
              size="sm"
              onClick={() => onFocusWindow(window.id)}
              className={`max-w-40 truncate ${
                window.id === activeWindow 
                  ? 'bg-accent/20 text-accent border border-accent/30' 
                  : 'hover:bg-surface-elevated'
              }`}
            >
              {window.title}
            </Button>
          ))}
        </div>

        {/* System Tray */}
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-mono">
            {currentTime}
          </div>
        </div>
      </div>
    </>
  );
};