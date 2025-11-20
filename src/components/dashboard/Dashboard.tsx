
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Thermometer, Droplets, Wind, Zap, AlertTriangle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { TemperatureChart } from "./TemperatureChart";
import { AmmoniaGauge } from "./AmmoniaGauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SensorRow = {
  id: number;
  temperature: number;
  humidity: number;
  ammonia: number;
  timestamp: string;
};

const fetchSensorData = async (): Promise<SensorRow[]> => {
  const { data, error } = await (supabase as any)
    .from("sensor_data_new")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data as SensorRow[]) ?? [];
};

export default function Dashboard() {
  const [coolingSystemOn, setCoolingSystemOn] = useState(true);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["sensorData"],
    queryFn: fetchSensorData,
    refetchInterval: 5000,
  });

  // Ambil data terbaru (paling atas) dari API
  const latest = Array.isArray(data) && data.length > 0 ? data[0] : null;

  // Quick Action handlers
  const handleExportData = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }
    
    const csvContent = [
      ["Timestamp", "Temperature (°C)", "Humidity (%)", "Ammonia (ppm)"],
      ...data.map(item => [
        new Date(item.timestamp).toLocaleString(),
        item.temperature,
        item.humidity,
        item.ammonia
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully!");
  };

  const handleResetAlarms = async () => {
    try {
      const { error } = await supabase
        .from("alerts_new")
        .delete()
        .neq('id', 0); // Delete all alerts
      
      if (error) throw error;
      toast.success("All alarms have been reset");
    } catch (error) {
      toast.error("Failed to reset alarms");
    }
  };

  const handleSystemCheck = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("System check completed");
        }, 2000);
      }),
      {
        loading: "Performing system check...",
        success: "System check completed - All systems operational",
        error: "System check failed"
      }
    );
  };

  const handleToggleCooling = () => {
    setCoolingSystemOn(!coolingSystemOn);
    toast.success(
      coolingSystemOn 
        ? "Cooling system turned OFF" 
        : "Cooling system turned ON"
    );
  };

  // Generate alerts
  const alerts: string[] = [];
  if (latest) {
    if (latest.temperature > 8) {
      alerts.push(`Critical: Temperature ${latest.temperature.toFixed(1)}°C exceeds vaccine threshold (8°C)`);
    }
    if (latest.ammonia > 25) {
      alerts.push(`Danger: Ammonia level ${latest.ammonia.toFixed(1)} ppm exceeds safe threshold (25 ppm)`);
    }
    // Cooling system status: as placeholder, always ON (implementasi IoT bisa menambah field ini)
    // if (!latest.coolingSystem) alerts.push("Warning: Cooling system offline - immediate attention required");
  }

  const getTemperatureStatus = (temp: number) => {
    if (temp > 8) return "critical";
    if (temp > 6) return "warning";
    return "normal";
  };
  const getHumidityStatus = (humidity: number) => {
    if (humidity > 70 || humidity < 45) return "warning";
    return "normal";
  };
  const getAmmoniaStatus = (ammonia: number) => {
    if (ammonia > 25) return "critical";
    if (ammonia > 15) return "warning";
    return "normal";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Sensor</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.includes("Critical") || alert.includes("Danger") ? "destructive" : "default"} className="border-l-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {alert}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Status Overview */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Temperature"
            value={latest.temperature.toFixed(1)}
            unit="°C"
            icon={<Thermometer className="h-5 w-5" />}
            status={getTemperatureStatus(latest.temperature)}
            subtitle={`Target: 2-8°C • Updated: ${new Date(latest.timestamp).toLocaleTimeString()}`}
          />
          <MetricCard
            title="Humidity"
            value={latest.humidity.toFixed(1)}
            unit="%"
            icon={<Droplets className="h-5 w-5" />}
            status={getHumidityStatus(latest.humidity)}
            subtitle={`Optimal: 45-65% • Updated: ${new Date(latest.timestamp).toLocaleTimeString()}`}
          />
          <MetricCard
            title="Ammonia"
            value={latest.ammonia.toFixed(1)}
            unit="ppm"
            icon={<Wind className="h-5 w-5" />}
            status={getAmmoniaStatus(latest.ammonia)}
            subtitle={`Threshold: <25 ppm • Updated: ${new Date(latest.timestamp).toLocaleTimeString()}`}
          />
           <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cooling System
              </CardTitle>
              <div className={`p-2 rounded-lg ${coolingSystemOn ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                <Zap className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-foreground">{coolingSystemOn ? 'ON' : 'OFF'}</div>
                <Badge variant="default" className={coolingSystemOn ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                  {coolingSystemOn ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                System Status • Updated: {new Date(latest.timestamp).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {latest && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemperatureChart />
          <AmmoniaGauge value={latest.ammonia} />
        </div>
      )}

      {/* Quick Actions */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleExportData}>Export Data</Button>
            <Button variant="outline" size="sm" onClick={handleResetAlarms}>Reset Alarms</Button>
            <Button variant="outline" size="sm" onClick={handleSystemCheck}>System Check</Button>
            <Button 
              variant={coolingSystemOn ? "destructive" : "default"} 
              size="sm" 
              onClick={handleToggleCooling}
            >
              Turn {coolingSystemOn ? 'OFF' : 'ON'} Cooling
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Data Sensor */}
      {data && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Riwayat Data Sensor</h2>
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Waktu</th>
                <th className="border px-2 py-1">Suhu (°C)</th>
                <th className="border px-2 py-1">Kelembaban (%)</th>
                <th className="border px-2 py-1">Amonia (ppm)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="border px-2 py-1">{item.temperature}</td>
                  <td className="border px-2 py-1">{item.humidity}</td>
                  <td className="border px-2 py-1">{item.ammonia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}