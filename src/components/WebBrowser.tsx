import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface WebBrowserProps {
  initialUrl?: string;
  repoName?: string;
}

export const WebBrowser = ({ initialUrl, repoName }: WebBrowserProps) => {
  const [url, setUrl] = useState(initialUrl || 'https://github.com/NXConner');
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'built' | 'error'>('idle');

  const handleBuildApp = async () => {
    if (!repoName) return;
    
    setBuildStatus('building');
    setIsLoading(true);
    setError(null);
    
    // Simulate build process
    setTimeout(() => {
      // Try to load a potential deployment URL
      const deployedUrls = [
        `https://${repoName}.vercel.app`,
        `https://${repoName}.netlify.app`,
        `https://nxconner.github.io/${repoName}`,
        `https://${repoName.toLowerCase()}.lovable.app`
      ];
      
      // For demo purposes, we'll show the GitHub repo
      const repoUrl = `https://github.com/NXConner/${repoName}`;
      setCurrentUrl(repoUrl);
      setBuildStatus('built');
      setIsLoading(false);
    }, 3000);
  };

  const handleNavigation = (newUrl: string) => {
    setUrl(newUrl);
    setCurrentUrl(newUrl);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    if (repoName && buildStatus === 'idle') {
      handleBuildApp();
    }
  }, [repoName, buildStatus]);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Browser Controls */}
      <div className="flex items-center gap-2 p-2 bg-surface-elevated border-b border-border/20">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigation(url)}
            className="h-8 text-sm"
            placeholder="Enter URL..."
          />
        </div>
        
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Home className="h-4 w-4" />
        </Button>
      </div>

      {/* Build Status */}
      {repoName && buildStatus !== 'built' && (
        <div className="flex items-center justify-center gap-3 p-6 bg-surface/50">
          {buildStatus === 'building' && (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Building {repoName}...</p>
                <p className="text-sm text-muted-foreground">Fetching repository and compiling application</p>
              </div>
            </>
          )}
          {buildStatus === 'error' && (
            <>
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div className="text-center">
                <p className="font-medium text-destructive">Build Failed</p>
                <p className="text-sm text-muted-foreground">Unable to build {repoName}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative">
        {isLoading && buildStatus === 'built' && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {buildStatus === 'built' && (
          <div className="h-full">
            <iframe
              src={currentUrl}
              className="w-full h-full border-0"
              title={`${repoName} Application`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}

        {buildStatus === 'idle' && !repoName && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Enter a URL to browse the web</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};