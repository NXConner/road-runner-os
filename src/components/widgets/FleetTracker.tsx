import { useState, useEffect } from 'react';
import { Truck, MapPin, Gauge, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const FleetTracker = () => {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Paver-01', status: 'active', location: 'Highway 101', progress: 75, eta: '2h 15m' },
    { id: 2, name: 'Roller-02', status: 'idle', location: 'Depot', progress: 0, eta: 'Standby' },
    { id: 3, name: 'Truck-03', status: 'active', location: 'Site B', progress: 45, eta: '1h 30m' }
  ]);

  useEffect(() => {
    const updateVehicles = () => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        progress: vehicle.status === 'active' 
          ? Math.min(100, vehicle.progress + Math.random() * 5)
          : vehicle.progress
      })));
    };

    const interval = setInterval(updateVehicles, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'idle': return 'text-yellow-500';
      case 'maintenance': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Fleet Status</span>
      </div>

      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="space-y-2 p-2 bg-surface-elevated rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{vehicle.name}</span>
            <span className={`text-xs capitalize ${getStatusColor(vehicle.status)}`}>
              {vehicle.status}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{vehicle.location}</span>
          </div>

          {vehicle.status === 'active' && (
            <>
              <Progress value={vehicle.progress} className="h-1" />
              <div className="flex items-center justify-between text-xs">
                <span>{vehicle.progress.toFixed(0)}% Complete</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{vehicle.eta}</span>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="text-xs text-center text-muted-foreground">
        {vehicles.filter(v => v.status === 'active').length} of {vehicles.length} vehicles active
      </div>
    </div>
  );
};