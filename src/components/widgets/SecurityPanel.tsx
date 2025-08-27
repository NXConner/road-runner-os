import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';

export const SecurityPanel = () => {
  const [securityStatus, setSecurityStatus] = useState({
    systemIntegrity: 'secure',
    firewall: 'active',
    lastScan: '2 min ago',
    threats: 0,
    accessAttempts: 3
  });

  const [alerts, setAlerts] = useState([
    { type: 'info', message: 'System scan completed', time: '2m ago' },
    { type: 'warning', message: 'Unauthorized access attempt blocked', time: '15m ago' }
  ]);

  useEffect(() => {
    const updateSecurity = () => {
      setSecurityStatus(prev => ({
        ...prev,
        threats: Math.floor(Math.random() * 3),
        accessAttempts: Math.floor(Math.random() * 10)
      }));
    };

    const interval = setInterval(updateSecurity, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'danger': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Security Status</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 bg-surface-elevated rounded">
          {getStatusIcon(securityStatus.systemIntegrity)}
          <div>
            <div className="text-xs font-medium">System</div>
            <div className="text-xs text-muted-foreground capitalize">{securityStatus.systemIntegrity}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-surface-elevated rounded">
          <Lock className="h-4 w-4 text-blue-500" />
          <div>
            <div className="text-xs font-medium">Firewall</div>
            <div className="text-xs text-muted-foreground capitalize">{securityStatus.firewall}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Threats Blocked</span>
          <span className="font-mono">{securityStatus.threats}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Access Attempts</span>
          <span className="font-mono">{securityStatus.accessAttempts}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Last Scan</span>
          <span className="text-muted-foreground">{securityStatus.lastScan}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-medium">Recent Alerts</div>
        {alerts.slice(0, 2).map((alert, index) => (
          <div key={index} className="flex items-start gap-2 p-1 text-xs">
            <Eye className="h-3 w-3 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <div>{alert.message}</div>
              <div className="text-muted-foreground">{alert.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};