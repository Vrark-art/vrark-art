(function () {
  const endpoint = 'https://script.google.com/macros/s/AKfycbzw2mVxX-kpx3IhbhnOAX5HMT82KcFBPxiKaMQdTHYtk76gaTVZMA3ebfz9kBxXSEqnyw/exec';
  let lastLookupKey = '';
  function prepareLinks() {
    document.querySelectorAll('a[download]').forEach(link => {
      if (link.dataset.countId || /shrink miniature/i.test(link.textContent)) return;
      const id = new URL(link.href, location.href).searchParams.get('id');
      if (!id) return;
      link.dataset.countId = id;
      link.dataset.countName = link.textContent.trim();
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
    batches.forEach((batch, batchIndex) => {
      const callback = 'vrarkDownloadCounts_' + Date.now() + '_' + batchIndex;
      window[callback] = counts => {
        links.forEach(link => {
          if (!batch.includes(link.dataset.countId)) return;
          const target = link.nextElementSibling && link.nextElementSibling.classList.contains('download-count') ? link.nextElementSibling : null;
          if (target) target.textContent = 'Total downloads: ' + (counts[link.dataset.countId] || 0);
        });
        delete window[callback];
      };
      const script = document.createElement('script');
      script.src = endpoint + '?action=get&ids=' + encodeURIComponent(batch.join(',')) + '&callback=' + callback;
      document.head.appendChild(script);
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-count-id]');
    if (!link) return;
    const callback = 'vrarkCount_' + Date.now();
    window[callback] = result => {
      const target = link.nextElementSibling && link.nextElementSibling.classList.contains('download-count') ? link.nextElementSibling : null;
      if (target && result && typeof result.downloads !== 'undefined') {
        target.textContent = 'Total downloads: ' + result.downloads;
      }
      delete window[callback];
    };
    const script = document.createElement('script');
    script.src = endpoint + '?action=count&id=' + encodeURIComponent(link.dataset.countId) + '&name=' + encodeURIComponent(link.dataset.countName || '') + '&callback=' + callback;
    document.head.appendChild(script);
  });

  window.updateDownloadCounts = updateDownloadCounts;
  document.addEventListener('DOMContentLoaded', () => {
    updateDownloadCounts();
    new MutationObserver(updateDownloadCounts).observe(document.body, { childList: true, subtree: true });
    let attempts = 0;
    const retry = setInterval(() => {
      updateDownloadCounts();
      if (++attempts >= 10) clearInterval(retry);
    }, 500);
  });
})();
