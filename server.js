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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db';
const PORT = process.env.PORT || 8080;

const Attendance = require('./models/Attendance');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/attendances', async (req, res) => {
  const items = await Attendance.find().sort({ createdAt: -1 });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
