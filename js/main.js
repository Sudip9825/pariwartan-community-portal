/**
 * Pariwantan Ka Lagi Aawaj - Global Script
 * Manages global features: dark mode, sticky header, mobile nav, global search overlay, and submission modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark Mode)
  initTheme();

  // 2. Dynamic Injection of Global Modals & Components
  injectGlobalComponents();

  // 3. Header Scroll Behavior
  initHeaderScroll();

  // 4. Mobile Menu Toggle
  initMobileMenu();

  // 5. Submit Content Modal Event Handlers
  initSubmitModal();

  // 6. Global Search Overlay Logic
  initGlobalSearch();
});

/* Theme Management */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

/* Header Scroll Behavior */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.padding = '0.25rem 0';
      header.style.boxShadow = 'var(--shadow-lg)';
    } else {
      header.style.padding = '0';
      header.style.boxShadow = 'var(--shadow)';
    }
  });
}

/* Mobile Menu Toggle */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* Inject Global Components (Search Drawer, Submit Modal, and Floating CTA) */
function injectGlobalComponents() {
  const t = window.t || (x => x);

  // Inject FontAwesome Icons if not loaded
  if (!document.getElementById('font-awesome-css')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }

  // A. Inject Floating Submit Content CTA
  if (!document.querySelector('.floating-cta') && !window.location.pathname.includes('contact')) {
    const floatingCtaHtml = `
      <div class="floating-cta" id="floating-submit-cta" data-i18n="cta_submit_creation">
        <div class="floating-cta-pulse"></div>
        <i class="fas fa-feather-alt"></i>
        <span>${t('cta_submit_creation')}</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', floatingCtaHtml);
  }

  // B. Inject Submit Content Modal
  if (!document.getElementById('submit-content-modal')) {
    const submitModalHtml = `
      <div class="modal-overlay" id="submit-content-modal">
        <div class="modal-content">
          <div class="modal-close" id="close-submit-modal">&times;</div>
          <h3 class="modal-title" data-i18n="modal_submit_title">${t('modal_submit_title')}</h3>
          <form id="community-submit-form">
            <div class="form-group">
              <label class="form-label" data-i18n="modal_label_name">${t('modal_label_name')}</label>
              <input type="text" class="form-control" placeholder="${t('modal_placeholder_name')}" required id="sub-name" data-i18n="modal_placeholder_name">
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="modal_label_email">${t('modal_label_email')}</label>
              <input type="email" class="form-control" placeholder="${t('modal_placeholder_email')}" required id="sub-email" data-i18n="modal_placeholder_email">
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="modal_label_type">${t('modal_label_type')}</label>
              <select class="form-control" required id="sub-type">
                <option value="Poem" data-i18n="modal_type_poem">${t('modal_type_poem')}</option>
                <option value="Story" data-i18n="modal_type_story">${t('modal_type_story')}</option>
                <option value="Novel" data-i18n="modal_type_novel">${t('modal_type_novel')}</option>
                <option value="Photo" data-i18n="modal_type_photo">${t('modal_type_photo')}</option>
                <option value="News" data-i18n="modal_type_news">${t('modal_type_news')}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="modal_label_title">${t('modal_label_title')}</label>
              <input type="text" class="form-control" placeholder="${t('modal_placeholder_title')}" required id="sub-title" data-i18n="modal_placeholder_title">
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="modal_label_body">${t('modal_label_body')}</label>
              <textarea class="form-control" rows="5" placeholder="${t('modal_placeholder_body')}" required id="sub-body" data-i18n="modal_placeholder_body"></textarea>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;" data-i18n="modal_btn_submit">
              <i class="fas fa-paper-plane"></i> ${t('modal_btn_submit')}
            </button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', submitModalHtml);
  }

  // C. Inject Global Search Drawer
  if (!document.getElementById('global-search-drawer')) {
    const searchDrawerHtml = `
      <div class="search-drawer" id="global-search-drawer">
        <div class="search-container">
          <div class="search-header-group">
            <i class="fas fa-search" style="font-size: 1.75rem; color: var(--primary);"></i>
            <input type="text" class="search-input" id="global-search-input" placeholder="${t('search_placeholder')}" data-i18n="search_placeholder">
            <div class="icon-btn" id="close-search-drawer" style="background-color: var(--border);">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="search-results" id="global-search-results">
            <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
              <i class="fas fa-keyboard" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
              ${t('search_prompt')}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', searchDrawerHtml);
  }
}

/* Submit Modal Handlers */
function initSubmitModal() {
  const modal = document.getElementById('submit-content-modal');
  const closeBtn = document.getElementById('close-submit-modal');
  const form = document.getElementById('community-submit-form');
  
  // Floating CTA triggers modal (using event delegation since CTA is injected)
  document.body.addEventListener('click', (e) => {
    const cta = e.target.closest('#floating-submit-cta') || e.target.closest('.trigger-submit-modal');
    if (cta) {
      modal.classList.add('active');
    }
  });

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('sub-name').value;
      const email = document.getElementById('sub-email').value;
      const type = document.getElementById('sub-type').value;
      const title = document.getElementById('sub-title').value;
      const body = document.getElementById('sub-body').value;

      const newSubmission = {
        name: name,
        email: email,
        type: type,
        title: title,
        body: body,
        date: typeof window.getFormattedDate === 'function' ? window.getFormattedDate() : new Date().toDateString()
      };

      const handleSuccess = () => {
        const lang = localStorage.getItem('lang') || 'np';
        const msg = lang === 'en'
          ? `Thank you ${name}! Your submission for '${type}' category titled "${title}" has been successfully registered. Our editorial team will review it soon.`
          : `धन्यवाद ${name}! तपाईंको '${type}' विधा अन्तर्गतको सिर्जना "${title}" सफलतापुर्वक दर्ता भएको छ। हाम्रो सम्पादकीय टोलीले यसलाई छिट्टै समीक्षा गर्नेछ।`;

        showNotification(msg);
        form.reset();
        modal.classList.remove('active');
      };

      if (typeof window.supabaseSubmitCreation === 'function') {
        window.supabaseSubmitCreation(newSubmission).then(() => {
          handleSuccess();
        });
      } else {
        newSubmission.id = Date.now();
        if (!window.APP_DATA.submissions) {
          window.APP_DATA.submissions = [];
        }
        window.APP_DATA.submissions.push(newSubmission);
        if (typeof window.saveAppData === 'function') {
          window.saveAppData();
        }
        handleSuccess();
      }
    });
  }
}

/* Search Overlay Logic */
function initGlobalSearch() {
  const t = window.t || (x => x);
  const drawer = document.getElementById('global-search-drawer');
  const searchInput = document.getElementById('global-search-input');
  const closeBtn = document.getElementById('close-search-drawer');
  const resultsContainer = document.getElementById('global-search-results');

  // Trigger from navbar button
  document.body.addEventListener('click', (e) => {
    const searchBtn = e.target.closest('#nav-search-btn');
    if (searchBtn) {
      drawer.classList.add('active');
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 200);
    }
  });

  if (!drawer || !searchInput || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('active');
  });

  // Close on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
    }
  });

  // Live Search filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
          <i class="fas fa-keyboard" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
          ${t('search_prompt')}
        </div>
      `;
      return;
    }

    if (typeof APP_DATA === 'undefined') return;

    // Search news
    const matchingNews = APP_DATA.news.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.excerpt.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    // Search creative
    const matchingCreative = APP_DATA.creative.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.excerpt.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query)
    );

    let html = '';

    if (matchingNews.length === 0 && matchingCreative.length === 0) {
      const lang = localStorage.getItem('lang') || 'np';
      html = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
          <i class="fas fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
          ${lang === 'en' ? `No results found for "${query}".` : `"${query}" सँग सम्बन्धित कुनै नतिजा भेटिएन।`}
        </div>
      `;
    } else {
      // Render News Results
      matchingNews.forEach(item => {
        html += `
          <div class="search-result-item">
            <span class="search-result-tag">${t('nav_news')} | ${t(item.category)}</span>
            <a href="news.html?id=${item.id}" class="search-result-title">${t(item.title)}</a>
            <p style="font-size: 0.9rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${t(item.excerpt)}
            </p>
          </div>
        `;
      });

      // Render Creative Results
      matchingCreative.forEach(item => {
        // Map type tab labels
        let translatedType = t(item.type);
        if (item.type === 'Story') translatedType = t('tab_story');
        else if (item.type === 'Poem') translatedType = t('tab_poem');
        else if (item.type === 'Novel') translatedType = t('tab_novel');

        html += `
          <div class="search-result-item">
            <span class="search-result-tag">${t('nav_creative')} | ${translatedType} (${t('creative_author_prefix')} ${t(item.author)})</span>
            <a href="creative.html?id=${item.id}" class="search-result-title">${t(item.title)}</a>
            <p style="font-size: 0.9rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${t(item.excerpt)}
            </p>
          </div>
        `;
      });
    }

    resultsContainer.innerHTML = html;
  });
}

/* Custom Notification Toast */
function showNotification(message) {
  // Check if old notification exists
  let oldToast = document.querySelector('.toast-notification');
  if (oldToast) oldToast.remove();

  const toastHtml = `
    <div class="toast-notification" style="
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      background-color: var(--text);
      color: var(--bg);
      border-left: 5px solid var(--accent);
      padding: 1rem 1.5rem;
      border-radius: 6px;
      box-shadow: var(--shadow-lg);
      z-index: 500;
      max-width: 400px;
      font-size: 0.95rem;
      animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    ">
      <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
        <i class="fas fa-info-circle" style="color: var(--accent); font-size: 1.25rem; margin-top: 0.1rem;"></i>
        <div>${message}</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', toastHtml);

  // Inject styles for toast animation dynamically
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes toastIn {
        from { transform: translateY(50px) scale(0.9); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes toastOut {
        from { transform: translateY(0) scale(1); opacity: 1; }
        to { transform: translateY(50px) scale(0.9); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove toast after 6 seconds
  setTimeout(() => {
    const toast = document.querySelector('.toast-notification');
    if (toast) {
      toast.style.animation = 'toastOut 0.4s ease-in forwards';
      setTimeout(() => toast.remove(), 400);
    }
  }, 6000);
}
