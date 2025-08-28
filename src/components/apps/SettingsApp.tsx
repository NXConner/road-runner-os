import { useEffect, useState } from 'react';
import { themes, Theme, applyTheme } from '@/lib/themes';
import { Button } from '@/components/ui/button';

export const SettingsApp = () => {
  const [themeId, setThemeId] = useState<string>(() => localStorage.getItem('asphaltos.themeId') || themes[0].id);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => (localStorage.getItem('asphaltos.soundEnabled') ?? 'true') === 'true');

  const setTheme = (id: string) => {
    setThemeId(id);
    const t = themes.find(t => t.id === id) as Theme;
    applyTheme(t);
    localStorage.setItem('asphaltos.themeId', id);
  };

  useEffect(() => {
    localStorage.setItem('asphaltos.soundEnabled', String(soundEnabled));
  }, [soundEnabled]);

  return (
    <div className="p-4 space-y-4">
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
    </div>
  );
};

export default SettingsApp;

