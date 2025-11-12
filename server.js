const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===== Konfigurasi MongoDB =====
const MONGO_HOST = process.env.MONGO_HOST || 'mongodb';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB   = process.env.MONGO_DB || 'fdtxdb';
const MONGO_USER = process.env.MONGO_USER || 'fdtx';
const MONGO_PASS = process.env.MONGO_PASS || 'fdtx123';

// URI koneksi MongoDB
const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Schema & Model =====
const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Gunakan koleksi "absensi" agar sesuai permintaan
const Attendance = mongoose.model('Attendance', attendanceSchema, 'absensi');

// ===== Serve static files =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== Route utama (fix Cannot GET /) =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== API endpoint: Create attendance =====
app.post('/api/attendance', async (req, res) => {
  try {
    const { name, date } = req.body;
    const att = new Attendance({ name, date: date ? new Date(date) : new Date() });
    await att.save();
    res.status(201).json({ message: '✅ Berhasil absen' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Gagal input data' });
  }
});

// ===== API endpoint: Get attendance list =====
app.get('/api/attendance', async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    const list = await Attendance.find(query).sort({ date: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// ===== Jalankan server =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on por
