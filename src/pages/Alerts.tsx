import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  Bell, 
  Settings,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

type AlertData = {
  id: number;
  message: string;
  sensor_id: number | null;
  created_at: string;
};

const fetchAlerts = async (): Promise<AlertData[]> => {
  const { data, error } = await supabase
    .from('alerts_new')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw new Error(error.message);
  return data || [];
};

export default function Alerts() {
  const [alertSettings, setAlertSettings] = useState({
    temperatureAlerts: true,
    ammoniaAlerts: true,
    buzzerActivation: true,
  });

  const { data: alerts, isLoading, error, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const getSeverityFromMessage = (message: string) => {
    if (message.toLowerCase().includes('critical') || message.toLowerCase().includes('danger')) {
      return 'critical';
    }
    if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('exceeded')) {
      return 'warning';
    }
    return 'info';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-destructive";
      case "warning": return "text-yellow-600";
      case "resolved": return "text-green-600";
      default: return "text-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "resolved": return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const handleAcknowledgeAlert = async (alertId: number) => {
    try {
      const { error } = await supabase
        .from('alerts_new')
        .delete()
        .eq('id', alertId);
      
      if (error) throw error;
      refetch(); // Refresh the alerts list
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleClearAllAlerts = async () => {
    try {
      const { error } = await supabase
        .from('alerts_new')
        .delete()
        .neq('id', 0); // Delete all alerts
      
      if (error) throw error;
      refetch(); // Refresh the alerts list
    } catch (error) {
      console.error('Error clearing alerts:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-destructive">
          Error loading alerts: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const activeAlerts = alerts || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Monitor system alerts and threshold violations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearAllAlerts}>
              Clear All Alerts
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Alert Settings
            </Button>
          </div>
        </div>

        {/* Alert Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Alert Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Temperature Alerts
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable temperature alerts</span>
                  <Switch 
                    checked={alertSettings.temperatureAlerts}
                    onCheckedChange={(checked) => setAlertSettings({...alertSettings, temperatureAlerts: checked})}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Threshold: {"> 8°C"} (Vaccine storage limit)
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Ammonia Alerts
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable ammonia alerts</span>
                  <Switch 
                    checked={alertSettings.ammoniaAlerts}
                    onCheckedChange={(checked) => setAlertSettings({...alertSettings, ammoniaAlerts: checked})}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Threshold: {"> 25 ppm"} (Danger level)
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Buzzer Activation</span>
                <Switch 
                  checked={alertSettings.buzzerActivation}
                  onCheckedChange={(checked) => setAlertSettings({...alertSettings, buzzerActivation: checked})}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically activate buzzer for critical alerts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.map((alert) => {
                  const severity = getSeverityFromMessage(alert.message);
                  return (
                    <Alert key={alert.id} className="border-l-4 border-l-destructive">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(severity)}
                          <div className="space-y-1">
                            <div className="font-semibold">System Alert</div>
                            <AlertDescription className="text-sm">
                              {alert.message}
                            </AlertDescription>
                            <div className="text-xs text-muted-foreground">
                              {new Date(alert.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </Alert>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <p>No active alerts</p>
                <p className="text-sm">All systems operating normally</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}