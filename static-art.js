document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.simple-page');
  if (!page) return;
  const fallback = 'assets/fallbacks/no-preview-available.png';
  const direct = id => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
  const preview = id => id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w400` : fallback;
  const allFiles = (window.VRARK_STATIC_CATALOGUE || []).slice().sort((a, b) => (Date.parse(b.createdTime || b.modifiedTime || 0) || 0) - (Date.parse(a.createdTime || a.modifiedTime || 0) || 0));
  const type = new URLSearchParams(location.search).get('type') || 'all';
  const labels = { all: 'Static art', sliced: 'Sliced art', animated: 'Animated statics', spells: 'Spell effects' };
  const categoryForType = { sliced: 'sliced art', animated: 'animated statics', spells: 'spell effects' };
  const category = categoryForType[type];
  const files = category ? allFiles.filter(item => String(item.category || '').toLowerCase() === category) : allFiles;
  const filterLinks = '<nav class="static-filters" aria-label="Static art categories">'
    + `<a href="static-art.html"${type === 'all' ? ' aria-current="page"' : ''}>All static art</a>`
    + ' <span aria-hidden="true">|</span> '
    + `<a href="static-art.html?type=sliced"${type === 'sliced' ? ' aria-current="page"' : ''}>Sliced art</a>`
    + ' <span aria-hidden="true">|</span> '
    + `<a href="static-art.html?type=animated"${type === 'animated' ? ' aria-current="page"' : ''}>Animated statics</a>`
    + ' <span aria-hidden="true">|</span> '
    + `<a href="static-art.html?type=spells"${type === 'spells' ? ' aria-current="page"' : ''}>Spell effects</a>`
    + '</nav>';
  page.innerHTML = '<p class="section-kicker">Catalogue</p><h2>' + (labels[type] || labels.all) + '</h2>' + filterLinks + '<p id="static-status"></p><div class="notice-grid static-grid"></div>';
  document.querySelector('#static-status').textContent = files.length + (files.length === 1 ? ' file' : ' files');
  page.querySelector('.static-grid').innerHTML = files.map(item => `<section class="notice-card"><h3 class="animation-title">${item.name}</h3><div class="animation-credit">${item.category} · By ${item.contributor || 'Vrark'}</div><div class="static-frame"><img src="${preview(item.previewId)}" alt="${item.name}"></div><p class="download-links"><a download href="${direct(item.id)}">Download ${item.name}</a></p></section>`).join('');
});
