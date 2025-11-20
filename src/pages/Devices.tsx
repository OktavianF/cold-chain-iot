import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useDevice } from '@/contexts/DeviceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, MapPin, Radio } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCustomAuth } from '@/hooks/useCustomAuth';

export default function Devices() {
  const { devices, activeDevice, setActiveDevice, refreshDevices } = useDevice();
  const { user } = useCustomAuth();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    device_id: '',
  });

  const handleAdd = async () => {
    if (!user || !formData.name || !formData.device_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('devices').insert({
        user_id: user.id,
        name: formData.name,
        location: formData.location,
        device_id: formData.device_id,
        is_active: devices.length === 0, // First device is active by default
      });

      if (error) throw error;

      toast.success('Device added successfully');
      setIsAddOpen(false);
      setFormData({ name: '', location: '', device_id: '' });
      refreshDevices();
    } catch (error: any) {
      console.error('Error adding device:', error);
      toast.error(error.message || 'Failed to add device');
    }
  };

  const handleEdit = async () => {
    if (!editingDevice || !formData.name || !formData.device_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('devices')
        .update({
          name: formData.name,
          location: formData.location,
          device_id: formData.device_id,
        })
        .eq('id', editingDevice.id);

      if (error) throw error;

      toast.success('Device updated successfully');
      setIsEditOpen(false);
      setEditingDevice(null);
      setFormData({ name: '', location: '', device_id: '' });
      refreshDevices();
    } catch (error: any) {
      console.error('Error updating device:', error);
      toast.error(error.message || 'Failed to update device');
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const { error } = await supabase.from('devices').delete().eq('id', deviceId);

      if (error) throw error;

      toast.success('Device deleted successfully');
      refreshDevices();
    } catch (error: any) {
      console.error('Error deleting device:', error);
      toast.error(error.message || 'Failed to delete device');
    }
  };

  const openEditDialog = (device: any) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      location: device.location || '',
      device_id: device.device_id,
    });
    setIsEditOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Devices
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your IoT monitoring devices
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Add a new device to your monitoring system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Warehouse A Freezer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Building 1, Floor 2"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device_id">Device ID *</Label>
                  <Input
                    id="device_id"
                    placeholder="e.g., DEV-001"
                    value={formData.device_id}
                    onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Device</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Radio className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Devices Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your first device to start monitoring
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card
                key={device.id}
                className={`relative transition-all ${
                  device.id === activeDevice?.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {device.name}
                        {device.id === activeDevice?.id && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <MapPin className="h-3 w-3" />
                        {device.location || 'No location'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Device ID:</span>
                      <p className="font-mono font-semibold">{device.device_id}</p>
                    </div>
                    <div className="flex gap-2">
                      {device.id !== activeDevice?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setActiveDevice(device.id)}
                        >
                          Set Active
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(device)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(device.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Device</DialogTitle>
              <DialogDescription>Update device information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Device Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device_id">Device ID *</Label>
                <Input
                  id="edit-device_id"
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
