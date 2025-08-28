import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, FileText, ArrowLeft, ArrowRight, Home } from 'lucide-react';

type NodeType = 'folder' | 'file';

interface FsNode {
  id: string;
  name: string;
  type: NodeType;
  children?: FsNode[];
}

const SAMPLE_FS: FsNode = {
  id: 'root',
  name: 'This PC',
  type: 'folder',
  children: [
    {
      id: 'c',
      name: 'Local Disk (C:)',
      type: 'folder',
      children: [
        { id: 'readme', name: 'README.txt', type: 'file' },
        { id: 'manual', name: 'AsphaltOS Manual.pdf', type: 'file' },
        { id: 'docs', name: 'Documents', type: 'folder', children: [
          { id: 'notes', name: 'Notes.md', type: 'file' },
        ] },
        { id: 'pics', name: 'Pictures', type: 'folder', children: [
          { id: 'bg', name: 'wallpaper.jpg', type: 'file' },
        ] },
      ]
    }
  ]
};

const findNodeByPath = (root: FsNode, path: number[]): FsNode => {
  let node: FsNode = root;
  for (const index of path) {
    if (!node.children) break;
    node = node.children[index];
  }
  return node;
};

export const FileExplorer = () => {
  const [path, setPath] = useState<number[]>([]);
  const [filter, setFilter] = useState('');
  const currentNode = useMemo(() => findNodeByPath(SAMPLE_FS, path), [path]);

  const canGoBack = path.length > 0;
  const goBack = () => setPath(prev => prev.slice(0, -1));
  const goHome = () => setPath([]);

  const enter = (index: number) => {
    if (!currentNode.children) return;
    const target = currentNode.children[index];
    if (target.type === 'folder') setPath(prev => prev.concat(index));
  };

  const entries = (currentNode.children || []).filter(n =>
    n.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 bg-surface-elevated border-b border-border/20">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={goBack} disabled={!canGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={goHome}>
          <Home className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8 text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-auto">
        {entries.map((node, idx) => (
          <button
            key={node.id}
            onDoubleClick={() => enter(idx)}
            className="flex items-center gap-2 p-2 rounded hover:bg-surface-elevated text-left"
            title={node.name}
          >
            {node.type === 'folder' ? <Folder className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <span className="text-sm truncate">{node.name}</span>
          </button>
        ))}
        {entries.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground">No items</div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;

