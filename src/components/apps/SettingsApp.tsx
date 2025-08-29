import { useEffect, useState } from 'react';
import { themes, Theme, applyTheme } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SettingsApp = () => {
  const [themeId, setThemeId] = useState<string>(() => localStorage.getItem('asphaltos.themeId') || themes[0].id);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => (localStorage.getItem('asphaltos.soundEnabled') ?? 'true') === 'true');
  const [lovableSlugs, setLovableSlugs] = useState<string>(() => localStorage.getItem('asphaltos.lovable.projectSlugs') || '');
  const [customUrls, setCustomUrls] = useState<string>(() => localStorage.getItem('asphaltos.repo.customUrls') || '{}');

  const setTheme = (id: string) => {
    setThemeId(id);
    const t = themes.find(t => t.id === id) as Theme;
    applyTheme(t);
    localStorage.setItem('asphaltos.themeId', id);
  };

  useEffect(() => {
    localStorage.setItem('asphaltos.soundEnabled', String(soundEnabled));
  }, [soundEnabled]);

  const saveLovable = () => {
    localStorage.setItem('asphaltos.lovable.projectSlugs', lovableSlugs);
  };

  const saveCustomUrls = () => {
    try {
      const parsed = JSON.parse(customUrls);
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
      localStorage.setItem('asphaltos.repo.customUrls', JSON.stringify(parsed));
    } catch (e) {
      alert('Custom URLs must be valid JSON object like { "repo-name": "https://example.com" }');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Theme</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded border ${themeId === t.id ? 'border-primary' : 'border-border/40'} text-left`}
            >
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.description}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Sounds</h3>
        <Button variant="outline" onClick={() => setSoundEnabled(v => !v)}>
          {soundEnabled ? 'Disable' : 'Enable'} system sounds
        </Button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Lovable Projects</h3>
        <p className="text-sm text-muted-foreground mb-2">Comma-separated slugs. Example: <code>my-app,another-app</code></p>
        <div className="flex gap-2 items-center">
          <Input value={lovableSlugs} onChange={(e) => setLovableSlugs(e.target.value)} placeholder="slug1,slug2" />
          <Button onClick={saveLovable}>Save</Button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Custom Repo URLs</h3>
        <p className="text-sm text-muted-foreground mb-2">JSON map of repo name to URL.</p>
        <textarea
          value={customUrls}
          onChange={(e) => setCustomUrls(e.target.value)}
          className="w-full h-40 p-2 rounded border border-border/40 bg-background font-mono text-xs"
          placeholder='{"repo-name": "https://your-app.example.com"}'
        />
        <div className="mt-2">
          <Button onClick={saveCustomUrls}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;

