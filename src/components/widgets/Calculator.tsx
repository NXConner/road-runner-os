import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator as CalcIcon, Ruler, Truck } from 'lucide-react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState<'basic' | 'asphalt'>('basic');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperation = (op: string) => {
    setDisplay(prev => prev + op);
  };

  const handleEquals = () => {
    try {
      const result = eval(display);
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const calculateAsphalt = (type: 'area' | 'volume' | 'tons') => {
    // Mock asphalt calculations
    const value = parseFloat(display) || 0;
    let result = 0;
    
    switch (type) {
      case 'area':
        result = value * 2.5; // sq ft to tons
        break;
      case 'volume':
        result = value * 150; // cubic yards to tons
        break;
      case 'tons':
        result = value * 2000; // tons to pounds
        break;
    }
    
    setDisplay(result.toFixed(2));
  };

  return (
    <div className="space-y-2">
      {/* Mode Toggle */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={mode === 'basic' ? 'default' : 'outline'}
          onClick={() => setMode('basic')}
          className="h-6 text-xs flex-1"
        >
          <CalcIcon className="h-3 w-3 mr-1" />
          Basic
        </Button>
        <Button
          size="sm"
          variant={mode === 'asphalt' ? 'default' : 'outline'}
          onClick={() => setMode('asphalt')}
          className="h-6 text-xs flex-1"
        >
          <Truck className="h-3 w-3 mr-1" />
          Paving
        </Button>
      </div>

      {/* Display */}
      <div className="bg-surface-elevated p-2 rounded text-right font-mono text-sm">
        {display}
      </div>

      {mode === 'basic' ? (
        /* Basic Calculator */
        <div className="grid grid-cols-4 gap-1">
          <Button size="sm" onClick={handleClear} className="h-8 text-xs">C</Button>
          <Button size="sm" onClick={() => handleOperation('/')} className="h-8 text-xs">÷</Button>
          <Button size="sm" onClick={() => handleOperation('*')} className="h-8 text-xs">×</Button>
          <Button size="sm" onClick={() => setDisplay(prev => prev.slice(0, -1))} className="h-8 text-xs">⌫</Button>
          
          <Button size="sm" onClick={() => handleNumber('7')} className="h-8 text-xs">7</Button>
          <Button size="sm" onClick={() => handleNumber('8')} className="h-8 text-xs">8</Button>
          <Button size="sm" onClick={() => handleNumber('9')} className="h-8 text-xs">9</Button>
          <Button size="sm" onClick={() => handleOperation('-')} className="h-8 text-xs">-</Button>
          
          <Button size="sm" onClick={() => handleNumber('4')} className="h-8 text-xs">4</Button>
          <Button size="sm" onClick={() => handleNumber('5')} className="h-8 text-xs">5</Button>
          <Button size="sm" onClick={() => handleNumber('6')} className="h-8 text-xs">6</Button>
          <Button size="sm" onClick={() => handleOperation('+')} className="h-8 text-xs">+</Button>
          
          <Button size="sm" onClick={() => handleNumber('1')} className="h-8 text-xs">1</Button>
          <Button size="sm" onClick={() => handleNumber('2')} className="h-8 text-xs">2</Button>
          <Button size="sm" onClick={() => handleNumber('3')} className="h-8 text-xs">3</Button>
          <Button size="sm" onClick={handleEquals} className="h-8 text-xs row-span-2">=</Button>
          
          <Button size="sm" onClick={() => handleNumber('0')} className="h-8 text-xs col-span-2">0</Button>
          <Button size="sm" onClick={() => handleNumber('.')} className="h-8 text-xs">.</Button>
        </div>
      ) : (
        /* Asphalt Calculator */
        <div className="space-y-2">
          <div className="text-xs text-center text-muted-foreground">
            Enter measurement and select conversion:
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Button
              size="sm"
              onClick={() => calculateAsphalt('area')}
              className="h-8 text-xs"
            >
              <Ruler className="h-3 w-3 mr-1" />
              Area→Tons
            </Button>
            <Button
              size="sm"
              onClick={() => calculateAsphalt('volume')}
              className="h-8 text-xs"
            >
              Vol→Tons
            </Button>
            <Button
              size="sm"
              onClick={() => calculateAsphalt('tons')}
              className="h-8 text-xs col-span-2"
            >
              Tons→Pounds
            </Button>
          </div>
          {/* Basic number pad for input */}
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6,7,8,9,0].map(num => (
              <Button
                key={num}
                size="sm"
                onClick={() => handleNumber(num.toString())}
                className="h-6 text-xs"
              >
                {num}
              </Button>
            ))}
            <Button size="sm" onClick={() => handleNumber('.')} className="h-6 text-xs">.</Button>
            <Button size="sm" onClick={handleClear} className="h-6 text-xs">Clear</Button>
          </div>
        </div>
      )}
    </div>
  );
};