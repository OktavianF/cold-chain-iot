-- Drop existing tables and recreate according to new schema
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.data_logs CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.sensor_data CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create users table with username/password authentication
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sensor_data table
CREATE TABLE public.sensor_data (
  id SERIAL PRIMARY KEY,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  ammonia FLOAT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  sensor_id INTEGER REFERENCES sensor_data(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create settings table
CREATE TABLE public.settings (
  id SERIAL PRIMARY KEY,
  temperature_critical FLOAT NOT NULL,
  temperature_warning FLOAT NOT NULL,
  ammonia_critical FLOAT NOT NULL,
  ammonia_warning FLOAT NOT NULL,
  min_humidity FLOAT NOT NULL,
  max_humidity FLOAT NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users table - only allow users to see their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR ALL USING (auth.uid()::text = id::text);

-- Sensor data - allow all authenticated users to view
CREATE POLICY "Anyone can view sensor data" ON public.sensor_data
  FOR SELECT USING (true);

-- Allow system to insert sensor data
CREATE POLICY "System can insert sensor data" ON public.sensor_data
  FOR INSERT WITH CHECK (true);

-- Alerts - allow all authenticated users to view and create
CREATE POLICY "Anyone can view alerts" ON public.alerts
  FOR SELECT USING (true);

CREATE POLICY "System can create alerts" ON public.alerts
  FOR INSERT WITH CHECK (true);

-- Settings - allow all authenticated users to view and update
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update settings" ON public.settings
  FOR ALL USING (true);

-- Insert default settings
INSERT INTO public.settings (
  temperature_critical,
  temperature_warning,
  ammonia_critical,
  ammonia_warning,
  min_humidity,
  max_humidity,
  email_notifications,
  push_notifications
) VALUES (
  8.0,
  6.0,
  25.0,
  15.0,
  45.0,
  70.0,
  true,
  true
);