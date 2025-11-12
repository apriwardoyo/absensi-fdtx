const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // serve public/index.html

// koneksi ke MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://fdtx:fdtx123@mongodb:27017/fdtxdb?authSource=fdtxdb';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Absensi = mongoose.model('Absensi', new mongoose.Schema({
  nama: String,
  tanggal: { type: Date, default: Date.now },
  status: String
}));

// GET /absensi -> tampilkan semua data absensi
app.get('/absensi', async (req, res) => {
  try {
    const docs = await Absensi.find().sort({ tanggal: -1 }).limit(100);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /absensi -> simpan data absensi baru
app.post('/absensi', async (req, res) => {
  try {
    const { nama, status } = req.body;
    if (!nama) return res.status(400).json({ message: 'Nama wajib diisi' });
    const doc = new Absensi({ nama, status });
    await doc.save();
    res.status(201).json({ message: 'Tersimpan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server up on port ${PORT}`));
