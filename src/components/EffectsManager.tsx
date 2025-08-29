import { useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const EffectsManager = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.id = 'effects-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    document.body.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    let particleId = 0;

    const readVar = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

    const getSettings = () => {
      const densityPercent = parseFloat(readVar('--particle-density', '50%').replace('%', '')) || 50;
      const sizePx = parseFloat(readVar('--particle-size', '2px').replace('px', '')) || 2;
      const speedMultiplier = parseFloat(readVar('--particle-speed', '1')) || 1;
      const lifeFrames = parseFloat(readVar('--particle-life', '60')) || 60;
      return { densityPercent, sizePx, speedMultiplier, lifeFrames };
    };

    const createParticle = (x: number, y: number) => {
      if (!document.body.classList.contains('effects-particles')) return;
      const { speedMultiplier, lifeFrames } = getSettings();
      
      particles.push({
        id: particleId++,
        x,
        y,
        vx: (Math.random() - 0.5) * 2 * speedMultiplier,
        vy: (Math.random() - 0.5) * 2 * speedMultiplier,
        life: lifeFrames,
        maxLife: lifeFrames,
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary') || '45, 100%, 60%'
      });
    };

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { sizePx } = getSettings();
      
      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${particle.color})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, sizePx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    animate();

    // Create particles on mouse move
    let lastParticleTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const { densityPercent } = getSettings();
      // Throttle based on density; higher density => more frequent
      const throttleMs = 100 - Math.min(95, densityPercent) ;
      if (now - lastParticleTime > throttleMs) {
        const bursts = Math.max(1, Math.round(densityPercent / 25));
        for (let i = 0; i < bursts; i++) {
          const jitterX = (Math.random() - 0.5) * 10;
          const jitterY = (Math.random() - 0.5) * 10;
          createParticle(e.clientX + jitterX, e.clientY + jitterY);
        }
        lastParticleTime = now;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
};