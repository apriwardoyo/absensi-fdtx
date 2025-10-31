const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
