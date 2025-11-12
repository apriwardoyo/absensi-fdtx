const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Ambil dari environment
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fdtxdb';

// Koneksi ke MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Contoh model absensi
const Absensi = mongoose.model('Absensi', new mongoose.Schema({
  nama: String,
  tanggal: Date,
  status: String
}));

// Endpoint untuk tambah data absensi
app.post('/absensi', async (req, res) => {
  try {
    const data = new Absensi({
      nama: req.body.nama,
      tanggal: new Date(),
      status: req.body.status
    });
    await data.save();
    res.json({ message: 'Data absensi berhasil disimpan!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk lihat data absensi
app.get('/absensi', async (req, res) => {
  const data = await Absensi.find();
  res.json(data);
});

app.listen(8080, () => console.log('🚀 Server running on port 8080'));

"dependencies": {
  "express": "^4.18.2",
  "mongoose": "^7.6.0",
  "body-parser": "^1.20.2"
}



