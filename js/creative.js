/**
 * Pariwantan Ka Lagi Aawaj - Creative Corner (Sahitya) Controller
 * Handles literary tabs, reading typography adjustments, novel chapter page routing, likes, and comment submissions.
 */

let creativeState = {
  selectedTab: 'Story', // 'Story' | 'Poem' | 'Novel'
  activeLiteratureId: null,
  activeChapterIndex: 0,
  fontSize: 1.25, // in rem
  fontFamily: 'serif',
  likedStatus: {} // Tracks liked ids, e.g., { 1: true }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof APP_DATA === 'undefined') return;

  window.dbReady.then(() => {
    // Initialize view from URL query params
    parseQueryParams();

    // Initialize tabs click listener
    initTabButtons();

    // Initialize reader text size and font controls
    initReaderControls();

    // Initialize chapter navigation (for Novels)
    initChapterNavigation();

    // Initialize Like button click listener
    initLikeButton();

    // Initialize comment form submit
    initCommentForm();
  });

  // Back button event listener
  const backBtn = document.getElementById('back-to-creative-list');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      creativeState.activeLiteratureId = null;
      updateURL();
      showListView();
    });
  }

  // Popstate handles back/forward history navigation
  window.addEventListener('popstate', () => {
    parseQueryParams();
  });
});

/* Read parameters from URL */
function parseQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const chap = params.get('chap');

  if (id) {
    creativeState.activeLiteratureId = parseInt(id, 10);
    creativeState.activeChapterIndex = chap ? parseInt(chap, 10) - 1 : 0;
    showReaderView(creativeState.activeLiteratureId);
  } else {
    creativeState.activeLiteratureId = null;
    showListView();
  }
}

/* Tab Switching Setup */
function initTabButtons() {
  const tabsContainer = document.getElementById('creative-type-tabs');
  if (!tabsContainer) return;

  tabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab-btn');
    if (!tab) return;

    tabsContainer.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    creativeState.selectedTab = tab.getAttribute('data-type');
    renderList();
  });
}

