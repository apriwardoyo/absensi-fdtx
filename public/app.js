const apiBase = '/api/attendance';

// ambil referensi elemen
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const list = document.getElementById('list');
const dateInput = document.getElementById('date');
const searchBtn = document.getElementById('search');
const clearBtn = document.getElementById('clear');
const submitBtn = document.getElementById('submit-btn');

// fungsi untuk menampilkan daftar absensi
async function loadData(query = '') {
  list.innerHTML = '<li class="empty">Memuat...</li>';
  try {
    const res = await fetch(apiBase + query);
    const data = await res.json();
    if (!data.length) {
      list.innerHTML = '<li class="empty">Belum ada data absensi</li>';
      return;
    }
    list.innerHTML = data.map(item => `
      <li>
        <strong>${item.name}</strong>
        <span class="time">${new Date(item.date).toLocaleString('id-ID')}</span>
      </li>
    `).join('');
  } catch (err) {
    console.error(err);
    list.innerHTML = '<li class="empty">Gagal memuat data</li>';
  }
}

// fungsi kirim data absensi
async function submitAbsensi() {
  const name = nameInput.value.trim();
  if (!name) return alert('Nama wajib diisi!');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim...';

  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const result = await res.json();
    alert(result.message || 'Sukses');
    nameInput.value = '';
    await loadData();
  } catch (err) {
    console.error(err);
    alert('Gagal mengirim absensi');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Absen';
  }
}

// pencarian berdasarkan tanggal
searchBtn.addEventListener('click', () => {
  const date = dateInput.value;
  if (date) loadData(`?date=${date}`);
});

// tampilkan semua
clearBtn.addEventListener('click', () => {
  dateInput.value = '';
  loadData();
});

// tombol submit
submitBtn.addEventListener('click', submitAbsensi);

// load data saat pertama kali
loadData();
