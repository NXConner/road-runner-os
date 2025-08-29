export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
  effects: {
    glow: boolean;
    glass: boolean;
    neon: boolean;
    particles: boolean;
  };
  wallpaper: string;
  sounds: {
    click: string;
    notification: string;
    startup: string;
  };
}

// Import wallpapers so Vite resolves correct asset URLs
import asphaltWallpaper from '@/assets/asphalt-wallpaper.jpg';
import heroOpsWallpaper from '@/assets/hero-ops-wallpaper.jpg';
import nextechWallpaper from '@/assets/nextech-wallpaper.jpg';
import securityWallpaper from '@/assets/security-wallpaper.jpg';
import fleetWallpaper from '@/assets/fleet-wallpaper.jpg';

export const themes: Theme[] = [
  {
    id: 'asphalt-classic',
    name: 'Asphalt Classic',
    description: 'Original road-themed dark interface',
    colors: {
      primary: 'hsl(45, 100%, 60%)',
      secondary: 'hsl(0, 0%, 20%)',
      accent: 'hsl(30, 100%, 50%)',
      background: 'hsl(0, 0%, 8%)',
      surface: 'hsl(0, 0%, 12%)',
      text: 'hsl(0, 0%, 95%)',
      muted: 'hsl(0, 0%, 65%)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, hsl(45, 100%, 60%), hsl(30, 100%, 50%))',
      secondary: 'linear-gradient(180deg, hsl(0, 0%, 12%), hsl(0, 0%, 8%))',
      background: 'linear-gradient(135deg, hsl(0, 0%, 8%), hsl(220, 13%, 9%))'
    },
    effects: { glow: true, glass: true, neon: false, particles: false },
    wallpaper: asphaltWallpaper,
    sounds: { click: 'asphalt-click.mp3', notification: 'road-beep.mp3', startup: 'engine-start.mp3' }
  },
  {
    id: 'hero-ops',
    name: 'Hero Operations',
    description: 'Action-packed tactical interface',
    colors: {
      primary: 'hsl(210, 100%, 60%)',
      secondary: 'hsl(0, 85%, 60%)',
      accent: 'hsl(120, 100%, 40%)',
      background: 'hsl(220, 20%, 5%)',
      surface: 'hsl(220, 15%, 10%)',
      text: 'hsl(0, 0%, 98%)',
      muted: 'hsl(210, 10%, 70%)'
    },
    gradients: {
      primary: 'linear-gradient(45deg, hsl(210, 100%, 60%), hsl(180, 100%, 50%))',
      secondary: 'linear-gradient(135deg, hsl(0, 85%, 60%), hsl(330, 85%, 60%))',
      background: 'radial-gradient(circle, hsl(220, 20%, 8%), hsl(220, 20%, 3%))'
    },
    effects: { glow: true, glass: false, neon: true, particles: true },
    wallpaper: heroOpsWallpaper,
    sounds: { click: 'tactical-click.mp3', notification: 'alert.mp3', startup: 'system-online.mp3' }
  },
  {
    id: 'nextech-prime',
    name: 'NeXTech Prime',
    description: 'Futuristic tech interface',
    colors: {
      primary: 'hsl(280, 100%, 70%)',
      secondary: 'hsl(180, 100%, 50%)',
      accent: 'hsl(60, 100%, 50%)',
      background: 'hsl(240, 30%, 2%)',
      surface: 'hsl(240, 25%, 6%)',
      text: 'hsl(180, 50%, 90%)',
      muted: 'hsl(180, 20%, 60%)'
    },
    gradients: {
      primary: 'linear-gradient(90deg, hsl(280, 100%, 70%), hsl(320, 100%, 70%))',
      secondary: 'linear-gradient(45deg, hsl(180, 100%, 50%), hsl(200, 100%, 70%))',
      background: 'linear-gradient(180deg, hsl(240, 30%, 4%), hsl(260, 40%, 2%))'
    },
    effects: { glow: true, glass: true, neon: true, particles: true },
    wallpaper: nextechWallpaper,
    sounds: { click: 'synth-click.mp3', notification: 'digital-chime.mp3', startup: 'boot-sequence.mp3' }
  },
  {
    id: 'guardian-security',
    name: 'Guardian Security',
    description: 'Professional security interface',
    colors: {
      primary: 'hsl(120, 60%, 50%)',
      secondary: 'hsl(0, 70%, 50%)',
      accent: 'hsl(45, 100%, 50%)',
      background: 'hsl(0, 0%, 3%)',
      surface: 'hsl(0, 0%, 8%)',
      text: 'hsl(120, 30%, 90%)',
      muted: 'hsl(0, 0%, 60%)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, hsl(120, 60%, 50%), hsl(140, 60%, 40%))',
      secondary: 'linear-gradient(45deg, hsl(0, 70%, 50%), hsl(20, 70%, 50%))',
      background: 'radial-gradient(ellipse, hsl(120, 20%, 5%), hsl(0, 0%, 2%))'
    },
    effects: { glow: false, glass: true, neon: false, particles: false },
    wallpaper: securityWallpaper,
    sounds: { click: 'secure-click.mp3', notification: 'security-alert.mp3', startup: 'system-armed.mp3' }
  },
  {
    id: 'fleet-commander',
    name: 'Fleet Commander',
    description: 'Advanced fleet management interface',
    colors: {
      primary: 'hsl(200, 100%, 50%)',
      secondary: 'hsl(40, 100%, 60%)',
      accent: 'hsl(160, 80%, 50%)',
      background: 'hsl(210, 30%, 8%)',
      surface: 'hsl(210, 25%, 12%)',
      text: 'hsl(200, 30%, 95%)',
      muted: 'hsl(200, 15%, 70%)'
    },
    gradients: {
      primary: 'linear-gradient(45deg, hsl(200, 100%, 50%), hsl(220, 100%, 60%))',
      secondary: 'linear-gradient(90deg, hsl(40, 100%, 60%), hsl(60, 100%, 50%))',
      background: 'linear-gradient(135deg, hsl(210, 30%, 10%), hsl(230, 25%, 6%))'
    },
    effects: { glow: true, glass: true, neon: false, particles: false },
    wallpaper: fleetWallpaper,
    sounds: { click: 'command-click.mp3', notification: 'fleet-alert.mp3', startup: 'command-online.mp3' }
  }
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply colors
  root.style.setProperty('--primary', theme.colors.primary.replace('hsl(', '').replace(')', ''));
  root.style.setProperty('--secondary', theme.colors.secondary.replace('hsl(', '').replace(')', ''));
  root.style.setProperty('--accent', theme.colors.accent.replace('hsl(', '').replace(')', ''));
  root.style.setProperty('--background', theme.colors.background.replace('hsl(', '').replace(')', ''));
  root.style.setProperty('--card', theme.colors.surface.replace('hsl(', '').replace(')', ''));
  root.style.setProperty('--foreground', theme.colors.text.replace('hsl(', '').replace(')', ''));
  root.style.setProperty('--muted-foreground', theme.colors.muted.replace('hsl(', '').replace(')', ''));
  
  // Apply gradients
  root.style.setProperty('--gradient-primary', theme.gradients.primary);
  root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
  root.style.setProperty('--gradient-background', theme.gradients.background);
  // Apply wallpaper
  root.style.setProperty('--wallpaper-image', `url(${theme.wallpaper})`);
  
  // Apply effects classes
  document.body.className = document.body.className
    .replace(/theme-\w+/g, '')
    .replace(/\beffects-(glow|glass|neon|particles)\b/g, '')
    .trim();
  document.body.classList.add(`theme-${theme.id}`);
  if (theme.effects.glow) document.body.classList.add('effects-glow');
  if (theme.effects.glass) document.body.classList.add('effects-glass');
  if (theme.effects.neon) document.body.classList.add('effects-neon');
  if (theme.effects.particles) document.body.classList.add('effects-particles');
};