import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Calendar, Download, Filter, Loader2 } from "lucide-react";

type SensorData = {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  ammonia: number;
};

const fetchSensorData = async (): Promise<SensorData[]> => {
  const { data, error } = await supabase
    .from('sensor_data_new')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1000);
  
  if (error) throw new Error(error.message);
  return data || [];
};

export default function DataLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { data: sensorData, isLoading, error } = useQuery({
    queryKey: ['sensorDataLog'],
    queryFn: fetchSensorData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatus = (temp: number, humidity: number, ammonia: number) => {
    if (temp > 8 || ammonia > 25) return "Critical";
    if (temp > 6 || ammonia > 15 || humidity > 70 || humidity < 45) return "Warning";
    return "Normal";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Normal": "default",
      "Warning": "secondary", 
      "Critical": "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const filteredData = (sensorData || []).filter(item => 
    item.timestamp.includes(searchTerm) && 
    (dateFilter === "" || item.timestamp.includes(dateFilter))
  );

  const handleExportData = () => {
    if (!sensorData || sensorData.length === 0) return;
    
    const csvContent = [
      ['ID', 'Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Ammonia (ppm)', 'Status'],
      ...sensorData.map(item => [
        item.id,
        item.timestamp,
        item.temperature,
        item.humidity,
        item.ammonia,
        getStatus(item.temperature, item.humidity, item.ammonia)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          Error loading data: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Log</h1>
            <p className="text-muted-foreground">Historical sensor data records</p>
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by timestamp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Apply Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sensor Data Records ({filteredData.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Temperature (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Ammonia (ppm)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => {
                    const status = getStatus(item.temperature, item.humidity, item.ammonia);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">
                          {item.id}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {new Date(item.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            item.temperature > 8 ? 'text-destructive' : 'text-foreground'
                          }`}>
                            {item.temperature}°C
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            item.humidity > 70 || item.humidity < 45 ? 'text-yellow-600' : 'text-foreground'
                          }`}>
                            {item.humidity}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            item.ammonia > 25 ? 'text-destructive' : item.ammonia > 15 ? 'text-yellow-600' : 'text-foreground'
                          }`}>
                            {item.ammonia} ppm
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}