import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const hexToHslString = (hex: string): string => {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    const H = Math.round(h * 360);
    const S = Math.round(s * 100);
    const L = Math.round(l * 100);
    return `hsl(${H}, ${S}%, ${L}%)`;
  };
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
    particleDensity: 50,
    particleSize: 2,
    particleSpeed: 1,
    particleLife: 60,
    glassBlur: 20,
    parallaxIntensity: 0,
    noiseOpacity: 0,
    windowParallaxScale: 0,
    cardGrainOpacity: 0,
    bloomStrength: 0,
    vignetteIntensity: 0,
    crtScanlineOpacity: 0,
    crtScanlineSize: 2,
    crtScanlineGap: 3,
  });

  const [customWallpaper, setCustomWallpaper] = useState<string | null>(() => {
    try {
      return localStorage.getItem('asphaltos.customWallpaper') || null;
    } catch { return null; }
  });

  const [customTheme, setCustomTheme] = useState<Theme | null>(() => {
    try {
      const raw = localStorage.getItem('asphaltos.customTheme');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  });

  const availableThemes = useMemo(() => {
    if (!customTheme) return themes;
    const existing = themes.find(t => t.id === customTheme.id);
    return existing ? themes : [customTheme, ...themes];
  }, [customTheme]);

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
          particleSize: typeof parsed.particleSize === 'number' ? parsed.particleSize : prev.particleSize,
          particleSpeed: typeof parsed.particleSpeed === 'number' ? parsed.particleSpeed : prev.particleSpeed,
          particleLife: typeof parsed.particleLife === 'number' ? parsed.particleLife : prev.particleLife,
          glassBlur: typeof parsed.glassBlur === 'number' ? parsed.glassBlur : prev.glassBlur,
          parallaxIntensity: typeof parsed.parallaxIntensity === 'number' ? parsed.parallaxIntensity : prev.parallaxIntensity,
          noiseOpacity: typeof parsed.noiseOpacity === 'number' ? parsed.noiseOpacity : prev.noiseOpacity,
          windowParallaxScale: typeof parsed.windowParallaxScale === 'number' ? parsed.windowParallaxScale : prev.windowParallaxScale,
          cardGrainOpacity: typeof parsed.cardGrainOpacity === 'number' ? parsed.cardGrainOpacity : prev.cardGrainOpacity,
          bloomStrength: typeof parsed.bloomStrength === 'number' ? parsed.bloomStrength : prev.bloomStrength,
          vignetteIntensity: typeof parsed.vignetteIntensity === 'number' ? parsed.vignetteIntensity : prev.vignetteIntensity,
          crtScanlineOpacity: typeof parsed.crtScanlineOpacity === 'number' ? parsed.crtScanlineOpacity : prev.crtScanlineOpacity,
          crtScanlineSize: typeof parsed.crtScanlineSize === 'number' ? parsed.crtScanlineSize : prev.crtScanlineSize,
          crtScanlineGap: typeof parsed.crtScanlineGap === 'number' ? parsed.crtScanlineGap : prev.crtScanlineGap,
        }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Apply custom wallpaper (if any) on mount
  useEffect(() => {
    if (customWallpaper) {
      const root = document.documentElement;
      root.style.setProperty('--wallpaper-image', `url(${customWallpaper})`);
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
    root.style.setProperty('--particle-size', `${customizations.particleSize}px`);
    root.style.setProperty('--particle-speed', `${customizations.particleSpeed}`);
    root.style.setProperty('--particle-life', `${customizations.particleLife}`);
    root.style.setProperty('--glass-blur', `${customizations.glassBlur}px`);
    root.style.setProperty('--parallax-intensity', `${customizations.parallaxIntensity}px`);
    root.style.setProperty('--noise-opacity', `${customizations.noiseOpacity}`);
    root.style.setProperty('--window-parallax-scale', `${customizations.windowParallaxScale}`);
    root.style.setProperty('--card-grain-opacity', `${customizations.cardGrainOpacity}`);
    root.style.setProperty('--bloom-strength', `${customizations.bloomStrength}`);
    root.style.setProperty('--vignette-intensity', `${customizations.vignetteIntensity}`);
    root.style.setProperty('--crt-scanline-opacity', `${customizations.crtScanlineOpacity}`);
    root.style.setProperty('--crt-scanline-size', `${customizations.crtScanlineSize}px`);
    root.style.setProperty('--crt-scanline-gap', `${customizations.crtScanlineGap}px`);
    try {
      localStorage.setItem('asphaltos.customizations', JSON.stringify(customizations));
    } catch {
      // ignore storage errors
    }
  }, [customizations]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    if (customWallpaper) {
      const root = document.documentElement;
      root.style.setProperty('--wallpaper-image', `url(${customWallpaper})`);
    }
    
    if (soundEnabled && theme.sounds.click) {
      // Play theme switch sound (would need actual audio implementation)
      console.log(`Playing sound: ${theme.sounds.click}`);
    }
  };

  const handleCustomization = (key: string, value: number) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const handleWallpaperUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomWallpaper(dataUrl);
      try { localStorage.setItem('asphaltos.customWallpaper', dataUrl); } catch {}
      const root = document.documentElement;
      root.style.setProperty('--wallpaper-image', `url(${dataUrl})`);
    };
    reader.readAsDataURL(file);
  };

  const builtInWallpapers = availableThemes.map(t => t.wallpaper);
  const appliedWallpaper = customWallpaper || currentTheme.wallpaper;

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
    <div className="fixed top-4 left-4 z-50 glass rounded-lg p-6 w-[28rem] animate-scale-in max-h-[80vh] overflow-y-auto">
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

      <Tabs defaultValue="themes">
        <TabsList className="mb-4">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="wallpaper">Wallpaper</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          <div className="grid grid-cols-1 gap-2">
            {availableThemes.map((theme) => (
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

          {/* Quick create custom theme */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Create Custom Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Theme Name" value={customTheme?.name || ''} onChange={(e) => setCustomTheme(ct => ({
                  ...(ct || { ...themes[0], id: 'custom-theme', name: '', description: 'Your custom theme' }),
                  name: e.target.value
                }))} />
                <Input placeholder="Description" value={customTheme?.description || ''} onChange={(e) => setCustomTheme(ct => ({
                  ...(ct || { ...themes[0], id: 'custom-theme', name: 'Custom', description: '' }),
                  description: e.target.value
                }))} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input type="color" title="Primary" onChange={(e) => setCustomTheme(ct => {
                  const base = ct || { ...themes[0], id: 'custom-theme' } as Theme;
                  return { ...base, colors: { ...base.colors, primary: hexToHslString(e.target.value) } };
                })} />
                <Input type="color" title="Accent" onChange={(e) => setCustomTheme(ct => {
                  const base = ct || { ...themes[0], id: 'custom-theme' } as Theme;
                  return { ...base, colors: { ...base.colors, accent: hexToHslString(e.target.value) } };
                })} />
                <Input type="color" title="Surface" onChange={(e) => setCustomTheme(ct => {
                  const base = ct || { ...themes[0], id: 'custom-theme' } as Theme;
                  return { ...base, colors: { ...base.colors, surface: hexToHslString(e.target.value) } };
                })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  if (!customTheme) return;
                  try { localStorage.setItem('asphaltos.customTheme', JSON.stringify(customTheme)); } catch {}
                }}>Save</Button>
                <Button variant="secondary" onClick={() => {
                  setCustomTheme(null);
                  localStorage.removeItem('asphaltos.customTheme');
                }}>Clear</Button>
                <Button variant="outline" onClick={() => {
                  if (customTheme) handleThemeChange(customTheme);
                }}>Apply</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize">
          <div className="space-y-4">
            {Object.entries({
              fontSize: { min: 50, max: 150, unit: '%' },
              windowOpacity: { min: 30, max: 100, unit: '%' },
              animationSpeed: { min: 50, max: 200, unit: '%' },
              glassBlur: { min: 0, max: 40, unit: 'px' },
              parallaxIntensity: { min: 0, max: 40, unit: 'px' },
              noiseOpacity: { min: 0, max: 1, step: 0.05, unit: '' },
              windowParallaxScale: { min: 0, max: 0.5, step: 0.05, unit: 'x' },
              cardGrainOpacity: { min: 0, max: 0.8, step: 0.05, unit: '' },
              bloomStrength: { min: 0, max: 1, step: 0.05, unit: '' },
              vignetteIntensity: { min: 0, max: 1, step: 0.05, unit: '' },
              crtScanlineOpacity: { min: 0, max: 1, step: 0.05, unit: '' },
              crtScanlineSize: { min: 1, max: 4, step: 1, unit: 'px' },
              crtScanlineGap: { min: 2, max: 6, step: 1, unit: 'px' },
              particleDensity: { min: 0, max: 100, unit: '%' },
              particleSize: { min: 1, max: 6, unit: 'px' },
              particleSpeed: { min: 0.2, max: 3, step: 0.1, unit: 'x' },
              particleLife: { min: 15, max: 120, unit: ' frames' },
            }).map(([key, meta]) => {
              const value = (customizations as any)[key];
              const min = (meta as any).min; const max = (meta as any).max; const step = (meta as any).step || 1;
              const unit = (meta as any).unit;
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    <span>{value}{unit}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => handleCustomization(key, (step !== 1 ? parseFloat(e.target.value) : parseInt(e.target.value)) as any)}
                    className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="wallpaper">
          <Card>
            <CardHeader>
              <CardTitle>Wallpaper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[appliedWallpaper, ...builtInWallpapers].map((w, idx) => (
                  <button key={idx} className={`aspect-video rounded bg-cover bg-center ${appliedWallpaper === w ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundImage: `url(${w})` }}
                    onClick={() => {
                      const root = document.documentElement;
                      root.style.setProperty('--wallpaper-image', `url(${w})`);
                      if (customWallpaper) {
                        setCustomWallpaper(null);
                        localStorage.removeItem('asphaltos.customWallpaper');
                      }
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <input type="file" accept="image/*" onChange={handleWallpaperUpload} />
                {customWallpaper && (
                  <Button variant="secondary" onClick={() => {
                    setCustomWallpaper(null);
                    localStorage.removeItem('asphaltos.customWallpaper');
                    const root = document.documentElement;
                    root.style.setProperty('--wallpaper-image', `url(${currentTheme.wallpaper})`);
                  }}>Remove Custom</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
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
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <Button variant="secondary" onClick={() => setCustomizations(c => ({ ...c, glassBlur: 6, particleDensity: 20 }))}>Subtle</Button>
            <Button variant="secondary" onClick={() => setCustomizations(c => ({ ...c, glassBlur: 14, particleDensity: 50 }))}>Balanced</Button>
            <Button variant="secondary" onClick={() => setCustomizations(c => ({ ...c, glassBlur: 24, particleDensity: 80 }))}>Max</Button>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="text-xs text-muted-foreground">
            Customize advanced UI effects and create your own theme. Settings persist locally.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};