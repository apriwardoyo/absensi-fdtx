(() => {
  const form = document.getElementById('form');
  const nameInput = document.getElementById('name');
  const list = document.getElementById('list');
  const dateInput = document.getElementById('date');
  const searchBtn = document.getElementById('search');
  const clearBtn = document.getElementById('clear');
  const submitBtn = document.getElementById('submit-btn');

  function renderList(items) {
    if (!Array.isArray(items) || items.length === 0) {
      list.innerHTML = '<li class="empty">Tidak ada data untuk tanggal ini</li>';
      return;
    }
    list.innerHTML = items.map(item => {
      const time = item.time ? new Date(item.time).toLocaleString() : '';
      // escape name
      const name = String(item.name || '').replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]));
      return `<li><strong>${name}</strong><span class="time">${time}</span></li>`;
    }).join('');
  }

  async function loadAttendances(queryDate = null) {
    try {
      let url = '/api/attendances';
      if (queryDate) url += `?date=${encodeURIComponent(queryDate)}`;
      list.innerHTML = '<li class="empty">Memuat...</li>';
      const res = await fetch(url);
      if (!res.ok) {
        renderList([]);
        console.error('API error', res.status, await res.text());
        return;
      }
      const data = await res.json();
      renderList(data);
    } catch (err) {
      console.error('Failed to load attendances:', err);
      list.innerHTML = '<li class="empty">Gagal memuat data</li>';
    }
  }

  submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert('Masukkan nama');
      return;
    }
    submitBtn.disabled = true;
    try {
      const res = await fetch('/api/attendances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const txt = await res.text();
        alert('Gagal absen: ' + txt);
      } else {
        nameInput.value = '';
        await loadAttendances(); // refresh all
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim data');
    } finally {
      submitBtn.disabled = false;
    }
  });

  searchBtn.addEventListener('click', () => {
    const d = dateInput.value;
    if (!d) {
      alert('Pilih tanggal terlebih dahulu');
      return;
    }
    loadAttendances(d);
  });

  clearBtn.addEventListener('click', () => {
    dateInput.value = '';
    loadAttendances();
  });

  // initial load
  loadAttendances();
})();
