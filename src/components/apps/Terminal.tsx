import { useEffect, useRef, useState } from 'react';

interface Entry { type: 'out' | 'err' | 'in'; text: string }

const HELP = `Commands:\nhelp - show help\nclear - clear screen\nabout - OS info\nopen <url> - open URL in browser window`;

export const Terminal = () => {
  const [history, setHistory] = useState<Entry[]>([{ type: 'out', text: 'AsphaltOS Terminal v1.0' }]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const append = (entry: Entry) => setHistory(prev => prev.concat(entry));

  const run = (line: string) => {
    const [cmd, ...args] = line.trim().split(/\s+/);
    switch (cmd) {
      case 'help':
        append({ type: 'out', text: HELP });
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'about':
        append({ type: 'out', text: 'Road-Runner AsphaltOS - React + Vite' });
        break;
      case 'open': {
        const url = args[0];
        if (!url) { append({ type: 'err', text: 'Usage: open <url>' }); break; }
        append({ type: 'out', text: `Opening ${url} ...` });
        window.open(url, '_blank');
        break;
      }
      case '':
        break;
      default:
        append({ type: 'err', text: `Unknown: ${cmd}. Type 'help'.` });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const line = input;
    setInput('');
    append({ type: 'in', text: line });
    run(line);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  return (
    <div className="h-full bg-black text-green-300 font-mono text-sm flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-auto p-2">
        {history.map((e, i) => (
          <div key={i} className={e.type === 'err' ? 'text-red-400' : e.type === 'in' ? 'text-white' : ''}>
            {e.text}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="p-2 border-t border-border/40 flex items-center gap-2">
        <span className="text-green-500">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-green-200"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;

