(function () {
  const endpoint = 'https://script.google.com/macros/s/AKfycbwKwAxJbxvetl3cjpGXZKPTLv-CAlxIIIuwFUZ1-E4cODkcj-6Y67KcGjy2hSjeXq6K/exec';
  const countedLabels = /^(Download \.vd|Download static item|Download gump|Download file)/i;

  function prepareLinks() {
    document.querySelectorAll('a[download]').forEach(link => {
      if (link.dataset.countId || !countedLabels.test(link.textContent.trim())) return;
      const id = new URL(link.href, location.href).searchParams.get('id');
      if (!id) return;
      link.dataset.countId = id;
      link.dataset.countName = link.textContent.trim();
      const span = document.createElement('span');
      span.className = 'download-count';
      span.textContent = ' (total downloads: …)';
      link.appendChild(span);
    });
  }

  function updateDownloadCounts() {
    prepareLinks();
    const links = Array.from(document.querySelectorAll('a[data-count-id]'));
    const ids = [...new Set(links.map(link => link.dataset.countId))];
    if (!ids.length) return;
    const callback = 'vrarkDownloadCounts_' + Date.now();
    window[callback] = counts => {
      links.forEach(link => {
        const target = link.querySelector('.download-count');
        if (target) target.textContent = ' (total downloads: ' + (counts[link.dataset.countId] || 0) + ')';
      });
      delete window[callback];
    };
    const script = document.createElement('script');
    script.src = endpoint + '?action=get&ids=' + encodeURIComponent(ids.join(',')) + '&callback=' + callback;
    document.head.appendChild(script);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-count-id]');
    if (!link) return;
    const beacon = new Image();
    beacon.src = endpoint + '?action=count&id=' + encodeURIComponent(link.dataset.countId) + '&name=' + encodeURIComponent(link.dataset.countName || '');
  });

  window.updateDownloadCounts = updateDownloadCounts;
  document.addEventListener('DOMContentLoaded', () => {
    updateDownloadCounts();
    new MutationObserver(updateDownloadCounts).observe(document.body, { childList: true, subtree: true });
  });
})();
