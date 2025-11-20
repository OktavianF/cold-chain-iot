import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { toast } from 'sonner';

interface Device {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  device_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DeviceContextType {
  devices: Device[];
  activeDevice: Device | null;
  loading: boolean;
  setActiveDevice: (deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const { user } = useCustomAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeDevice, setActiveDeviceState] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    if (!user) {
      setDevices([]);
      setActiveDeviceState(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDevices(data || []);
      
      // Set active device based on is_active flag or first device
      const active = data?.find(d => d.is_active) || data?.[0] || null;
      setActiveDeviceState(active);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const setActiveDevice = async (deviceId: string) => {
    try {
      // Unset all devices as inactive
      await supabase
        .from('devices')
        .update({ is_active: false })
        .neq('id', deviceId);

      // Set selected device as active
      const { error } = await supabase
        .from('devices')
        .update({ is_active: true })
        .eq('id', deviceId);

      if (error) throw error;

      await fetchDevices();
      toast.success('Active device updated');
    } catch (error) {
      console.error('Error setting active device:', error);
      toast.error('Failed to update active device');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [user]);

  const value = {
    devices,
    activeDevice,
    loading,
    setActiveDevice,
    refreshDevices: fetchDevices,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}
