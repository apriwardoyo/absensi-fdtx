const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const list = document.getElementById('list');

// Ambil data absensi dari server
async function loadAttendances() {
  const res = await fetch('/api/attendances');
  const data = await res.json();
  list.innerHTML = data.map(item => `
    <li>
      <strong>${item.name}</strong><br>
      <span class="time">${new Date(item.time).toLocaleString()}</span>
    </li>
  `).join('');
}

// Saat submit form
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

// Load awal
loadAttendances();
