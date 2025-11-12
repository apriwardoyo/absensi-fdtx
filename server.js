const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // untuk serve index.html

// koneksi MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://fdtx:fdtx123@mongodb:27017/fdtxdb?authSource=fdtxdb';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Absensi = mongoose.model('Absensi', new mongoose.Schema({
  nama: String,
  tanggal: { type: Date, default: Date.now },
  status: String
}));

// GET semua data
app.get('/absensi', async (req, res) => {
  const docs = await Absensi.find().sort({ tanggal: -1 }).limit(500);
  res.json(docs);
});

// POST tambah data
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

// DELETE hapus 1 data berdasarkan ID
app.delete('/absensi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Absensi.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
