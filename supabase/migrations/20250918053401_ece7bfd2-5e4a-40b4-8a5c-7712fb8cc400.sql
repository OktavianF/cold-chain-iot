-- Create new tables according to your schema
CREATE TABLE public.users_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.sensor_data_new (
  id SERIAL PRIMARY KEY,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  ammonia FLOAT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.alerts_new (
  id SERIAL PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  sensor_id INTEGER REFERENCES sensor_data_new(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.settings (
  id SERIAL PRIMARY KEY,
  temperature_critical FLOAT NOT NULL DEFAULT 8.0,
  temperature_warning FLOAT NOT NULL DEFAULT 6.0,
  ammonia_critical FLOAT NOT NULL DEFAULT 25.0,
  ammonia_warning FLOAT NOT NULL DEFAULT 15.0,
  min_humidity FLOAT NOT NULL DEFAULT 45.0,
  max_humidity FLOAT NOT NULL DEFAULT 70.0,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Public access" ON public.users_new FOR ALL USING (true);
CREATE POLICY "Public access" ON public.sensor_data_new FOR ALL USING (true);
CREATE POLICY "Public access" ON public.alerts_new FOR ALL USING (true);
CREATE POLICY "Public access" ON public.settings FOR ALL USING (true);

-- Insert default settings
INSERT INTO public.settings (
  temperature_critical,
  temperature_warning,
  ammonia_critical,
  ammonia_warning,
  min_humidity,
  max_humidity
) VALUES (8.0, 6.0, 25.0, 15.0, 45.0, 70.0);