import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Window } from './Desktop';
import { Minimize2, Square, X, Maximize2 } from 'lucide-react';
import { createWindowComponent } from '@/lib/windowRegistry';

interface WindowManagerProps {
  windows: Window[];
  activeWindow: string | null;
  onClose: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Window>) => void;
  onFocus: (id: string) => void;
}

export const WindowManager = ({ 
  windows, 
  activeWindow, 
  onClose, 
  onUpdate, 
  onFocus 
}: WindowManagerProps) => {
  const [/* dragState */, setDragState] = useState<{
    windowId: string;
    startX: number;
    startY: number;
    startWindowX: number;
    startWindowY: number;
  } | null>(null);
  
  const [/* resizeState */, setResizeState] = useState<{
    windowId: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, windowId: string, type: 'drag' | 'resize') => {
    e.preventDefault();
    onFocus(windowId);
    
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    const currentDragState = {
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      startWindowX: window.position.x,
      startWindowY: window.position.y,
    };

    const currentResizeState = {
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: window.size.width,
      startHeight: window.size.height,
    };

    if (type === 'drag') {
      setDragState(currentDragState);
    } else {
      setResizeState(currentResizeState);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (type === 'drag' && currentDragState) {
        const deltaX = e.clientX - currentDragState.startX;
        const deltaY = e.clientY - currentDragState.startY;

        const viewportWidth = globalThis.innerWidth || 1920;
        const viewportHeight = (globalThis.innerHeight || 1080) - 64; // account for taskbar
        const target = windows.find(w => w.id === currentDragState.windowId);
        const width = target?.size.width ?? 600;
        const height = target?.size.height ?? 400;

        const nextX = Math.max(0, Math.min(viewportWidth - width, currentDragState.startWindowX + deltaX));
        const nextY = Math.max(0, Math.min(viewportHeight - height, currentDragState.startWindowY + deltaY));

        onUpdate(currentDragState.windowId, {
          position: { x: nextX, y: nextY }
        });
      }
      
      if (type === 'resize' && currentResizeState) {
        const deltaX = e.clientX - currentResizeState.startX;
        const deltaY = e.clientY - currentResizeState.startY;

        const viewportWidth = globalThis.innerWidth || 1920;
        const viewportHeight = (globalThis.innerHeight || 1080) - 64;
        const target = windows.find(w => w.id === currentResizeState.windowId);
        const posX = target?.position.x ?? 0;
        const posY = target?.position.y ?? 0;

        const newWidth = Math.max(300, currentResizeState.startWidth + deltaX);
        const newHeight = Math.max(200, currentResizeState.startHeight + deltaY);

        const clampedWidth = Math.min(newWidth, viewportWidth - posX);
        const clampedHeight = Math.min(newHeight, viewportHeight - posY);

        onUpdate(currentResizeState.windowId, {
          size: { width: clampedWidth, height: clampedHeight }
        });
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMinimize = (windowId: string) => {
    if (activeWindow === windowId) {
      // Move focus to next topmost window before minimizing
      const others = windows.filter(w => !w.isMinimized && w.id !== windowId).sort((a,b) => b.zIndex - a.zIndex);
      if (others.length > 0) {
        const next = others[0];
        onUpdate(windowId, { isMinimized: true });
        onFocus(next.id);
        return;
      }
    }
    onUpdate(windowId, { isMinimized: true });
  };

  const handleMaximize = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    if (window.isMaximized) {
      onUpdate(windowId, { 
        isMaximized: false,
        position: { x: 100, y: 100 },
        size: { width: 600, height: 400 }
      });
    } else {
      onUpdate(windowId, { 
        isMaximized: true,
        position: { x: 0, y: 0 },
        size: { width: globalThis.innerWidth || 1920, height: (globalThis.innerHeight || 1080) - 64 }
      });
    }
  };

  return (
    <>
      {windows
        .filter(window => !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <div
            key={window.id}
            className={`absolute glass rounded-lg overflow-hidden shadow-glass transition-all duration-200 ${
              window.id === activeWindow ? 'ring-2 ring-primary/50' : ''
            }`}
            style={{
              left: window.position.x,
              top: window.position.y,
              width: window.size.width,
              height: window.size.height,
              zIndex: window.zIndex,
            }}
            onClick={() => onFocus(window.id)}
          >
            {/* Title Bar */}
            <div
              className="h-10 bg-surface-elevated/80 border-b border-border/20 flex items-center justify-between px-4 cursor-move select-none"
              onMouseDown={(e) => handleMouseDown(e, window.id, 'drag')}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleMaximize(window.id);
              }}
            >
              <span className="text-sm font-medium truncate">{window.title}</span>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMinimize(window.id);
                  }}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMaximize(window.id);
                  }}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  {window.isMaximized ? <Maximize2 className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(window.id);
                  }}
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto bg-card/50 p-0">
              {createWindowComponent(window.kind, window.meta)}
            </div>

            {/* Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
              onMouseDown={(e) => handleMouseDown(e, window.id, 'resize')}
            >
              <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground" />
            </div>
          </div>
        ))}
    </>
  );
};