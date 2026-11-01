(function () {
  const endpoint = 'https://vrark-art-counter.vrark-art.workers.dev';
  let lastLookupKey = '';

  function prepareLinks() {
    document.querySelectorAll('a[download]').forEach(link => {
      if (link.dataset.countId || /shrink miniature/i.test(link.textContent)) return;

      const original = new URL(link.href, location.href);
      const id = original.searchParams.get('id');
      if (!id) return;

      link.dataset.countId = id;
      link.dataset.countName = link.textContent.trim();
      link.href = endpoint + '/download?id=' + encodeURIComponent(id) + '&name=' + encodeURIComponent(link.dataset.countName);

      const span = document.createElement('span');
      span.className = 'download-count';
      span.textContent = 'Total downloads: …';
      link.insertAdjacentElement('afterend', span);
    });
  }

  function updateDownloadCounts() {
    prepareLinks();
    const links = Array.from(document.querySelectorAll('a[data-count-id]'));
    const ids = [...new Set(links.map(link => link.dataset.countId))];
    if (!ids.length) return;

    const lookupKey = ids.slice().sort().join(',');
    if (lookupKey === lastLookupKey) return;
    lastLookupKey = lookupKey;

    const batches = [];
    for (let i = 0; i < ids.length; i += 40) batches.push(ids.slice(i, i + 40));

    const requestBatch = batchIndex => {
      if (batchIndex >= batches.length) return;
      const batch = batches[batchIndex];
      fetch(endpoint + '/api/counts?ids=' + encodeURIComponent(batch.join(',')))
        .then(response => response.json())
        .then(counts => {
          links.forEach(link => {
            if (!batch.includes(link.dataset.countId)) return;
            const target = link.nextElementSibling && link.nextElementSibling.classList.contains('download-count') ? link.nextElementSibling : null;
            if (target) target.textContent = 'Total downloads: ' + (counts[link.dataset.countId] || 0);
          });
        })
        .catch(() => {})
        .finally(() => setTimeout(() => requestBatch(batchIndex + 1), 100));
    };

    requestBatch(0);
  }

  function recordVisit() {
    const page = location.pathname.replace(/^\//, '').replace(/\.html$/, '') || 'index';
    const image = new Image();
    image.src = endpoint + '/api/visit?page=' + encodeURIComponent(page);
  }

  function addVisitLabel() {
    const nav = document.querySelector('.legacy-nav');
    if (!nav || nav.querySelector('.site-visit-count')) return;
    const label = document.createElement('div');
    label.className = 'site-visit-count';
    label.setAttribute('aria-live', 'polite');
    label.textContent = 'Page visits:\n…';
    nav.appendChild(label);
  }

  function updateVisitCount() {
    addVisitLabel();
    const label = document.querySelector('.site-visit-count');
    if (!label) return;
    fetch(endpoint + '/api/total-visits')
      .then(response => response.json())
      .then(data => { label.textContent = 'Page visits:\n' + (data.visits || 0); })
      .catch(() => {});
  }

  window.updateDownloadCounts = updateDownloadCounts;

  document.addEventListener('DOMContentLoaded', () => {
    recordVisit();
    setTimeout(updateVisitCount, 300);
    updateDownloadCounts();
    new MutationObserver(updateDownloadCounts).observe(document.body, { childList: true, subtree: true });
    let attempts = 0;
    const retry = setInterval(() => {
      updateDownloadCounts();
      if (++attempts >= 10) clearInterval(retry);
    }, 500);
  });
})();
