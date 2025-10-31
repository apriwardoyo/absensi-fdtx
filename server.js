const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 🟢 inisialisasi Express di sini
const app = express();

// 🟢 middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🟢 URL MongoDB — pastikan variabel nama sesuai dengan env
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/attendance_db';
const PORT = process.env.PORT || 8080;

// 🟢 load model
const Attendance = require('./models/Attendance');

// 🟢 koneksi Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 🟢 route API
app.get('/api/attendances', async (req, res) => {
  const queryDate = req.query.date;
  let filter = {};
  if (queryDate) {
    const start = new Date(queryDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    filter.time = { $gte: start, $lt: end };
  }

  const items = await Attendance.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

app.post('/api/attendances', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const item = new Attendance({ name, time: new Date() });
  await item.save();
  res.json(item);
});

app.get('/health', (req, res) => res.send('OK'));

// 🟢 mulai server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
