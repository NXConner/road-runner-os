import { useEffect, useState } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { DesktopIcons } from './DesktopIcons';
import { WidgetManager, Widget } from './widgets/WidgetManager';
import { ThemeManager } from './ThemeManager';
import { EffectsManager } from './EffectsManager';
import wallpaper from '@/assets/asphalt-wallpaper.jpg';
import { WindowKind, WindowMeta } from '@/lib/windowRegistry';
import { getWidgetTemplateByName } from '@/lib/widgetsRegistry';

export interface Window {
  id: string;
  title: string;
  kind: WindowKind;
  meta?: WindowMeta;
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

  // Persist windows and widgets
  useEffect(() => {
    try {
      const serializable = windows.map(w => ({
        id: w.id,
        title: w.title,
        kind: w.kind,
        meta: w.meta ?? {},
        position: w.position,
        size: w.size,
        isMinimized: w.isMinimized,
        isMaximized: w.isMaximized,
        zIndex: w.zIndex,
      }));
      localStorage.setItem('asphaltos.windows', JSON.stringify(serializable));
      localStorage.setItem('asphaltos.activeWindowId', activeWindow || '');
    } catch {
      // ignore storage errors
    }
  }, [windows, activeWindow]);

  useEffect(() => {
    try {
      const serializable = widgets.map(w => ({
        id: w.id,
        name: w.name,
        size: w.size,
        position: w.position,
        isVisible: w.isVisible,
        isPinned: !!w.isPinned,
      }));
      localStorage.setItem('asphaltos.widgets', JSON.stringify(serializable));
    } catch {
      // ignore storage errors
    }
  }, [widgets]);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const rawWindows = localStorage.getItem('asphaltos.windows');
      const rawActive = localStorage.getItem('asphaltos.activeWindowId');
      if (rawWindows) {
        const parsed = JSON.parse(rawWindows) as Array<{
          id: string;
          title: string;
          kind: WindowKind;
          meta?: WindowMeta;
          position: { x: number; y: number };
          size: { width: number; height: number };
          isMinimized: boolean;
          isMaximized: boolean;
          zIndex: number;
        }>;
        const restored: Window[] = parsed.map(p => ({
          id: p.id,
          title: p.title,
          kind: p.kind,
          meta: p.meta,
          position: p.position,
          size: p.size,
          isMinimized: !!p.isMinimized,
          isMaximized: !!p.isMaximized,
          zIndex: typeof p.zIndex === 'number' ? p.zIndex : 1,
        }));
        setWindows(restored);
      }
      if (rawActive) setActiveWindow(rawActive || null);
    } catch {
      // ignore parse errors
    }

    try {
      const rawWidgets = localStorage.getItem('asphaltos.widgets');
      if (rawWidgets) {
        const parsed = JSON.parse(rawWidgets) as Array<{
          id: string; name: string; size: Widget['size']; position: Widget['position']; isVisible: boolean;
        }>;
        const restored: Widget[] = parsed.map(p => {
          const tpl = getWidgetTemplateByName(p.name);
          return {
            id: p.id,
            name: p.name,
            component: tpl?.component ?? <div className="p-2">Missing widget: {p.name}</div>,
            size: p.size,
            position: p.position,
            isVisible: !!p.isVisible,
            isPinned: !!(p as any).isPinned,
          } as Widget;
        });
        setWidgets(restored);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative bg-gradient-asphalt"
      style={{
        // Use theme-driven wallpaper if set, fallback to imported default
        backgroundImage: `var(--wallpaper-image, url(${wallpaper}))`,
        backgroundSize: 'cover',
        backgroundPosition: `calc(50% + var(--parallax-x)) calc(50% + var(--parallax-y))`,
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