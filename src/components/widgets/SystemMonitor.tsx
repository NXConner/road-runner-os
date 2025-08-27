import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Cpu, HardDrive, Zap, Thermometer } from 'lucide-react';

export const SystemMonitor = () => {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    temperature: 0
  });

  useEffect(() => {
    const updateStats = () => {
      setStats({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        storage: Math.random() * 100,
        temperature: 30 + Math.random() * 40
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>CPU</span>
            <span>{stats.cpu.toFixed(1)}%</span>
          </div>
          <Progress value={stats.cpu} className="h-2" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-accent" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>Memory</span>
            <span>{stats.memory.toFixed(1)}%</span>
          </div>
          <Progress value={stats.memory} className="h-2" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4 text-secondary" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>Storage</span>
            <span>{stats.storage.toFixed(1)}%</span>
          </div>
          <Progress value={stats.storage} className="h-2" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-orange-500" />
          <span className="text-xs">Temperature</span>
        </div>
        <span className="text-xs font-mono">{stats.temperature.toFixed(1)}°C</span>
      </div>
    </div>
  );
};