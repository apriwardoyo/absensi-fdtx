const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan MONGODB_URL (OpenShift) atau fallback ke lokal
const MONGODB_URI =
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/attendance_db';

const PORT = process.env.PORT || 8080;

// Import model
const Attendance = require('./models/Attendance');

// Koneksi MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`✅ Connected to MongoDB: ${MONGODB_URI}`))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.get('/api/attendances', async (req, res) => {
  try {
    const items = await Attendance.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendances', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  try {
    const item = new Attendance({ name, time: new Date() });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Jalankan server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
