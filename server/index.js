import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Konfigurasi Supabase dari .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Endpoint POST untuk menerima data dari ESP8266
app.post('/api/sensor', async (req, res) => {
  const { temperature, humidity, ammonia, timestamp } = req.body;
  if (temperature === undefined || humidity === undefined || ammonia === undefined) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }
  const { error } = await supabase
    .from('sensor_data')
    .insert([{ temperature, humidity, ammonia, timestamp: timestamp || new Date().toISOString() }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Endpoint GET untuk mengambil data sensor
app.get('/api/sensor', async (req, res) => {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
