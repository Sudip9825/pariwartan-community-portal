/**
 * Pariwantan Ka Lagi Aawaj - News Page Controller
 * Manages category filters, text search, and dynamic single article reading views.
 */

let newsState = {
  selectedCategory: 'All',
  searchQuery: '',
  activeArticleId: null
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof APP_DATA === 'undefined') return;

  window.dbReady.then(() => {
    // Initialize from URL query parameters
    parseQueryParams();

    // Set up categories click listeners
    initCategoryFilters();

    // Set up search bar input listener
    initInlineSearch();
  });

  // Set up back button listener
  const backBtn = document.getElementById('back-to-news-list');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      newsState.activeArticleId = null;
      updateURL();
      showListView();
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    parseQueryParams();
  });
});

/* Read parameters from URL */
function parseQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const cat = params.get('cat');

  if (id) {
    newsState.activeArticleId = parseInt(id, 10);
    showDetailView(newsState.activeArticleId);
  } else {
    newsState.activeArticleId = null;
    if (cat) {
      newsState.selectedCategory = cat;
      updateActiveCategoryTab(cat);
    } else {
      newsState.selectedCategory = 'All';
      updateActiveCategoryTab('All');
    }
    showListView();
  }
}

/* Category Filter Setup */
function initCategoryFilters() {
  const filterContainer = document.getElementById('news-category-filters');
  if (!filterContainer) return;

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Toggle active classes
    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    newsState.selectedCategory = btn.getAttribute('data-category');
    
    // Update URL if cat is selected
    if (newsState.selectedCategory === 'All') {
      updateURL();
    } else {
      updateURL({ cat: newsState.selectedCategory });
    }
    
    renderNews();
  });
}

function updateActiveCategoryTab(category) {
  const filterContainer = document.getElementById('news-category-filters');
  if (!filterContainer) return;

  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* Inline Search Setup */
function initInlineSearch() {
  const searchInput = document.getElementById('news-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    newsState.searchQuery = e.target.value.toLowerCase().trim();
    renderNews();
  });
}

/* View State Management */
function showListView() {
  document.getElementById('news-list-view').style.display = 'block';
  document.getElementById('news-detail-view').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderNews();
}

function showDetailView(articleId) {
  const t = window.t || (x => x);
  const translateDate = window.translateDate || (x => x);
  const article = APP_DATA.news.find(n => n.id === articleId);
  if (!article) {
    showListView();
    return;
  }

  // Populate Details
  document.getElementById('article-detail-category').innerText = t(article.category);
  document.getElementById('article-detail-title').innerText = t(article.title);
  document.getElementById('article-detail-author').innerText = t(article.author);
  document.getElementById('article-detail-date').innerText = translateDate(article.date);
  document.getElementById('article-detail-readtime').innerText = t(article.readTime);
  document.getElementById('article-detail-img').src = article.image;
  document.getElementById('article-detail-img').alt = t(article.title);
  document.getElementById('article-detail-body').innerHTML = t(article.content);
  document.getElementById('article-author-name').innerText = t(article.author);

  // Toggle Visibility
  document.getElementById('news-list-view').style.display = 'none';
  document.getElementById('news-detail-view').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render Related News
  renderRelatedNews(article);
}

/* Rendering Functions */
function renderNews() {
  const t = window.t || (x => x);
  const translateDate = window.translateDate || (x => x);
  const container = document.getElementById('news-grid-container');
  if (!container) return;

  let filtered = APP_DATA.news;

  // 1. Filter by category
  if (newsState.selectedCategory !== 'All') {
    filtered = filtered.filter(item => item.category === newsState.selectedCategory);
  }

  // 2. Filter by search query
  if (newsState.searchQuery) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(newsState.searchQuery) ||
      item.excerpt.toLowerCase().includes(newsState.searchQuery)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 4rem 0;">
        <i class="fas fa-search-minus" style="font-size: 3rem; margin-bottom: 1.5rem; display: block; opacity: 0.5;"></i>
        ${t('news_empty')}
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(item => {
    html += `
      <article class="card animate-slide-up">
        <div class="card-img-wrapper">
          <img class="card-img" src="${item.image}" alt="${t(item.title)}">
          <span class="card-badge">${t(item.category)}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span><i class="far fa-calendar-alt"></i> ${translateDate(item.date)}</span>
            <span><i class="far fa-clock"></i> ${t(item.readTime)}</span>
          </div>
          <a href="news.html?id=${item.id}" class="news-link-action" data-id="${item.id}">
            <h3 class="card-title">${t(item.title)}</h3>
          </a>
          <p class="card-excerpt">${t(item.excerpt)}</p>
          <div class="card-footer">
            <span class="card-author"><i class="far fa-user"></i> ${t(item.author)}</span>
            <a href="news.html?id=${item.id}" class="read-more-btn news-link-action" data-id="${item.id}">
              ${t('news_read_more')} <i class="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;

  // Add click interceptor to cards to make transition SPA-smooth
  container.querySelectorAll('.news-link-action').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(link.getAttribute('data-id'), 10);
      newsState.activeArticleId = id;
      updateURL({ id: id });
      showDetailView(id);
    });
  });
}

function renderRelatedNews(currentArticle) {
  const t = window.t || (x => x);
  const translateDate = window.translateDate || (x => x);
  const container = document.getElementById('related-news-container');
  if (!container) return;

  // Filter articles from same category, excluding current article
  let related = APP_DATA.news.filter(n => n.category === currentArticle.category && n.id !== currentArticle.id);
  
  // If not enough related articles, pad with other categories
  if (related.length < 3) {
    const fallback = APP_DATA.news.filter(n => n.id !== currentArticle.id && !related.find(r => r.id === n.id));
    related = [...related, ...fallback].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  let html = '';
  related.forEach(item => {
    html += `
      <article class="card animate-fade-in" style="font-size: 0.9rem;">
        <div class="card-img-wrapper" style="padding-top: 50%;">
          <img class="card-img" src="${item.image}" alt="${t(item.title)}">
          <span class="card-badge" style="top: 0.5rem; left: 0.5rem; font-size: 0.65rem;">${t(item.category)}</span>
        </div>
        <div class="card-body" style="padding: 1rem;">
          <h4 class="card-title" style="font-size: 1rem; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            <a href="news.html?id=${item.id}" class="related-link-action" data-id="${item.id}">${t(item.title)}</a>
          </h4>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: auto;">
            ${translateDate(item.date)}
          </div>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;

  // Intercept click on related cards
  container.querySelectorAll('.related-link-action').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(link.getAttribute('data-id'), 10);
      newsState.activeArticleId = id;
      updateURL({ id: id });
      showDetailView(id);
    });
  });
}

/* Helper to update Address Bar URL without reloading page */
function updateURL(paramsObj = {}) {
  const url = new URL(window.location.href);
  url.search = ''; // clear current params

  Object.keys(paramsObj).forEach(key => {
    url.searchParams.set(key, paramsObj[key]);
  });

  window.history.pushState({}, '', url.toString());
}
