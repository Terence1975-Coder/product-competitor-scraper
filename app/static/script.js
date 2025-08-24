
async function beginResearch() {
  const product = document.getElementById('product').value.trim();
  const location = document.getElementById('location').value.trim();
  const company_url = document.getElementById('company_url').value.trim();
  const status = document.getElementById('status');
  const startBtn = document.getElementById('startBtn');
  const resultsEl = document.getElementById('results');

  resultsEl.innerHTML = '';
  status.textContent = 'Searching…';
  startBtn.disabled = true;
  startBtn.classList.add('opacity-70');

  try {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, location, company_url: company_url || null, max_results: 12 })
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Unknown error');

    status.textContent = `Query: ${data.query} — ${data.count} result(s)`;

    if (!data.results || data.results.length === 0) {
      resultsEl.innerHTML = '<p class="text-slate-500">No results found. Try different keywords or a broader location.</p>';
      return;
    }

    data.results.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl shadow p-4 flex flex-col gap-2';

      const title = document.createElement('a');
      title.href = item.url;
      title.target = '_blank';
      title.rel = 'noopener noreferrer';
      title.className = 'font-semibold hover:underline';
      title.textContent = item.title || item.domain;

      const domain = document.createElement('div');
      domain.className = 'text-xs text-slate-500';
      domain.textContent = item.domain;

      const overview = document.createElement('p');
      overview.className = 'text-sm text-slate-700';
      overview.textContent = item.overview || '';

      const actions = document.createElement('div');
      actions.className = 'flex items-center justify-between mt-2';

      const urlLink = document.createElement('a');
      urlLink.href = item.url;
      urlLink.target = '_blank';
      urlLink.rel = 'noopener noreferrer';
      urlLink.className = 'text-indigo-600 text-sm hover:underline';
      urlLink.textContent = 'Open site';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'rounded-lg bg-slate-100 border border-slate-300 px-3 py-1 text-sm hover:bg-slate-200';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', async () => {
        const text = `${item.url} — ${item.overview || ''}`.trim();
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
        } catch (err) {
          alert('Clipboard copy failed.');
        }
      });

      actions.appendChild(urlLink);
      actions.appendChild(copyBtn);

      card.appendChild(title);
      card.appendChild(domain);
      card.appendChild(overview);
      card.appendChild(actions);

      resultsEl.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    status.textContent = 'Error: ' + err.message;
  } finally {
    startBtn.disabled = false;
    startBtn.classList.remove('opacity-70');
  }
}

document.getElementById('startBtn').addEventListener('click', beginResearch);
