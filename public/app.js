const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const list = document.getElementById('list');
const dateInput = document.getElementById('date');
const searchBtn = document.getElementById('search');

// Fungsi untuk menampilkan data absensi
async function loadAttendances(queryDate = null) {
  let url = '/api/attendances';
  if (queryDate) {
    url += `?date=${queryDate}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0) {
    list.innerHTML = '<li>Tidak ada data untuk tanggal ini</li>';
    return;
  }

  list.innerHTML = data.map(item => `
    <li>
      <strong>${item.name}</strong><br>
      <span class="time">${new Date(item.time).toLocaleString()}</span>
    </li>
  `).join('');
}

// Saat submit form absensi
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  await fetch('/api/attendances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  nameInput.value = '';
  loadAttendances();
});

// Saat klik tombol "Cari"
searchBtn.addEventListener('click', e => {
  e.preventDefault();
  const selectedDate = dateInput.value;
  if (!selectedDate) {
    alert('Pilih tanggal terlebih dahulu!');
    return;
  }
  loadAttendances(selectedDate);
});

// Load awal semua data
loadAttendances();
