(function () {
  function sourceFor(img) {
    const match = img.src.match(/[?&]id=([^&]+)/);
    return match ? 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(match[1]) : img.src;
  }

  function closeModal() {
    const modal = document.querySelector('.preview-modal');
    if (modal) modal.remove();
  }

  document.addEventListener('click', event => {
    const image = event.target.closest('.animation-frame img, .static-frame img');
    if (!image) return;

    event.preventDefault();
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<button class="preview-modal-close" type="button" aria-label="Close preview">×</button><img src="' + sourceFor(image) + '" alt="' + image.alt.replace(/"/g, '&quot;') + '">';
    document.body.appendChild(modal);
    modal.querySelector('.preview-modal-close').focus();
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('preview-modal') || event.target.classList.contains('preview-modal-close')) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
})();
