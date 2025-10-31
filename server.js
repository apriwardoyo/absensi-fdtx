app.get('/api/attendances', async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.time = { $gte: start, $lte: end };
    }

    const items = await Attendance.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
