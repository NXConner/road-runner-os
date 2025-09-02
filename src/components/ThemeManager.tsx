import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Zap,
  Eye,
  Waves,
  Globe
} from 'lucide-react';
import { themes, type Theme } from '@/lib/themes';

interface Customizations {
  fontSize: number;
  windowOpacity: number;
  animationSpeed: number;
  particleDensity: number;
  particleSize: number;
  particleSpeed: number;
  particleLife: number;
  glassBlur: number;
  parallaxIntensity: number;
  shadowIntensity: number;
  borderRadius: number;
  tiltIntensity: number;
  dofBlur: number;
  crtScanlineOpacity: number;
  crtScanlineGap: number;
}

interface ThemeManagerProps {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
  customizations: Customizations;
  setCustomizations: (customizations: Customizations) => void;
  onImportTheme: (theme: Theme) => void;
}

export const ThemeManager = ({ 
  activeTheme, 
  setActiveTheme, 
  customizations, 
  setCustomizations,
  onImportTheme
}: ThemeManagerProps) => {
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${customizations.fontSize}px`);
    document.documentElement.style.setProperty('--window-opacity', customizations.windowOpacity.toString());
    document.documentElement.style.setProperty('--animation-speed', customizations.animationSpeed.toString());
    document.documentElement.style.setProperty('--particle-density', customizations.particleDensity.toString());
    document.documentElement.style.setProperty('--particle-size', `${customizations.particleSize}px`);
    document.documentElement.style.setProperty('--particle-speed', customizations.particleSpeed.toString());
    document.documentElement.style.setProperty('--particle-life', customizations.particleLife.toString());
    document.documentElement.style.setProperty('--glass-blur', `${customizations.glassBlur}px`);
    document.documentElement.style.setProperty('--window-parallax-scale', customizations.parallaxIntensity.toString());
    document.documentElement.style.setProperty('--shadow-intensity', customizations.shadowIntensity.toString());
    document.documentElement.style.setProperty('--border-radius', `${customizations.borderRadius}px`);
    document.documentElement.style.setProperty('--tilt-intensity', customizations.tiltIntensity.toString());
    document.documentElement.style.setProperty('--dof-blur', `${customizations.dofBlur}px`);
    document.documentElement.style.setProperty('--crt-scanline-opacity', customizations.crtScanlineOpacity.toString());
    document.documentElement.style.setProperty('--crt-scanline-gap', `${customizations.crtScanlineGap}px`);
  }, [customizations]);

  const handleImport = async () => {
    if (!importFile) return;
    try {
      const text = await importFile.text();
      const theme = JSON.parse(text);
      onImportTheme(theme);
    } catch (e) {
      alert('Failed to import theme: ' + (e as any)?.message);
    }
  };

  const resetCustomizations = () => {
    setCustomizations({
      fontSize: 14,
      windowOpacity: 0.95,
      animationSpeed: 1,
      particleDensity: 50,
      particleSize: 2,
      particleSpeed: 1,
      particleLife: 3,
      glassBlur: 20,
      parallaxIntensity: 0.5,
      shadowIntensity: 0.3,
      borderRadius: 12,
      tiltIntensity: 0.5,
      dofBlur: 2,
      crtScanlineOpacity: 0.1,
      crtScanlineGap: 4
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-xl font-bold flex items-center gap-2"><Palette className="h-5 w-5" /> Theme</h2>

      {/* Theme Selection */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Theme</h3>
            <p className="text-sm text-muted-foreground">Select a theme to change the look of AsphaltOS.</p>
          </div>
          <Select value={activeTheme.name} onValueChange={(value) => {
            const theme = themes.find(t => t.name === value);
            if (theme) setActiveTheme(theme);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.name} value={theme.name}>{theme.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Import/Export Theme */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Import / Export</h3>
            <p className="text-sm text-muted-foreground">Share your theme with others.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="import-theme" className="cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" /> Import
              </label>
              <input id="import-theme" type="file" accept=".json" className="hidden" onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImportFile(e.target.files[0]);
                }
              }} />
            </Button>
            {importFile && (
              <Button variant="secondary" size="sm" onClick={handleImport}>
                Apply Import
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(activeTheme))}`}
                download={`${activeTheme.name}.json`}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Export
              </a>
            </Button>
          </div>
        </div>
      </Card>

      <Separator />

      <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5" /> Customizations</h2>

      {/* Font Size */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Font Size</h3>
            <p className="text-sm text-muted-foreground">Adjust the font size of the system.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.fontSize]}
              max={24}
              min={10}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, fontSize: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.fontSize}px</div>
          </div>
        </div>
      </Card>

      {/* Window Opacity */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Window Opacity</h3>
            <p className="text-sm text-muted-foreground">Adjust the opacity of the windows.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.windowOpacity * 100]}
              max={100}
              min={50}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, windowOpacity: value[0] / 100 })}
            />
            <div className="text-sm text-muted-foreground text-center">{(customizations.windowOpacity * 100).toFixed(0)}%</div>
          </div>
        </div>
      </Card>

      {/* Animation Speed */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Animation Speed</h3>
            <p className="text-sm text-muted-foreground">Adjust the animation speed of the system.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.animationSpeed * 100]}
              max={200}
              min={50}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, animationSpeed: value[0] / 100 })}
            />
            <div className="text-sm text-muted-foreground text-center">{(customizations.animationSpeed * 100).toFixed(0)}%</div>
          </div>
        </div>
      </Card>

      {/* Particle Density */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Particle Density</h3>
            <p className="text-sm text-muted-foreground">Adjust the density of the background particles.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.particleDensity]}
              max={200}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, particleDensity: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.particleDensity}</div>
          </div>
        </div>
      </Card>

      {/* Particle Size */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Particle Size</h3>
            <p className="text-sm text-muted-foreground">Adjust the size of the background particles.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.particleSize]}
              max={10}
              min={1}
              step={0.5}
              onValueChange={(value) => setCustomizations({ ...customizations, particleSize: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.particleSize}px</div>
          </div>
        </div>
      </Card>

      {/* Particle Speed */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Particle Speed</h3>
            <p className="text-sm text-muted-foreground">Adjust the speed of the background particles.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.particleSpeed]}
              max={5}
              min={0.1}
              step={0.1}
              onValueChange={(value) => setCustomizations({ ...customizations, particleSpeed: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.particleSpeed}</div>
          </div>
        </div>
      </Card>

      {/* Particle Life */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Particle Life</h3>
            <p className="text-sm text-muted-foreground">Adjust the lifespan of the background particles.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.particleLife]}
              max={10}
              min={1}
              step={0.5}
              onValueChange={(value) => setCustomizations({ ...customizations, particleLife: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.particleLife}</div>
          </div>
        </div>
      </Card>

      {/* Glass Blur */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Glass Blur</h3>
            <p className="text-sm text-muted-foreground">Adjust the blur intensity of glass elements.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.glassBlur]}
              max={50}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, glassBlur: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.glassBlur}px</div>
          </div>
        </div>
      </Card>

      {/* Parallax Intensity */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Parallax Intensity</h3>
            <p className="text-sm text-muted-foreground">Adjust the intensity of the parallax effect.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.parallaxIntensity * 100]}
              max={100}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, parallaxIntensity: value[0] / 100 })}
            />
            <div className="text-sm text-muted-foreground text-center">{(customizations.parallaxIntensity * 100).toFixed(0)}%</div>
          </div>
        </div>
      </Card>

      {/* Shadow Intensity */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Shadow Intensity</h3>
            <p className="text-sm text-muted-foreground">Adjust the intensity of the shadows.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.shadowIntensity * 100]}
              max={100}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, shadowIntensity: value[0] / 100 })}
            />
            <div className="text-sm text-muted-foreground text-center">{(customizations.shadowIntensity * 100).toFixed(0)}%</div>
          </div>
        </div>
      </Card>

      {/* Border Radius */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Border Radius</h3>
            <p className="text-sm text-muted-foreground">Adjust the border radius of elements.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.borderRadius]}
              max={32}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, borderRadius: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.borderRadius}px</div>
          </div>
        </div>
      </Card>

      {/* Tilt Intensity */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Tilt Intensity</h3>
            <p className="text-sm text-muted-foreground">Adjust the intensity of the tilt effect.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.tiltIntensity * 100]}
              max={100}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, tiltIntensity: value[0] / 100 })}
            />
            <div className="text-sm text-muted-foreground text-center">{(customizations.tiltIntensity * 100).toFixed(0)}%</div>
          </div>
        </div>
      </Card>

      {/* Depth of Field Blur */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Depth of Field Blur</h3>
            <p className="text-sm text-muted-foreground">Adjust the blur intensity when window isn't focused.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.dofBlur]}
              max={10}
              min={0}
              step={0.5}
              onValueChange={(value) => setCustomizations({ ...customizations, dofBlur: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.dofBlur}px</div>
          </div>
        </div>
      </Card>

      {/* CRT Scanline Opacity */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">CRT Scanline Opacity</h3>
            <p className="text-sm text-muted-foreground">Adjust the opacity of the CRT scanlines.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.crtScanlineOpacity * 100]}
              max={50}
              min={0}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, crtScanlineOpacity: value[0] / 100 })}
            />
            <div className="text-sm text-muted-foreground text-center">{(customizations.crtScanlineOpacity * 100).toFixed(0)}%</div>
          </div>
        </div>
      </Card>

      {/* CRT Scanline Gap */}
      <Card className="glass">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">CRT Scanline Gap</h3>
            <p className="text-sm text-muted-foreground">Adjust the gap between the CRT scanlines.</p>
          </div>
          <div className="w-32">
            <Slider
              defaultValue={[customizations.crtScanlineGap]}
              max={10}
              min={1}
              step={1}
              onValueChange={(value) => setCustomizations({ ...customizations, crtScanlineGap: value[0] })}
            />
            <div className="text-sm text-muted-foreground text-center">{customizations.crtScanlineGap}px</div>
          </div>
        </div>
      </Card>

      <Button variant="secondary" className="w-full" onClick={resetCustomizations}>
        <RotateCcw className="h-4 w-4 mr-2" /> Reset Customizations
      </Button>
    </div>
  );
};
