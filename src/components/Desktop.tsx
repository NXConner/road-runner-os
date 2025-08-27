import { useState } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { DesktopIcons } from './DesktopIcons';
import { WidgetManager, Widget } from './widgets/WidgetManager';
import { ThemeManager } from './ThemeManager';
import { EffectsManager } from './EffectsManager';
import wallpaper from '@/assets/asphalt-wallpaper.jpg';

export interface Window {
  id: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export const Desktop = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const openWindow = (windowData: Omit<Window, 'id' | 'zIndex'>) => {
    const newWindow: Window = {
      ...windowData,
      id: crypto.randomUUID(),
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindow(null);
  };

  const updateWindow = (id: string, updates: Partial<Window>) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const focusWindow = (id: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0);
    updateWindow(id, { zIndex: maxZ + 1 });
    setActiveWindow(id);
  };

  const addWidget = (widgetData: Omit<Widget, 'id'>) => {
    const newWidget: Widget = {
      ...widgetData,
      id: crypto.randomUUID(),
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative bg-gradient-asphalt"
      style={{
        // Use theme-driven wallpaper if set, fallback to imported default
        backgroundImage: `var(--wallpaper-image, url(${wallpaper}))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Effects Manager */}
      <EffectsManager />
      
      {/* Theme Manager */}
      <ThemeManager />
      
      {/* Desktop Icons */}
      <DesktopIcons onOpenWindow={openWindow} />
      
      {/* Widget Manager */}
      <WidgetManager
        widgets={widgets}
        onAddWidget={addWidget}
        onRemoveWidget={removeWidget}
        onUpdateWidget={updateWidget}
      />
      
      {/* Windows */}
      <WindowManager
        windows={windows}
        activeWindow={activeWindow}
        onClose={closeWindow}
        onUpdate={updateWindow}
        onFocus={focusWindow}
      />
      
      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindow={activeWindow}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
      />
    </div>
  );
};