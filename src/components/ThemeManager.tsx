import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { themes, applyTheme, Theme } from '@/lib/themes';
import { 
  Palette, 
  Settings, 
  Monitor, 
  Sun, 
  Moon,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

export const ThemeManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    try {
      const storedThemeId = localStorage.getItem('asphaltos.themeId');
      if (storedThemeId) {
        const found = themes.find(t => t.id === storedThemeId);
        if (found) return found;
      }
    } catch {
      // ignore storage errors
    }
    return themes[0];
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('asphaltos.soundEnabled');
      return raw === null ? true : raw === 'true';
    } catch {
      return true;
    }
  });
  const [customizations, setCustomizations] = useState({
    fontSize: 100,
    windowOpacity: 90,
    animationSpeed: 100,
    particleDensity: 50
  });

  // Load persisted customizations on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('asphaltos.customizations');
      if (raw) {
        const parsed = JSON.parse(raw);
        setCustomizations(prev => ({
          fontSize: typeof parsed.fontSize === 'number' ? parsed.fontSize : prev.fontSize,
          windowOpacity: typeof parsed.windowOpacity === 'number' ? parsed.windowOpacity : prev.windowOpacity,
          animationSpeed: typeof parsed.animationSpeed === 'number' ? parsed.animationSpeed : prev.animationSpeed,
          particleDensity: typeof parsed.particleDensity === 'number' ? parsed.particleDensity : prev.particleDensity,
        }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
    try {
      localStorage.setItem('asphaltos.themeId', currentTheme.id);
    } catch {
      // ignore storage errors
    }
  }, [currentTheme]);

  // Persist sound setting
  useEffect(() => {
    try {
      localStorage.setItem('asphaltos.soundEnabled', String(soundEnabled));
    } catch {
      // ignore storage errors
    }
  }, [soundEnabled]);

  // Apply and persist customization variables whenever they change
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${customizations.fontSize}%`;
    root.style.setProperty('--window-opacity', `${customizations.windowOpacity}%`);
    root.style.setProperty('--animation-speed', `${customizations.animationSpeed}%`);
    root.style.setProperty('--particle-density', `${customizations.particleDensity}%`);
    try {
      localStorage.setItem('asphaltos.customizations', JSON.stringify(customizations));
    } catch {
      // ignore storage errors
    }
  }, [customizations]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    
    if (soundEnabled && theme.sounds.click) {
      // Play theme switch sound (would need actual audio implementation)
      console.log(`Playing sound: ${theme.sounds.click}`);
    }
  };

  const handleCustomization = (key: string, value: number) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 glass hover:bg-primary/20"
        size="sm"
      >
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 glass rounded-lg p-6 w-96 animate-scale-in max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Theme Manager</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          Themes
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme)}
              className={`text-left p-3 rounded-lg transition-all ${
                currentTheme.id === theme.id
                  ? 'bg-primary/20 ring-2 ring-primary/50'
                  : 'bg-surface-elevated hover:bg-surface-elevated/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ background: theme.gradients.primary }}
                />
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-xs text-muted-foreground">{theme.description}</div>
                  <div className="flex gap-1 mt-1">
                    {theme.effects.glow && <Sparkles className="h-3 w-3 text-yellow-500" />}
                    {theme.effects.neon && <Sun className="h-3 w-3 text-blue-500" />}
                    {theme.effects.glass && <Moon className="h-3 w-3 text-purple-500" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Audio
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm">System Sounds</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8 p-0"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Customizations */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Customizations
        </h4>
        
        {Object.entries(customizations).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <span>{value}%</span>
            </div>
            <input
              type="range"
              min="25"
              max="200"
              value={value}
              onChange={(e) => handleCustomization(key, parseInt(e.target.value))}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        ))}
      </div>

      {/* Current Theme Info */}
      <div className="mt-6 p-3 bg-surface-elevated rounded-lg">
        <div className="text-sm font-medium mb-2">Current: {currentTheme.name}</div>
        <div className="text-xs text-muted-foreground">{currentTheme.description}</div>
        <div className="flex gap-1 mt-2">
          {Object.entries(currentTheme.effects).map(([effect, enabled]) => (
            enabled && (
              <span key={effect} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded capitalize">
                {effect}
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  );
};