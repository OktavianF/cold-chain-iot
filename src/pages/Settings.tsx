import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Wifi, 
  Database,
  Shield,
  Save,
  RefreshCw,
  Loader2
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useCustomAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    temperature_warning: 6,
    temperature_critical: 8,
    min_humidity: 45,
    max_humidity: 70,
    ammonia_warning: 15,
    ammonia_critical: 25,
    email_notifications: true,
    push_notifications: true,
  });
  const [profile, setProfile] = useState({
    name: '',
    username: '',
  });

  useEffect(() => {
    loadSettings();
    loadProfile();
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        setSettings({
          temperature_warning: data.temperature_warning || 6,
          temperature_critical: data.temperature_critical || 8,
          min_humidity: data.min_humidity || 45,
          max_humidity: data.max_humidity || 70,
          ammonia_warning: data.ammonia_warning || 15,
          ammonia_critical: data.ammonia_critical || 25,
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    
    setProfile({
      name: user.name || '',
      username: user.username || '',
    });
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          temperature_warning: settings.temperature_warning,
          temperature_critical: settings.temperature_critical,
          min_humidity: settings.min_humidity,
          max_humidity: settings.max_humidity,
          ammonia_warning: settings.ammonia_warning,
          ammonia_critical: settings.ammonia_critical,
          email_notifications: settings.email_notifications,
          push_notifications: settings.push_notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    try {
      const { data } = await supabase
        .from('sensor_data_new')
        .select('*')
        .order('timestamp', { ascending: false });

      if (data) {
        const csvContent = [
          ['ID', 'Temperature', 'Humidity', 'Ammonia', 'Timestamp'],
          ...data.map(row => [
            row.id,
            row.temperature,
            row.humidity,
            row.ammonia,
            row.timestamp
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sensor_data_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Data exported",
          description: "Your sensor data has been exported as CSV.",
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and parameters</p>
          </div>
          <Button 
            onClick={saveSettings}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">ESP8266 Status</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Last Update</span>
                </div>
                <Badge variant="outline">2 min ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Sensor Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="temp-critical">Temperature Critical (°C)</Label>
                <Input 
                  id="temp-critical" 
                  type="number" 
                  value={settings.temperature_critical}
                  onChange={(e) => setSettings({...settings, temperature_critical: parseFloat(e.target.value) || 0})}
                  placeholder="Enter critical temperature threshold"
                />
                <p className="text-xs text-muted-foreground">
                  Critical alert if temperature exceeds this value
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="temp-warning">Temperature Warning (°C)</Label>
                <Input 
                  id="temp-warning" 
                  type="number" 
                  value={settings.temperature_warning}
                  onChange={(e) => setSettings({...settings, temperature_warning: parseFloat(e.target.value) || 0})}
                  placeholder="Enter warning temperature threshold"
                />
                <p className="text-xs text-muted-foreground">
                  Warning alert if temperature exceeds this value
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="ammonia-critical">Ammonia Critical (ppm)</Label>
                <Input 
                  id="ammonia-critical" 
                  type="number" 
                  value={settings.ammonia_critical}
                  onChange={(e) => setSettings({...settings, ammonia_critical: parseFloat(e.target.value) || 0})}
                  placeholder="Enter critical ammonia threshold"
                />
                <p className="text-xs text-muted-foreground">
                  Critical alert for ammonia levels above this threshold
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="ammonia-warning">Ammonia Warning (ppm)</Label>
                <Input 
                  id="ammonia-warning" 
                  type="number" 
                  value={settings.ammonia_warning}
                  onChange={(e) => setSettings({...settings, ammonia_warning: parseFloat(e.target.value) || 0})}
                  placeholder="Enter warning ammonia threshold"
                />
                <p className="text-xs text-muted-foreground">
                  Warning alert for ammonia levels above this threshold
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="humidity-min">Minimum Humidity (%)</Label>
                <Input 
                  id="humidity-min" 
                  type="number" 
                  value={settings.min_humidity}
                  onChange={(e) => setSettings({...settings, min_humidity: parseFloat(e.target.value) || 0})}
                  placeholder="Enter minimum humidity threshold"
                />
                <p className="text-xs text-muted-foreground">
                  Alert if humidity falls below this level
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="humidity-max">Maximum Humidity (%)</Label>
                <Input 
                  id="humidity-max" 
                  type="number" 
                  value={settings.max_humidity}
                  onChange={(e) => setSettings({...settings, max_humidity: parseFloat(e.target.value) || 0})}
                  placeholder="Enter maximum humidity threshold"
                />
                <p className="text-xs text-muted-foreground">
                  Alert if humidity exceeds this level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alert notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => setSettings({...settings, email_notifications: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive real-time push notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.push_notifications}
                onCheckedChange={(checked) => setSettings({...settings, push_notifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profile.name}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={profile.username}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Export Sensor Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download all sensor data as a CSV file
                </p>
              </div>
              <Button onClick={exportData} variant="outline">
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}