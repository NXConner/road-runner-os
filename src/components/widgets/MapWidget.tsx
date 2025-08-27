import { useState } from 'react';
import { MapPin, Navigation, ZoomIn, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MapWidget = () => {
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain' | 'road'>('road');
  const [showTraffic, setShowTraffic] = useState(false);

  const locations = [
    { name: 'HQ', lat: 40.7128, lng: -74.0060, type: 'office' },
    { name: 'Site A', lat: 40.7580, lng: -73.9855, type: 'construction' },
    { name: 'Site B', lat: 40.6892, lng: -74.0445, type: 'construction' },
    { name: 'Depot', lat: 40.7282, lng: -73.7949, type: 'depot' }
  ];

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'office': return 'text-blue-500';
      case 'construction': return 'text-orange-500';
      case 'depot': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-3 h-full">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={mapMode === 'road' ? 'default' : 'outline'}
            onClick={() => setMapMode('road')}
            className="h-6 text-xs"
          >
            Road
          </Button>
          <Button
            size="sm"
            variant={mapMode === 'satellite' ? 'default' : 'outline'}
            onClick={() => setMapMode('satellite')}
            className="h-6 text-xs"
          >
            Sat
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
            <Target className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Mock Map Display */}
      <div className="flex-1 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded relative overflow-hidden">
        {/* Mock roads */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform -rotate-12" />
          <div className="absolute top-1/3 left-1/4 w-1/2 h-0.5 bg-gray-400 transform rotate-45" />
        </div>

        {/* Location markers */}
        {locations.map((location, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 30}%`
            }}
          >
            <MapPin className={`h-4 w-4 ${getMarkerColor(location.type)}`} />
            <div className="text-xs mt-1 text-center whitespace-nowrap">
              {location.name}
            </div>
          </div>
        ))}
      </div>

      {/* Location List */}
      <div className="space-y-1 max-h-16 overflow-y-auto">
        {locations.map((location, index) => (
          <div key={index} className="flex items-center gap-2 text-xs p-1">
            <MapPin className={`h-3 w-3 ${getMarkerColor(location.type)}`} />
            <span>{location.name}</span>
            <span className="text-muted-foreground ml-auto capitalize">{location.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};