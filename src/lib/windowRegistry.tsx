import React from 'react';
import { WebBrowser } from '@/components/WebBrowser';
import { FileExplorer } from '@/components/apps/FileExplorer';
import { Terminal } from '@/components/apps/Terminal';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { HardDrive, Folder, Image, Trash2 } from 'lucide-react';

export type WindowKind =
  | 'file-explorer'
  | 'terminal'
  | 'settings'
  | 'repo-browser'
  | 'web-browser'
  | 'panel:my-computer'
  | 'panel:documents'
  | 'panel:recycle-bin';

export type WindowMeta =
  | { repoName: string }
  | { initialUrl: string }
  | Record<string, never>;

export const createWindowComponent = (kind: WindowKind, meta?: WindowMeta): React.ReactNode => {
  switch (kind) {
    case 'repo-browser': {
      const repoName = (meta as any)?.repoName as string | undefined;
      return <WebBrowser repoName={repoName} />;
    }
    case 'web-browser': {
      const initialUrl = (meta as any)?.initialUrl as string | undefined;
      return <WebBrowser initialUrl={initialUrl} />;
    }
    case 'file-explorer': {
      return <FileExplorer />;
    }
    case 'terminal': {
      return <Terminal />;
    }
    case 'settings': {
      return <SettingsApp />;
    }
    case 'panel:my-computer': {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">My Computer</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <HardDrive className="h-5 w-5" />
              <span>Local Disk (C:)</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <Folder className="h-5 w-5" />
              <span>Documents</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <Image className="h-5 w-5" />
              <span>Pictures</span>
            </div>
          </div>
        </div>
      );
    }
    case 'panel:documents': {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Documents</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <Folder className="h-5 w-5" />
              <span>README.txt</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded">
              <Folder className="h-5 w-5" />
              <span>AsphaltOS Manual.pdf</span>
            </div>
          </div>
        </div>
      );
    }
    case 'panel:recycle-bin': {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recycle Bin</h2>
          <p className="text-muted-foreground">The recycle bin is empty.</p>
        </div>
      );
    }
    default:
      return <div className="p-6">Unknown window</div>;
  }
};

