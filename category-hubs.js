document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.simple-page');
  if (!page || !window.VRARK_CATEGORY_RULES) return;
  const kind = page.dataset.categoryKind;
  const rules = window.VRARK_CATEGORY_RULES[kind];
  const cataloguePage = kind === 'animation' ? 'animations.html' : 'static-art.html';
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const link = slug => `${cataloguePage}?category=${encodeURIComponent(slug)}`;
  const topLevel = Object.entries(rules).filter(([slug]) => !slug.includes('-') || slug === 'uncategorised');
  const renderChildren = (children, level = 0) => children && children.length ? `<ul class="category-sublist category-level-${level}">` + children.map(slug => `<li><a href="${link(slug)}">${esc(rules[slug].label)}</a>${renderChildren(rules[slug].children, level + 1)}</li>`).join('') + '</ul>' : '';
  page.innerHTML = `<p class="section-kicker">Catalogue</p><h1>${kind === 'animation' ? 'Animation' : 'Static art'} categories</h1><p><a href="${cataloguePage}">View all ${kind === 'animation' ? 'animations' : 'static art'}</a></p><div class="category-list">${topLevel.map(([slug, rule]) => `<section class="category-group"><h2><a href="${link(slug)}">${esc(rule.label)}</a></h2>${renderChildren(rule.children)}</section>`).join('')}</div>`;
});
