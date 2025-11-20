-- Enable RLS on existing sensor_data table
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for sensor_data (public read access for monitoring)
CREATE POLICY "Anyone can view sensor data" ON public.sensor_data
FOR SELECT USING (true);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'operator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Create alerts table for storing alert history
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id BIGINT REFERENCES public.sensor_data(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('temperature', 'humidity', 'ammonia', 'system')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  value DOUBLE PRECISION,
  threshold DOUBLE PRECISION,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES public.profiles(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for alerts
CREATE POLICY "Anyone can view alerts" ON public.alerts
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create alerts" ON public.alerts
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts" ON public.alerts
FOR UPDATE TO authenticated USING (true);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('alert', 'info', 'warning', 'system')),
  read BOOLEAN DEFAULT false,
  alert_id UUID REFERENCES public.alerts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create notifications" ON public.notifications
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Create user settings table
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  temperature_threshold_warning DOUBLE PRECISION DEFAULT 6.0,
  temperature_threshold_critical DOUBLE PRECISION DEFAULT 8.0,
  humidity_threshold_min DOUBLE PRECISION DEFAULT 45.0,
  humidity_threshold_max DOUBLE PRECISION DEFAULT 70.0,
  ammonia_threshold_warning DOUBLE PRECISION DEFAULT 15.0,
  ammonia_threshold_critical DOUBLE PRECISION DEFAULT 25.0,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  alert_frequency INTEGER DEFAULT 5, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
FOR ALL USING (auth.uid() = user_id);

-- Create data_logs table for audit trail
CREATE TABLE public.data_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_data_id BIGINT REFERENCES public.sensor_data(id),
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete', 'alert_generated')),
  user_id UUID REFERENCES public.profiles(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on data_logs
ALTER TABLE public.data_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for data_logs
CREATE POLICY "Anyone can view data logs" ON public.data_logs
FOR SELECT USING (true);

CREATE POLICY "System can insert data logs" ON public.data_logs
FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user handling
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_sensor_data_timestamp ON public.sensor_data(timestamp DESC);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_data_logs_created_at ON public.data_logs(created_at DESC);