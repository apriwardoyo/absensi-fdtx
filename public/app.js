const listEl = document.getElementById('list');
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const submitBtn = document.getElementById('submit-btn');
const dateInput = document.getElementById('date');
const searchBtn = document.getElementById('search');
const clearBtn = document.getElementById('clear');

// Render attendance list
async function loadList(filterDate) {
  listEl.innerHTML = '<li class="empty">Memuat...</li>';
  let url = '/api/attendance';
  if (filterDate) url += '?date=' + filterDate;

  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0) {
    listEl.innerHTML = '<li class="empty">Belum ada data</li>';
    return;
  }

  listEl.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    const span = document.createElement('span');
    span.className = 'time';
    span.textContent = new Date(item.date).toLocaleString();
    li.appendChild(span);
    listEl.appendChild(li);
  });
}

// Submit new attendance
submitBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  if (!name) return alert('Isi nama!');

  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  if (res.ok) {
    nameInput.value = '';
    loadList();
  } else {
    alert('Gagal input data');
  }
});

// Search by date
searchBtn.addEventListener('click', () => {
  const date = dateInput.value;
  loadList(date);
});

// Clear filter
clearBtn.addEventListener('click', () => {
  dateInput.value = '';
  loadList();
});

// Initial load
loadList();