function updateActiveTabButton(type) {
  const tabsContainer = document.getElementById('creative-type-tabs');
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll('.tab-btn').forEach(tab => {
    if (tab.getAttribute('data-type') === type) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

/* View State Management */
function showListView() {
  document.getElementById('creative-list-view').style.display = 'block';
  document.getElementById('creative-reader-view').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Update active tab button from current state
  updateActiveTabButton(creativeState.selectedTab);
  renderList();
}

function showReaderView(literatureId) {
  const t = window.t || (x => x);
  const translateDate = window.translateDate || (x => x);
  const item = APP_DATA.creative.find(c => c.id === literatureId);
  if (!item) {
    showListView();
    return;
  }

  // Populate reader text meta details
  document.getElementById('reader-type-badge').innerText = translateType(item.type);
  document.getElementById('reader-title').innerText = t(item.title);
  document.getElementById('reader-author').innerText = t(item.author);
  document.getElementById('reader-readtime').innerText = t(item.readTime);
  document.getElementById('reader-author-name').innerText = t(item.author);

  // Toggle Visibility
  document.getElementById('creative-list-view').style.display = 'none';
  document.getElementById('creative-reader-view').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Handle Chapter rendering and UI for Novels
  const chapterTitleEl = document.getElementById('reader-chapter-title');
  const chapterNavEl = document.getElementById('novel-chapter-nav');
  const textBodyEl = document.getElementById('reader-text-body');

  if (item.type === 'Novel') {
    chapterTitleEl.style.display = 'block';
    chapterNavEl.style.display = 'flex';
    
    // Ensure index bounds safety
    if (creativeState.activeChapterIndex < 0) creativeState.activeChapterIndex = 0;
    if (creativeState.activeChapterIndex >= item.chapters.length) {
      creativeState.activeChapterIndex = item.chapters.length - 1;
    }

    const currentChapter = item.chapters[creativeState.activeChapterIndex];
    chapterTitleEl.innerText = t(currentChapter.title);
    textBodyEl.innerHTML = t(currentChapter.content);

    // Toggle next/prev button states
    document.getElementById('prev-chapter-btn').disabled = creativeState.activeChapterIndex === 0;
    document.getElementById('next-chapter-btn').disabled = creativeState.activeChapterIndex === item.chapters.length - 1;
  } else {
    chapterTitleEl.style.display = 'none';
    chapterNavEl.style.display = 'none';
    textBodyEl.innerHTML = t(item.content);
  }

  // Apply saved sizing
  textBodyEl.style.fontSize = `${creativeState.fontSize}rem`;
  if (creativeState.fontFamily === 'serif') {
    textBodyEl.className = 'reader-content font-serif-active';
  } else {
    textBodyEl.className = 'reader-content font-sans-active';
  }

  // Render Likes count and icon
  updateLikesUI(item);

  // Render Comments list
  renderCommentsList(item);
}

/* Likes Setup */
function initLikeButton() {
  const btn = document.getElementById('like-content-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const item = APP_DATA.creative.find(c => c.id === creativeState.activeLiteratureId);
    if (!item) return;

    const itemId = item.id;
    const increment = creativeState.likedStatus[itemId] ? -1 : 1;
    if (creativeState.likedStatus[itemId]) {
      item.likes--;
      delete creativeState.likedStatus[itemId];
    } else {
      item.likes++;
      creativeState.likedStatus[itemId] = true;
    }

    updateLikesUI(item);
    
    if (typeof window.supabaseLikePost === 'function') {
      window.supabaseLikePost(itemId, increment);
    } else if (typeof window.saveAppData === 'function') {
      window.saveAppData();
    }
  });
}

function updateLikesUI(item) {
  const icon = document.getElementById('like-icon');
  const countEl = document.getElementById('likes-count');
  if (!icon || !countEl) return;

  countEl.innerText = item.likes;
  if (creativeState.likedStatus[item.id]) {
    icon.className = 'fas fa-heart';
  } else {
    icon.className = 'far fa-heart';
  }
}

/* Reader Typography Controls Setup */
function initReaderControls() {
  const textBody = document.getElementById('reader-text-body');
  
  // Font Size Inc
  document.getElementById('font-inc').addEventListener('click', () => {
    if (creativeState.fontSize < 2.0) {
      creativeState.fontSize += 0.1;
      textBody.style.fontSize = `${creativeState.fontSize}rem`;
    }
  });

  // Font Size Dec
  document.getElementById('font-dec').addEventListener('click', () => {
    if (creativeState.fontSize > 0.9) {
      creativeState.fontSize -= 0.1;
      textBody.style.fontSize = `${creativeState.fontSize}rem`;
    }
  });

  // Serif Switcher
  document.getElementById('font-serif').addEventListener('click', () => {
    creativeState.fontFamily = 'serif';
    textBody.classList.remove('font-sans-active');
    textBody.classList.add('font-serif-active');
    
    // Inject dynamic styles if not defined
    injectFontSwitchStyles();
  });

  // Sans Switcher
  document.getElementById('font-sans').addEventListener('click', () => {
    creativeState.fontFamily = 'sans';
    textBody.classList.remove('font-serif-active');
    textBody.classList.add('font-sans-active');
    
    injectFontSwitchStyles();
  });
}

function injectFontSwitchStyles() {
  if (!document.getElementById('reader-font-override-styles')) {
    const style = document.createElement('style');
    style.id = 'reader-font-override-styles';
    style.textContent = `
      .font-serif-active, .font-serif-active * {
        font-family: var(--font-serif) !important;
      }
      .font-sans-active, .font-sans-active * {
        font-family: var(--font-sans) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/* Novel Chapter Navigation Setup */
function initChapterNavigation() {
  const prevBtn = document.getElementById('prev-chapter-btn');
  const nextBtn = document.getElementById('next-chapter-btn');

  if (!prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    if (creativeState.activeChapterIndex > 0) {
      creativeState.activeChapterIndex--;
      updateURL({ id: creativeState.activeLiteratureId, chap: creativeState.activeChapterIndex + 1 });
      showReaderView(creativeState.activeLiteratureId);
      scrollToTextBody();
    }
  });

  nextBtn.addEventListener('click', () => {
    const item = APP_DATA.creative.find(c => c.id === creativeState.activeLiteratureId);
    if (!item) return;

    if (creativeState.activeChapterIndex < item.chapters.length - 1) {
      creativeState.activeChapterIndex++;
      updateURL({ id: creativeState.activeLiteratureId, chap: creativeState.activeChapterIndex + 1 });
      showReaderView(creativeState.activeLiteratureId);
      scrollToTextBody();
    }
  });
}

function scrollToTextBody() {
  const title = document.getElementById('reader-chapter-title');
  if (title) {
    title.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* Comments Logic */
function initCommentForm() {
  const form = document.getElementById('reader-comment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const item = APP_DATA.creative.find(c => c.id === creativeState.activeLiteratureId);
    if (!item) return;

    const nameInput = document.getElementById('comment-author');
    const textInput = document.getElementById('comment-text');

    const newComment = {
      name: nameInput.value.trim(),
      date: getFormattedDate(),
      comment: textInput.value.trim()
    };

    const handleSuccess = () => {
      // Re-render comments UI
      renderCommentsList(item);

      // Reset fields
      nameInput.value = '';
      textInput.value = '';

      if (typeof showNotification === 'function') {
        showNotification("प्रतिक्रिया दर्ता गरिएकोमा धन्यवाद!");
      }
    };

    if (typeof window.supabaseAddComment === 'function') {
      window.supabaseAddComment(creativeState.activeLiteratureId, newComment).then(() => {
        handleSuccess();
      });
    } else {
      // Push new comment to database mock
      item.comments.unshift(newComment); // Add to beginning of array

      // Persist modifications
      if (typeof window.saveAppData === 'function') {
        window.saveAppData();
      }
      handleSuccess();
    }
  });
}

function renderCommentsList(item) {
  const t = window.t || (x => x);
  const translateDate = window.translateDate || (x => x);
  const countEl = document.getElementById('comments-count');
  const container = document.getElementById('reader-comment-list');

  if (!countEl || !container) return;

  countEl.innerText = item.comments.length;

  if (item.comments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">
        ${t('comments_empty')}
      </div>
    `;
    return;
  }

  let html = '';
  item.comments.forEach(c => {
    html += `
      <div class="comment-item animate-fade-in">
        <div class="comment-header">
          <span class="commenter-name">${c.name}</span>
          <span class="comment-date">${translateDate(c.date)}</span>
        </div>
        <p class="comment-text">${t(c.comment)}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* Rendering Grid List */
function renderList() {
  const t = window.t || (x => x);
  const container = document.getElementById('creative-grid-container');
  if (!container) return;

  const filtered = APP_DATA.creative.filter(item => item.type === creativeState.selectedTab);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 4rem 0;">
        <i class="fas fa-feather-alt" style="font-size: 3rem; margin-bottom: 1.5rem; display: block; opacity: 0.5;"></i>
        ${t('creative_empty')}
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(item => {
    const prefix = item.type === 'Poem' ? t('creative_poet_prefix') : t('creative_author_prefix');
    html += `
      <article class="card animate-slide-up">
        <div class="card-body">
          <span class="creative-badge" style="margin-bottom: 1rem; ${item.type === 'Poem' ? 'background-color: var(--primary); color: white;' : ''}">
            ${translateType(item.type)}
          </span>
          <h3 class="creative-title" style="font-size: 1.5rem; margin-bottom: 0.75rem;">
            <a href="creative.html?id=${item.id}" class="creative-link-action" data-id="${item.id}">${t(item.title)}</a>
          </h3>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; font-weight: 600;">
            ${prefix} ${t(item.author)} | ${t(item.readTime)}
          </div>
          <p class="card-excerpt" style="font-family: var(--font-serif); font-size: 1rem; margin-bottom: 1.5rem;">
            ${t(item.excerpt)}
          </p>
          <div class="card-footer" style="padding-top: 0.75rem;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              <i class="fas fa-heart" style="color: var(--primary);"></i> ${item.likes} &nbsp;&nbsp;
              <i class="fas fa-comment"></i> ${item.comments.length}
            </span>
            <a href="creative.html?id=${item.id}" class="read-more-btn creative-link-action" data-id="${item.id}">
              ${t('creative_read_full')} <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;

  // Intercept click on links to implement SPA-smooth details view
  container.querySelectorAll('.creative-link-action').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(link.getAttribute('data-id'), 10);
      creativeState.activeLiteratureId = id;
      creativeState.activeChapterIndex = 0; // Default to chapter 1
      updateURL({ id: id });
      showReaderView(id);
    });
  });
}

/* Helpers */
function translateType(type) {
  const t = window.t || (x => x);
  if (type === 'Story') return t('tab_story');
  if (type === 'Poem') return t('tab_poem');
  if (type === 'Novel') return t('tab_novel');
  return t(type);
}

function getFormattedDate() {
  const dateObj = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

function updateURL(paramsObj = {}) {
  const url = new URL(window.location.href);
  url.search = ''; // clear current params

  Object.keys(paramsObj).forEach(key => {
    url.searchParams.set(key, paramsObj[key]);
  });

  window.history.pushState({}, '', url.toString());
}
