import { useState } from 'react';
import { SystemMonitor } from './SystemMonitor';
import { WeatherWidget } from './WeatherWidget';
import { AIAssistant } from './AIAssistant';
import { FleetTracker } from './FleetTracker';
import { SecurityPanel } from './SecurityPanel';
import { MapWidget } from './MapWidget';
import { Calculator } from './Calculator';
import { MediaPlayer } from './MediaPlayer';
import { Button } from '@/components/ui/button';
import { Plus, X, Pin, PinOff } from 'lucide-react';

export interface Widget {
  id: string;
  name: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  isVisible: boolean;
  isPinned?: boolean;
}

interface WidgetManagerProps {
  onAddWidget: (widget: Omit<Widget, 'id'>) => void;
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
  onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
}

export const WidgetManager = ({ onAddWidget, widgets, onRemoveWidget, onUpdateWidget }: WidgetManagerProps) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [_dragState, setDragState] = useState<{
    id: string;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const availableWidgets = [
    {
      name: 'System Monitor',
      component: <SystemMonitor />,
      size: 'medium' as const,
      description: 'CPU, RAM, and system performance'
    },
    {
      name: 'Weather',
      component: <WeatherWidget />,
      size: 'small' as const,
      description: 'Current weather and forecast'
    },
    {
      name: 'AI Assistant',
      component: <AIAssistant />,
      size: 'large' as const,
      description: 'Gemini-powered AI helper'
    },
    {
      name: 'Fleet Tracker',
      component: <FleetTracker />,
      size: 'large' as const,
      description: 'Real-time fleet monitoring'
    },
    {
      name: 'Security Panel',
      component: <SecurityPanel />,
      size: 'medium' as const,
      description: 'System security status'
    },
    {
      name: 'Map',
      component: <MapWidget />,
      size: 'large' as const,
      description: 'Interactive mapping system'
    },
    {
      name: 'Calculator',
      component: <Calculator />,
      size: 'small' as const,
      description: 'Advanced calculator with paving estimates'
    },
    {
      name: 'Media Player',
      component: <MediaPlayer />,
      size: 'medium' as const,
      description: 'Audio and video player'
    }
  ];

  const handleAddWidget = (widgetTemplate: typeof availableWidgets[0]) => {
    onAddWidget({
      name: widgetTemplate.name,
      component: widgetTemplate.component,
      size: widgetTemplate.size,
      position: { x: Math.random() * 300, y: Math.random() * 200 },
      isVisible: true
    });
    setShowAddMenu(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Widget Controls */}
      <Button
        onClick={() => setShowAddMenu(!showAddMenu)}
        className="mb-2 glass hover:bg-primary/20"
        size="sm"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Add Widget Menu */}
      {showAddMenu && (
        <div className="glass rounded-lg p-4 w-80 animate-scale-in">
          <h3 className="font-semibold mb-3">Add Widget</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableWidgets.map((widget, index) => (
              <button
                key={index}
                onClick={() => handleAddWidget(widget)}
                className="w-full text-left p-3 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 transition-colors"
              >
                <div className="font-medium">{widget.name}</div>
                <div className="text-sm text-muted-foreground">{widget.description}</div>
                <div className="text-xs text-accent capitalize">{widget.size} widget</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Widgets */}
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={`absolute glass rounded-lg animate-fade-in ${
            widget.size === 'small' ? 'w-64 h-32' :
            widget.size === 'medium' ? 'w-80 h-48' :
            'w-96 h-64'
          }`}
          style={{
            left: widget.position.x,
            top: widget.position.y,
            display: widget.isVisible ? 'block' : 'none'
          }}
          onMouseDown={(e) => {
            if (widget.isPinned) return; // do not drag when pinned
            if ((e.target as HTMLElement).closest('button')) return;
            setDragState({
              id: widget.id,
              startX: e.clientX,
              startY: e.clientY,
              startLeft: widget.position.x,
              startTop: widget.position.y,
            });
            const handleMove = (ev: MouseEvent) => {
              setDragState((prev) => {
                if (!prev) return prev;
                const dx = ev.clientX - prev.startX;
                const dy = ev.clientY - prev.startY;
                const nextX = prev.startLeft + dx;
                const nextY = prev.startTop + dy;
                // Update DOM style optimistically
                const el = document.querySelector(`[data-widget-id="${widget.id}"]`) as HTMLElement | null;
                if (el) {
                  el.style.left = `${nextX}px`;
                  el.style.top = `${nextY}px`;
                }
                return { ...prev };
              });
            };
            const handleUp = (ev: MouseEvent) => {
              document.removeEventListener('mousemove', handleMove);
              document.removeEventListener('mouseup', handleUp);
              setDragState((prev) => {
                if (!prev) return null;
                const dx = ev.clientX - prev.startX;
                const dy = ev.clientY - prev.startY;
                const nextX = prev.startLeft + dx;
                const nextY = prev.startTop + dy;
                onUpdateWidget(widget.id, { position: { x: nextX, y: nextY } });
                return null;
              });
            };
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleUp);
          }}
          data-widget-id={widget.id}
        >
          {/* Widget Header */}
          <div className="flex items-center justify-between p-2 border-b border-border/20">
            <span className="text-sm font-medium flex items-center gap-2">
              {widget.name}
              {widget.isPinned && <Pin className="h-3 w-3 opacity-60" />}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateWidget(widget.id, { isPinned: !widget.isPinned })}
                className={`h-6 w-6 p-0 ${widget.isPinned ? 'text-primary' : ''}`}
                title={widget.isPinned ? 'Unpin' : 'Pin'}
              >
                {widget.isPinned ? <Pin className="h-3 w-3" /> : <PinOff className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveWidget(widget.id)}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Widget Content */}
          <div className="p-2 h-full overflow-hidden">
            {widget.component}
          </div>
        </div>
      ))}
    </div>
  );
};
