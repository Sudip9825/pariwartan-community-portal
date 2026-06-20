/**
 * Pariwantan Ka Lagi Aawaj - Gallery Controller
 * Implements category filtering and keyboard-accessible fullscreen lightbox slide navigation.
 */

let galleryState = {
  selectedCategory: 'All',
  activeItemsList: [], // Store currently filtered items for lightbox navigation
  lightboxActiveIndex: 0
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof APP_DATA === 'undefined') return;

  window.dbReady.then(() => {
    // Render gallery for the first time
    renderGallery();

    // Initialize category filter controls
    initGalleryFilters();

    // Initialize lightbox event listeners
    initLightbox();
  });
});

/* Category Filter Setup */
function initGalleryFilters() {
  const filtersContainer = document.getElementById('gallery-filters');
  if (!filtersContainer) return;

  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galleryState.selectedCategory = btn.getAttribute('data-category');
    renderGallery();
  });
}

/* Render Gallery Images */
function renderGallery() {
  const t = window.t || (x => x);
  const container = document.getElementById('gallery-grid-container');
  if (!container) return;

  // Filter list
  if (galleryState.selectedCategory === 'All') {
    galleryState.activeItemsList = APP_DATA.gallery;
  } else {
    galleryState.activeItemsList = APP_DATA.gallery.filter(item => item.category === galleryState.selectedCategory);
  }

  if (galleryState.activeItemsList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 4rem 0;">
        <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1.5rem; display: block; opacity: 0.5;"></i>
        ${t('gallery_empty')}
      </div>
    `;
    return;
  }

  let html = '';
  galleryState.activeItemsList.forEach((item, index) => {
    html += `
      <div class="gallery-card animate-fade-in" data-index="${index}">
        <img class="gallery-card-img" src="${item.image}" alt="${t(item.title)}" loading="lazy">
        <div class="gallery-card-overlay">
          <span class="gallery-card-cat">${t(item.category)}</span>
          <h4 class="gallery-card-title">${t(item.title)}</h4>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Listen to clicks on cards to launch Lightbox
  container.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });
}

/* Lightbox Actions */
function initLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  const closeBtn = document.getElementById('close-lightbox');
  const prevBtn = document.getElementById('prev-lightbox');
  const nextBtn = document.getElementById('next-lightbox');

  if (!lightbox || !closeBtn || !prevBtn || !nextBtn) return;

  // Close Event
  closeBtn.addEventListener('click', closeLightbox);

  // Close by clicking background overlay
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Navigate Prev
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });

  // Navigate Next
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  galleryState.lightboxActiveIndex = index;
  updateLightboxContent();

  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Stop page scrolling
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore page scrolling
}

function navigateLightbox(direction) {
  const totalItems = galleryState.activeItemsList.length;
  if (totalItems <= 1) return;

  // Cycle navigation
  galleryState.lightboxActiveIndex = (galleryState.lightboxActiveIndex + direction + totalItems) % totalItems;
  updateLightboxContent();
}

function updateLightboxContent() {
  const t = window.t || (x => x);
  const currentItem = galleryState.activeItemsList[galleryState.lightboxActiveIndex];
  if (!currentItem) return;

  const imageEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');

  if (imageEl && titleEl && descEl) {
    imageEl.src = currentItem.image;
    imageEl.alt = t(currentItem.title);
    titleEl.innerText = `${t(currentItem.title)} (${t(currentItem.category)})`;
    descEl.innerText = t(currentItem.caption);
  }
}
