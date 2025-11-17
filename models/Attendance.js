const Absensi = mongoose.model(
  'Absensi',
  new mongoose.Schema({
    nama: String,
    tanggal: { type: Date, default: Date.now },
    status: String
  }),
  'absensi'
);



