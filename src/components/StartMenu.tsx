import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Terminal, 
  Folder, 
  Settings, 
  Calculator,
  Calendar,
  Search,
  Power,
  User
} from 'lucide-react';

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (app: any) => void;
}

export const StartMenu = ({ onClose, onOpenApp }: StartMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const apps = [
    { id: 'explorer', name: 'File Explorer', icon: Folder, category: 'System' },
    { id: 'terminal', name: 'Terminal', icon: Terminal, category: 'System' },
    { id: 'settings', name: 'Settings', icon: Settings, category: 'System' },
    { id: 'calculator', name: 'Calculator', icon: Calculator, category: 'Utilities' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, category: 'Productivity' },
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedApps = filteredApps.reduce((acc, app) => {
    const category = app.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(app);
    return acc;
  }, {} as Record<string, typeof apps>);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div className="fixed bottom-16 left-4 w-80 h-96 glass rounded-lg border border-border/20 z-50 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-road rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold">AsphaltOS User</span>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface border-border/30"
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedApps).map(([category, categoryApps]) => (
            <div key={category} className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {category}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {categoryApps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <Button
                      key={app.id}
                      variant="ghost"
                      onClick={() => onOpenApp(app)}
                      className="h-20 flex-col gap-2 hover:bg-surface-elevated hover:scale-105 transition-all duration-200"
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs leading-tight">{app.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/20 flex justify-between">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <Power className="h-4 w-4 mr-2" />
            Shutdown
          </Button>
        </div>
      </div>
    </>
  );
};