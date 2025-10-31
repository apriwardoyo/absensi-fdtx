async function fetchList(){
  const res = await fetch('/api/attendances');
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  data.forEach(i => {
    const li = document.createElement('li');
    li.textContent = `${new Date(i.time).toLocaleString()} — ${i.name}`;
    list.appendChild(li);
  });
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if(!name) return;
  await fetch('/api/attendances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  document.getElementById('name').value = '';
  fetchList();
});

fetchList();
