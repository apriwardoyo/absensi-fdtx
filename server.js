const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // serve public/index.html

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fdtxdb';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

const Absensi = mongoose.model('Absensi', new mongoose.Schema({
  nama: String,
  tanggal: { type: Date, default: Date.now },
  status: String
}));

// GET /absensi -> return array dokumen
app.get('/absensi', async (req, res) => {
  const docs = await Absensi.find().sort({ tanggal: -1 }).limit(500);
  res.json(docs);
});

// POST /absensi -> terima { nama, status } dan simpan
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
app.listen(PORT, ()=> console.log('Server up on', PORT));
