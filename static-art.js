document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.simple-page');
  if (!page) return;
  const fallback = 'assets/fallbacks/no-preview-available.png';
  const direct = id => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
  const preview = id => id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w400` : fallback;
  const files = (window.VRARK_STATIC_CATALOGUE || []).slice().sort((a, b) => (Date.parse(b.createdTime || b.modifiedTime || 0) || 0) - (Date.parse(a.createdTime || a.modifiedTime || 0) || 0));
  page.innerHTML = '<p class="section-kicker">Catalogue</p><h2>Static art</h2><p id="static-status"></p><div class="notice-grid static-grid"></div>';
  document.querySelector('#static-status').textContent = files.length + ' static-art files';
  page.querySelector('.static-grid').innerHTML = files.map(item => `<section class="notice-card"><h3 class="animation-title">${item.name}</h3><div class="animation-credit">${item.category} · By ${item.contributor || 'Vrark'}</div><div class="static-frame"><img src="${preview(item.previewId)}" alt="${item.name}"></div><p class="download-links"><a download href="${direct(item.id)}">Download ${item.name}</a></p></section>`).join('');
});
