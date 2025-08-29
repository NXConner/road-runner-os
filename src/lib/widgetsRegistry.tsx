import React from 'react';
import { SystemMonitor } from '@/components/widgets/SystemMonitor';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { AIAssistant } from '@/components/widgets/AIAssistant';
import { FleetTracker } from '@/components/widgets/FleetTracker';
import { SecurityPanel } from '@/components/widgets/SecurityPanel';
import { MapWidget } from '@/components/widgets/MapWidget';
import { Calculator } from '@/components/widgets/Calculator';
import { MediaPlayer } from '@/components/widgets/MediaPlayer';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetTemplate {
  name: string;
  size: WidgetSize;
  description: string;
  component: React.ReactNode;
}

const templates: WidgetTemplate[] = [
  { name: 'System Monitor', component: <SystemMonitor />, size: 'medium', description: 'CPU, RAM, and system performance' },
  { name: 'Weather', component: <WeatherWidget />, size: 'small', description: 'Current weather and forecast' },
  { name: 'AI Assistant', component: <AIAssistant />, size: 'large', description: 'Gemini-powered AI helper' },
  { name: 'Fleet Tracker', component: <FleetTracker />, size: 'large', description: 'Real-time fleet monitoring' },
  { name: 'Security Panel', component: <SecurityPanel />, size: 'medium', description: 'System security status' },
  { name: 'Map', component: <MapWidget />, size: 'large', description: 'Interactive mapping system' },
  { name: 'Calculator', component: <Calculator />, size: 'small', description: 'Advanced calculator with paving estimates' },
  { name: 'Media Player', component: <MediaPlayer />, size: 'medium', description: 'Audio and video player' },
];

export const getWidgetTemplates = (): WidgetTemplate[] => templates;

export const getWidgetTemplateByName = (name: string): WidgetTemplate | undefined =>
  templates.find(t => t.name === name);

