/**
 * Pariwantan Ka Lagi Aawaj - Admin Panel Controller
 * Handles client-side authentication, dashboard tab switching, CRUD actions,
 * Base64 photo uploads, comment moderation, and pending submissions queue.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Authentication Check
  initAuth();

  // 2. Sidebar panel switching
  initSidebarNavigation();

  // 3. Theme toggling
  initThemeToggle();

  window.dbReady.then(() => {
    // 4. Load stats and setup initial lists
    initDashboard();

    // 5. Setup event handlers for CRUD forms & modals
    setupNewsCRUD();
    setupGalleryCRUD();
    setupCreativeCRUD();
    setupCommentsModeration();
    setupSubmissionsManager();
  });
});

/* ================= 1. SECURITY AUTHENTICATION ================= */
function initAuth() {
  const loginOverlay = document.getElementById('login-overlay');
  const dashboardContainer = document.getElementById('admin-dashboard-container');
  const loginForm = document.getElementById('admin-login-form');
  const passcodeField = document.getElementById('admin-passcode-field');
  const errorMsg = document.getElementById('login-error-msg');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Check sessionStorage
  const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  if (isLoggedIn) {
    loginOverlay.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    loadDashboardData();
  } else {
    loginOverlay.style.display = 'flex';
    dashboardContainer.style.display = 'none';
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredCode = passcodeField.value.trim();

      if (enteredCode === 'admin123') {
        sessionStorage.setItem('admin_logged_in', 'true');
        errorMsg.style.display = 'none';
        
        // Transition animation
        loginOverlay.style.opacity = '0';
        setTimeout(() => {
          loginOverlay.style.display = 'none';
          dashboardContainer.style.display = 'flex';
          loadDashboardData();
          // Reset opacity for future logouts
          loginOverlay.style.opacity = '1';
        }, 300);
      } else {
        errorMsg.style.display = 'block';
        passcodeField.value = '';
        passcodeField.focus();
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('तपाईं नियन्त्रण कक्षबाट बाहिर निस्कन चाहनुहुन्छ?')) {
        sessionStorage.removeItem('admin_logged_in');
        dashboardContainer.style.display = 'none';
        loginOverlay.style.display = 'flex';
        passcodeField.value = '';
        errorMsg.style.display = 'none';
      }
    });
  }
}

/* ================= 2. SIDEBAR PANEL SWITCHING ================= */
function initSidebarNavigation() {
  const links = document.querySelectorAll('.sidebar-item-link');
  const sections = document.querySelectorAll('.admin-section');
  const panelTitle = document.getElementById('header-panel-title');
  const hamburger = document.getElementById('hamburger-admin');
  const sidebar = document.getElementById('admin-sidebar-menu');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-target');
      if (!target) return; // Skip non-section actions (like logout, theme)

      e.preventDefault();

      // Toggle active states on menu items
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show/Hide sections
      sections.forEach(sec => sec.style.display = 'none');
      
      const activeSection = document.getElementById(`sec-${target}`);
      if (activeSection) {
        activeSection.style.display = 'block';
      }

      // Update Panel Header Title
      panelTitle.innerText = getPanelTitleNepali(target);

      // Trigger Section Specific renders
      loadPanelData(target);

      // Close mobile sidebar if open
      if (sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

function getPanelTitleNepali(key) {
  switch (key) {
    case 'dashboard': return 'ड्यासबोर्ड (Dashboard)';
    case 'news': return 'समाचार व्यवस्थापन (Manage News)';
    case 'gallery': return 'तस्बिर ग्यालरी व्यवस्थापन (Manage Gallery)';
    case 'creative': return 'साहित्यिक रचना व्यवस्थापन (Manage Creative)';
    case 'comments': return 'प्रतिक्रिया नियमन (Comment Moderation)';
    case 'submissions': return 'सामुदायिक सिर्जना व्यवस्थापन (Submissions Queue)';
    default: return 'नियन्त्रण कक्ष';
  }
}

function loadPanelData(panelKey) {
  window.dbReady.then(() => {
    // Sync latest APP_DATA
    if (typeof window.APP_DATA === 'undefined') return;

    switch (panelKey) {
    case 'dashboard':
      loadDashboardData();
      break;
    case 'news':
      renderNewsTable();
      break;
    case 'gallery':
      renderGalleryGrid();
      break;
    case 'creative':
      // Reset creative tabs selection to Story by default
      document.querySelectorAll('#creative-mgr-tabs .lit-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-type') === 'Story') btn.classList.add('active');
        else btn.classList.remove('active');
      });
      renderCreativeTable('', 'Story');
      break;
    case 'comments':
      renderCommentsTable();
      break;
    case 'submissions':
      renderSubmissionsTable();
      break;
    }
  });
}

/* ================= 3. THEME TOGGLING ================= */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-admin');
  if (!btn) return;

  // Sync state initially
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateAdminThemeIcon(currentTheme);

  btn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateAdminThemeIcon(newTheme);
  });
}

function updateAdminThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-admin');
  if (!btn) return;
  if (theme === 'dark') {
    btn.innerHTML = '<i class="fas fa-sun"></i> उज्यालो मोड (Light Mode)';
  } else {
    btn.innerHTML = '<i class="fas fa-moon"></i> अँध्यारो मोड (Dark Mode)';
  }
}

/* ================= 4. DASHBOARD GENERAL RENDER ================= */
function initDashboard() {
  // Render current date
  const dateEl = document.getElementById('header-display-date');
  if (dateEl) {
    const dateObj = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.innerText = dateObj.toLocaleDateString('ne-NP', options) + ` (${dateObj.toDateString()})`;
  }

  // Bind Quick Actions buttons
  document.getElementById('qa-add-news').addEventListener('click', () => {
    document.querySelector('.sidebar-item-link[data-target="news"]').click();
    document.getElementById('btn-open-create-news').click();
  });

  document.getElementById('qa-add-gallery').addEventListener('click', () => {
    document.querySelector('.sidebar-item-link[data-target="gallery"]').click();
    document.getElementById('btn-open-create-gallery').click();
  });

  document.getElementById('qa-add-creative').addEventListener('click', () => {
    document.querySelector('.sidebar-item-link[data-target="creative"]').click();
    document.getElementById('btn-open-create-creative').click();
  });

  document.getElementById('qa-view-submissions').addEventListener('click', () => {
    document.querySelector('.sidebar-item-link[data-target="submissions"]').click();
  });
}

function loadDashboardData() {
  window.dbReady.then(() => {
    if (typeof window.APP_DATA === 'undefined') return;

  const totalNews = window.APP_DATA.news.length;
  const totalGallery = window.APP_DATA.gallery.length;
  const totalCreative = window.APP_DATA.creative.length;
  
  // Count total comments across all creations
  let totalComments = 0;
  window.APP_DATA.creative.forEach(c => {
    if (c.comments) totalComments += c.comments.length;
  });

  // Pending Submissions count
  const totalSubmissions = window.APP_DATA.submissions ? window.APP_DATA.submissions.length : 0;

  // Write elements
  document.getElementById('stat-count-news').innerText = totalNews;
  document.getElementById('stat-count-gallery').innerText = totalGallery;
  document.getElementById('stat-count-creative').innerText = totalCreative;
  document.getElementById('stat-count-comments').innerText = totalComments;
  document.getElementById('qa-sub-count').innerText = totalSubmissions;

  // Manage navigation sidebar badge count
  const badge = document.getElementById('nav-badge-submissions');
  if (badge) {
    if (totalSubmissions > 0) {
      badge.innerText = totalSubmissions;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
});
}

/* ================= 5. NEWS MANAGER CRUD ================= */
function setupNewsCRUD() {
  const modal = document.getElementById('modal-news');
  const form = document.getElementById('news-form-element');
  
  const btnCreate = document.getElementById('btn-open-create-news');
  const btnCloseX = document.getElementById('btn-close-modal-news');
  const btnCancel = document.getElementById('btn-cancel-modal-news');

  const titleText = document.getElementById('news-modal-title-text');
  
  // Image input sources toggles
  const radioUrl = document.getElementById('news-img-src-url');
  const radioFile = document.getElementById('news-img-src-file');
  const urlGroup = document.getElementById('news-image-url-group');
  const fileGroup = document.getElementById('news-image-file-group');
  
  const urlIn = document.getElementById('news-image-url-in');
  const fileIn = document.getElementById('news-image-file-in');
  const imgPreview = document.getElementById('news-image-preview');
  const imgPlaceholder = document.getElementById('news-image-preview-placeholder');

  let selectedBase64Image = '';

  // Trigger forms opening
  btnCreate.addEventListener('click', () => {
    form.reset();
    document.getElementById('news-edit-id').value = '';
    titleText.innerText = 'नयाँ समाचार पोस्ट गर्नुहोस्';
    
    // Set default values
    document.getElementById('news-date-in').value = window.getFormattedDate ? window.getFormattedDate() : new Date().toDateString();
    document.getElementById('news-featured-in').checked = false;
    
    selectedBase64Image = '';
    imgPreview.style.display = 'none';
    imgPreview.src = '';
    imgPlaceholder.style.display = 'flex';
    
    radioUrl.click(); // Reset to image URL tab
    
    modal.style.display = 'flex';
  });

  // Modal closing helpers
  const closeModal = () => {
    modal.style.display = 'none';
  };
  btnCloseX.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  // Toggle image upload methods
  radioUrl.addEventListener('change', () => {
    urlGroup.style.display = 'block';
    fileGroup.style.display = 'none';
    fileIn.value = '';
    if (urlIn.value) {
      imgPreview.src = urlIn.value;
      imgPreview.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  });

  radioFile.addEventListener('change', () => {
    urlGroup.style.display = 'none';
    fileGroup.style.display = 'block';
    urlIn.value = '';
    if (selectedBase64Image) {
      imgPreview.src = selectedBase64Image;
      imgPreview.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  });

  // Sync URL to preview block
  urlIn.addEventListener('input', () => {
    if (urlIn.value.trim()) {
      imgPreview.src = urlIn.value.trim();
      imgPreview.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  });

  // Convert uploaded image to Base64
  fileIn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        selectedBase64Image = event.target.result;
        imgPreview.src = selectedBase64Image;
        imgPreview.style.display = 'block';
        imgPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle Search and Filter in Table List
  const searchInput = document.getElementById('news-mgr-search');
  const catFilter = document.getElementById('news-mgr-cat-filter');
  
  const filterNewsTable = () => {
    renderNewsTable(searchInput.value, catFilter.value);
  };
  
  searchInput.addEventListener('input', filterNewsTable);
  catFilter.addEventListener('change', filterNewsTable);

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = document.getElementById('news-edit-id').value;
    const title = document.getElementById('news-title-in').value.trim();
    const category = document.getElementById('news-cat-in').value;
    const author = document.getElementById('news-author-in').value.trim();
    const date = document.getElementById('news-date-in').value.trim();
    const readTime = document.getElementById('news-readtime-in').value.trim();
    const excerpt = document.getElementById('news-excerpt-in').value.trim();
    const content = document.getElementById('news-content-in').value.trim();
    const featured = document.getElementById('news-featured-in').checked;

    // Resolve Image Source
    let resolvedImage = '';
    if (radioUrl.checked) {
      resolvedImage = urlIn.value.trim() || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200';
    } else {
      resolvedImage = selectedBase64Image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200';
    }

    const sb = window.supabaseClient;
    if (!sb) {
      alert("Supabase client not initialized.");
      return;
    }

    const newsData = {
      title,
      category,
      author,
      date,
      read_time: readTime,
      excerpt,
      content,
      featured,
      image: resolvedImage
    };

    if (featured) {
      await sb.from('news').update({ featured: false }).neq('id', editId ? parseInt(editId, 10) : 0);
    }

    let promise;
    if (editId) {
      const targetId = parseInt(editId, 10);
      promise = sb.from('news').update(newsData).eq('id', targetId);
    } else {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      newsData.slug = slug || `news-${Date.now()}`;
      promise = sb.from('news').insert(newsData);
    }

    const { error } = await promise;
    if (error) {
      console.error("Error saving news:", error);
      alert("Failed to save news to Supabase.");
      return;
    }

    // Clean up approved submission if applicable
    if (window._approvingSubmissionId) {
      await sb.from('submissions').delete().eq('id', window._approvingSubmissionId);
      delete window._approvingSubmissionId;
    }

    await window.refreshAppData();
    closeModal();
    renderNewsTable();
    loadDashboardData();
    showAdminToast('समाचार सफलतापूर्वक सुरक्षित गरियो!');
  });
}

function renderNewsTable(searchQuery = '', filterCategory = 'All') {
  const tbody = document.getElementById('news-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  
  let list = window.APP_DATA.news;
  
  // Apply filters
  if (filterCategory !== 'All') {
    list = list.filter(n => n.category === filterCategory);
  }
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(n => n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          तपाईंको खोजी अनुसार कुनै समाचार भेटिएन।
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(post => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <img class="row-thumbnail" src="${post.image}" alt="Thumb">
      </td>
      <td>
        <span class="row-title-bold">${post.title}</span>
        <div class="row-excerpt-muted">${post.excerpt}</div>
      </td>
      <td>
        <span class="badge-status" style="background-color: var(--tag-bg); color: var(--tag-text);">${post.category}</span>
      </td>
      <td>${post.author}</td>
      <td style="font-size: 0.85rem; white-space: nowrap;">${post.date}</td>
      <td>
        ${post.featured 
          ? '<span class="badge-status active-featured"><i class="fas fa-star"></i> Featured</span>' 
          : '<span class="badge-status standard">Standard</span>'}
      </td>
      <td>
        <div class="action-btn-group">
          <button class="action-row-btn btn-edit" title="Edit" data-id="${post.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-row-btn btn-delete" title="Delete" data-id="${post.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `;

    // Bind row controls
    tr.querySelector('.btn-edit').addEventListener('click', () => editNewsPost(post.id));
    tr.querySelector('.btn-delete').addEventListener('click', () => deleteNewsPost(post.id));

    tbody.appendChild(tr);
  });
}

function editNewsPost(id) {
  const post = window.APP_DATA.news.find(n => n.id === id);
  if (!post) return;

  const modal = document.getElementById('modal-news');
  const form = document.getElementById('news-form-element');

  // Fill in form values
  document.getElementById('news-edit-id').value = post.id;
  document.getElementById('news-title-in').value = post.title;
  document.getElementById('news-cat-in').value = post.category;
  document.getElementById('news-author-in').value = post.author;
  document.getElementById('news-date-in').value = post.date;
  document.getElementById('news-readtime-in').value = post.readTime;
  document.getElementById('news-excerpt-in').value = post.excerpt;
  document.getElementById('news-content-in').value = post.content;
  document.getElementById('news-featured-in').checked = post.featured;

  // Restore image previews and values
  const radioUrl = document.getElementById('news-img-src-url');
  const radioFile = document.getElementById('news-img-src-file');
  const urlIn = document.getElementById('news-image-url-in');
  const imgPreview = document.getElementById('news-image-preview');
  const imgPlaceholder = document.getElementById('news-image-preview-placeholder');

  if (post.image && post.image.startsWith('data:image')) {
    radioFile.click();
    urlIn.value = '';
    // Store image base64
    selectedBase64Image = post.image;
    imgPreview.src = post.image;
  } else {
    radioUrl.click();
    urlIn.value = post.image;
    imgPreview.src = post.image;
  }

  imgPreview.style.display = 'block';
  imgPlaceholder.style.display = 'none';
  
  document.getElementById('news-modal-title-text').innerText = 'समाचार पोस्ट परिमार्जन गर्नुहोस्';
  modal.style.display = 'flex';
}

function deleteNewsPost(id) {
  if (confirm('तपाईं यो समाचार स्थायी रूपमा हटाउन चाहनुहुन्छ?')) {
    const sb = window.supabaseClient;
    if (!sb) return;

    sb.from('news').delete().eq('id', id).then(async ({ error }) => {
      if (error) {
        console.error("Error deleting news:", error);
        alert("Failed to delete news from Supabase.");
        return;
      }
      await window.refreshAppData();
      renderNewsTable();
      loadDashboardData();
      showAdminToast('समाचार हटाइयो!');
    });
  }
}

/* ================= 6. GALLERY MANAGER CRUD ================= */
function setupGalleryCRUD() {
  const modal = document.getElementById('modal-gallery');
  const form = document.getElementById('gallery-form-element');

  const btnCreate = document.getElementById('btn-open-create-gallery');
  const btnCloseX = document.getElementById('btn-close-modal-gallery');
  const btnCancel = document.getElementById('btn-cancel-modal-gallery');

  const titleText = document.getElementById('gallery-modal-title-text');

  const radioUrl = document.getElementById('gallery-img-src-url');
  const radioFile = document.getElementById('gallery-img-src-file');
  const urlGroup = document.getElementById('gallery-image-url-group');
  const fileGroup = document.getElementById('gallery-image-file-group');
  
  const urlIn = document.getElementById('gallery-image-url-in');
  const fileIn = document.getElementById('gallery-image-file-in');
  const imgPreview = document.getElementById('gallery-image-preview');
  const imgPlaceholder = document.getElementById('gallery-image-preview-placeholder');

  let selectedBase64Image = '';

  btnCreate.addEventListener('click', () => {
    form.reset();
    document.getElementById('gallery-edit-id').value = '';
    titleText.innerText = 'नयाँ तस्बिर थप गर्नुहोस्';
    
    selectedBase64Image = '';
    imgPreview.style.display = 'none';
    imgPreview.src = '';
    imgPlaceholder.style.display = 'flex';
    
    radioUrl.click();
    modal.style.display = 'flex';
  });

  const closeModal = () => modal.style.display = 'none';
  btnCloseX.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  // Source selections
  radioUrl.addEventListener('change', () => {
    urlGroup.style.display = 'block';
    fileGroup.style.display = 'none';
    fileIn.value = '';
    if (urlIn.value) {
      imgPreview.src = urlIn.value;
      imgPreview.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  });

  radioFile.addEventListener('change', () => {
    urlGroup.style.display = 'none';
    fileGroup.style.display = 'block';
    urlIn.value = '';
    if (selectedBase64Image) {
      imgPreview.src = selectedBase64Image;
      imgPreview.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  });

  // Sync Url
  urlIn.addEventListener('input', () => {
    if (urlIn.value.trim()) {
      imgPreview.src = urlIn.value.trim();
      imgPreview.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  });

  // Convert File
  fileIn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        selectedBase64Image = event.target.result;
        imgPreview.src = selectedBase64Image;
        imgPreview.style.display = 'block';
        imgPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Search Filter
  const searchInput = document.getElementById('gallery-mgr-search');
  const catFilter = document.getElementById('gallery-mgr-cat-filter');
  
  const filterGallery = () => {
    renderGalleryGrid(searchInput.value, catFilter.value);
  };
  searchInput.addEventListener('input', filterGallery);
  catFilter.addEventListener('change', filterGallery);

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = document.getElementById('gallery-edit-id').value;
    const title = document.getElementById('gallery-title-in').value.trim();
    const category = document.getElementById('gallery-cat-in').value;
    const caption = document.getElementById('gallery-caption-in').value.trim();

    let resolvedImage = '';
    if (radioUrl.checked) {
      resolvedImage = urlIn.value.trim() || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200';
    } else {
      resolvedImage = selectedBase64Image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200';
    }

    const sb = window.supabaseClient;
    if (!sb) {
      alert("Supabase client not initialized.");
      return;
    }

    const galleryData = {
      title,
      category,
      caption,
      image: resolvedImage
    };

    let promise;
    if (editId) {
      const targetId = parseInt(editId, 10);
      promise = sb.from('gallery').update(galleryData).eq('id', targetId);
    } else {
      promise = sb.from('gallery').insert(galleryData);
    }

    const { error } = await promise;
    if (error) {
      console.error("Error saving gallery photo:", error);
      alert("Failed to save photo to Supabase.");
      return;
    }

    if (window._approvingSubmissionId) {
      await sb.from('submissions').delete().eq('id', window._approvingSubmissionId);
      delete window._approvingSubmissionId;
    }

    await window.refreshAppData();
    closeModal();
    renderGalleryGrid();
    loadDashboardData();
    showAdminToast('तस्बिर सफलतापूर्वक सुरक्षित गरियो!');
  });
}

function renderGalleryGrid(searchQuery = '', filterCategory = 'All') {
  const container = document.getElementById('gallery-mgr-grid-container');
  if (!container) return;

  container.innerHTML = '';

  let list = window.APP_DATA.gallery;

  if (filterCategory !== 'All') {
    list = list.filter(g => g.category === filterCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(g => g.title.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 4rem 0;">
        तपाईंको खोजी अनुसार कुनै ग्यालरी तस्बिर भेटिएन।
      </div>
    `;
    return;
  }

  list.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'gallery-manager-card animate-fade-in';
    card.innerHTML = `
      <div class="gallery-manager-img-wrap">
        <img src="${photo.image}" alt="${photo.title}">
        <span class="gallery-manager-badge">${photo.category}</span>
      </div>
      <div class="gallery-manager-body">
        <div class="gallery-manager-title">${photo.title}</div>
        <p class="gallery-manager-caption">${photo.caption}</p>
      </div>
      <div class="gallery-manager-footer">
        <button class="action-row-btn btn-edit-gal" data-id="${photo.id}" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="action-row-btn btn-delete-gal" data-id="${photo.id}" style="color: #ff4a5a;" title="Delete"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    card.querySelector('.btn-edit-gal').addEventListener('click', () => editGalleryPhoto(photo.id));
    card.querySelector('.btn-delete-gal').addEventListener('click', () => deleteGalleryPhoto(photo.id));

    container.appendChild(card);
  });
}

function editGalleryPhoto(id) {
  const photo = window.APP_DATA.gallery.find(g => g.id === id);
  if (!photo) return;

  const modal = document.getElementById('modal-gallery');
  const form = document.getElementById('gallery-form-element');

  document.getElementById('gallery-edit-id').value = photo.id;
  document.getElementById('gallery-title-in').value = photo.title;
  document.getElementById('gallery-cat-in').value = photo.category;
  document.getElementById('gallery-caption-in').value = photo.caption;

  const radioUrl = document.getElementById('gallery-img-src-url');
  const radioFile = document.getElementById('gallery-img-src-file');
  const urlIn = document.getElementById('gallery-image-url-in');
  const imgPreview = document.getElementById('gallery-image-preview');
  const imgPlaceholder = document.getElementById('gallery-image-preview-placeholder');

  if (photo.image && photo.image.startsWith('data:image')) {
    radioFile.click();
    urlIn.value = '';
    selectedBase64Image = photo.image;
    imgPreview.src = photo.image;
  } else {
    radioUrl.click();
    urlIn.value = photo.image;
    imgPreview.src = photo.image;
  }

  imgPreview.style.display = 'block';
  imgPlaceholder.style.display = 'none';
  
  document.getElementById('gallery-modal-title-text').innerText = 'तस्बिर परिमार्जन गर्नुहोस्';
  modal.style.display = 'flex';
}

function deleteGalleryPhoto(id) {
  if (confirm('तपाईं यो तस्बिर स्थायी रूपमा हटाउन चाहनुहुन्छ?')) {
    const sb = window.supabaseClient;
    if (!sb) return;

    sb.from('gallery').delete().eq('id', id).then(async ({ error }) => {
      if (error) {
        console.error("Error deleting gallery photo:", error);
        alert("Failed to delete photo from Supabase.");
        return;
      }
      await window.refreshAppData();
      renderGalleryGrid();
      loadDashboardData();
      showAdminToast('तस्बिर हटाइयो!');
    });
  }
}

/* ================= 7. CREATIVE WRITING CRUD ================= */
// Maintain Novel chapters currently builder lists
let activeChaptersList = [];

function setupCreativeCRUD() {
  const modal = document.getElementById('modal-creative');
  const form = document.getElementById('creative-form-element');

  const btnCreate = document.getElementById('btn-open-create-creative');
  const btnCloseX = document.getElementById('btn-close-modal-creative');
  const btnCancel = document.getElementById('btn-cancel-modal-creative');

  const titleText = document.getElementById('creative-modal-title-text');
  const typeSelect = document.getElementById('creative-type-in');
  
  const contentGroup = document.getElementById('creative-content-group');
  const chaptersGroup = document.getElementById('creative-chapters-group');
  
  // Literature category tabs toggling
  const tabs = document.querySelectorAll('#creative-mgr-tabs .lit-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCreativeTable('', tab.getAttribute('data-type'));
    });
  });

  // Dynamic dropdown switcher
  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'Novel') {
      contentGroup.style.display = 'none';
      chaptersGroup.style.display = 'block';
      document.getElementById('creative-content-in').required = false;
    } else {
      contentGroup.style.display = 'block';
      chaptersGroup.style.display = 'none';
      document.getElementById('creative-content-in').required = true;
    }
  });

  btnCreate.addEventListener('click', () => {
    form.reset();
    document.getElementById('creative-edit-id').value = '';
    titleText.innerText = 'नयाँ साहित्यिक रचना थप गर्नुहोस्';
    
    activeChaptersList = [];
    renderChaptersBuilderList();
    
    // Trigger default Story selection
    typeSelect.value = 'Story';
    typeSelect.dispatchEvent(new Event('change'));
    
    modal.style.display = 'flex';
  });

  const closeModal = () => modal.style.display = 'none';
  btnCloseX.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  // Search input binding
  const searchInput = document.getElementById('creative-mgr-search');
  searchInput.addEventListener('input', () => {
    const activeTab = document.querySelector('#creative-mgr-tabs .lit-tab-btn.active').getAttribute('data-type');
    renderCreativeTable(searchInput.value, activeTab);
  });

  // Chapter Nesting sub-form logic
  setupChapterBuilderModal();

  // Primary form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = document.getElementById('creative-edit-id').value;
    const title = document.getElementById('creative-title-in').value.trim();
    const type = typeSelect.value;
    const author = document.getElementById('creative-author-in').value.trim();
    const readTime = document.getElementById('creative-readtime-in').value.trim();
    const excerpt = document.getElementById('creative-excerpt-in').value.trim();

    let resolvedContent = '';
    let resolvedChapters = [];

    if (type === 'Novel') {
      if (activeChaptersList.length === 0) {
        alert('उपन्यासको लागि कम्तिमा एउटा अध्याय थप्न आवश्यक छ!');
        return;
      }
      resolvedChapters = [...activeChaptersList];
    } else {
      resolvedContent = document.getElementById('creative-content-in').value.trim();
    }

    const sb = window.supabaseClient;
    if (!sb) {
      alert("Supabase client not initialized.");
      return;
    }

    const creativeData = {
      title,
      type,
      author,
      excerpt,
      read_time: readTime
    };

    if (type !== 'Novel') {
      creativeData.content = resolvedContent;
    } else {
      creativeData.content = null;
    }

    let promise;
    if (editId) {
      const targetId = parseInt(editId, 10);
      promise = sb.from('creative').update(creativeData).eq('id', targetId).select().single();
    } else {
      creativeData.likes = 0;
      promise = sb.from('creative').insert(creativeData).select().single();
    }

    const { data, error } = await promise;
    if (error) {
      console.error("Error saving creative writing:", error);
      alert("Failed to save creative writing to Supabase.");
      return;
    }

    const creativeId = data.id;

    if (type === 'Novel') {
      // First delete all existing chapters for this creativeId
      await sb.from('novel_chapters').delete().eq('creative_id', creativeId);

      // Then insert the new ones
      const chaptersToInsert = resolvedChapters.map(chap => ({
        creative_id: creativeId,
        chapter_number: chap.chapterNumber,
        title: chap.title,
        content: chap.content
      }));

      if (chaptersToInsert.length > 0) {
        const { error: chError } = await sb.from('novel_chapters').insert(chaptersToInsert);
        if (chError) {
          console.error("Error inserting chapters:", chError);
          alert("Warning: Failed to save some chapters to Supabase.");
        }
      }
    }

    if (window._approvingSubmissionId) {
      await sb.from('submissions').delete().eq('id', window._approvingSubmissionId);
      delete window._approvingSubmissionId;
    }

    await window.refreshAppData();
    closeModal();
    
    // Direct link update
    const activeTab = document.querySelector('#creative-mgr-tabs .lit-tab-btn.active').getAttribute('data-type');
    renderCreativeTable('', activeTab);
    loadDashboardData();
    showAdminToast('साहित्यिक रचना सुरक्षित गरियो!');
  });
}

function setupChapterBuilderModal() {
  const chapterModal = document.getElementById('modal-chapter');
  const chapterForm = document.getElementById('chapter-form-element');
  const btnAdd = document.getElementById('btn-add-chapter-builder');
  const btnCloseX = document.getElementById('btn-close-modal-chapter');
  const btnCancel = document.getElementById('btn-cancel-modal-chapter');
  
  const titleText = document.getElementById('chapter-modal-title-text');
  
  btnAdd.addEventListener('click', () => {
    chapterForm.reset();
    document.getElementById('chapter-edit-index').value = '';
    titleText.innerText = 'नयाँ अध्याय थप्नुहोस्';
    
    // Pre-calculate chapter number
    document.getElementById('chapter-number-in').value = activeChaptersList.length + 1;
    document.getElementById('chapter-title-in').value = `अध्याय ${activeChaptersList.length + 1}: `;
    
    chapterModal.style.display = 'flex';
  });

  const closeChapterModal = () => chapterModal.style.display = 'none';
  btnCloseX.addEventListener('close', closeChapterModal); // wait it is a div
  btnCloseX.onclick = closeChapterModal;
  btnCancel.onclick = closeChapterModal;

  chapterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const editIdxStr = document.getElementById('chapter-edit-index').value;
    const chapterNumber = parseInt(document.getElementById('chapter-number-in').value, 10);
    const title = document.getElementById('chapter-title-in').value.trim();
    const contentText = document.getElementById('chapter-content-in').value.trim();

    // Standardize text into markup style
    const paragraphs = contentText.split('\n').filter(p => p.trim() !== '');
    const contentHtml = `<div class="nepali-text">${paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n')}</div>`;

    const chapterObj = {
      chapterNumber,
      title,
      content: contentHtml,
      _rawContent: contentText // save raw text to easily prefill for edits
    };

    if (editIdxStr !== '') {
      // Edit mode
      const idx = parseInt(editIdxStr, 10);
      activeChaptersList[idx] = chapterObj;
    } else {
      // Add mode
      activeChaptersList.push(chapterObj);
    }

    // Sort chapters by sequence index number
    activeChaptersList.sort((a, b) => a.chapterNumber - b.chapterNumber);

    renderChaptersBuilderList();
    closeChapterModal();
  });
}

function renderChaptersBuilderList() {
  const container = document.getElementById('chapters-builder-list-container');
  if (!container) return;

  container.innerHTML = '';

  if (activeChaptersList.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 1rem 0; font-size: 0.85rem;">
        कुनै अध्याय थपिएको छैन। अध्याय थप्न माथिको बटन क्लिक गर्नुहोस्।
      </div>
    `;
    return;
  }

  activeChaptersList.forEach((chap, idx) => {
    const item = document.createElement('div');
    item.className = 'chapter-builder-item';
    item.innerHTML = `
      <div class="chapter-item-details">
        <span class="chapter-item-number">Chapter ${chap.chapterNumber}</span>
        <span class="chapter-item-title">${chap.title}</span>
      </div>
      <div class="action-btn-group">
        <button type="button" class="action-row-btn btn-edit-chap" data-idx="${idx}" title="Edit"><i class="fas fa-edit"></i></button>
        <button type="button" class="action-row-btn btn-delete-chap" data-idx="${idx}" style="color: #ff4a5a;" title="Delete"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    item.querySelector('.btn-edit-chap').addEventListener('click', () => editBuilderChapter(idx));
    item.querySelector('.btn-delete-chap').addEventListener('click', () => deleteBuilderChapter(idx));

    container.appendChild(item);
  });
}

function editBuilderChapter(index) {
  const chap = activeChaptersList[index];
  if (!chap) return;

  const chapterModal = document.getElementById('modal-chapter');
  
  document.getElementById('chapter-edit-index').value = index;
  document.getElementById('chapter-number-in').value = chap.chapterNumber;
  document.getElementById('chapter-title-in').value = chap.title;
  
  // Restore raw contents
  let rawText = chap._rawContent;
  if (!rawText) {
    // If raw content is not cached, strip HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chap.content;
    const pTags = tempDiv.querySelectorAll('p');
    if (pTags.length > 0) {
      rawText = Array.from(pTags).map(p => p.innerText).join('\n\n');
    } else {
      rawText = tempDiv.innerText;
    }
  }
  document.getElementById('chapter-content-in').value = rawText;
  
  document.getElementById('chapter-modal-title-text').innerText = 'अध्याय सम्पादन गर्नुहोस्';
  chapterModal.style.display = 'flex';
}

function deleteBuilderChapter(index) {
  activeChaptersList.splice(index, 1);
  renderChaptersBuilderList();
}

function renderCreativeTable(searchQuery = '', activeTab = 'Story') {
  const tbody = document.getElementById('creative-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  let list = window.APP_DATA.creative.filter(c => c.type === activeTab);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          यस विधामा हाल कुनै साहित्यिक रचना छैन।
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(item => {
    const totalComments = item.comments ? item.comments.length : 0;
    const detailsLabel = item.type === 'Novel' 
      ? `${item.chapters ? item.chapters.length : 0} Chapters` 
      : `${item.excerpt.substring(0, 45)}...`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span class="row-title-bold">${item.title}</span>
        <div class="row-excerpt-muted">${detailsLabel}</div>
      </td>
      <td>${item.author}</td>
      <td>${item.readTime}</td>
      <td>
        <span style="font-size: 0.85rem; color: var(--text-muted);">
          <i class="fas fa-heart" style="color: var(--primary);"></i> ${item.likes} Likes &nbsp;&nbsp;
          <i class="fas fa-comment"></i> ${totalComments} Comments
        </span>
      </td>
      <td>
        <div class="action-btn-group">
          <button class="action-row-btn btn-edit-creative" data-id="${item.id}" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="action-row-btn btn-delete-creative" data-id="${item.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;

    tr.querySelector('.btn-edit-creative').addEventListener('click', () => editCreativePost(item.id));
    tr.querySelector('.btn-delete-creative').addEventListener('click', () => deleteCreativePost(item.id));

    tbody.appendChild(tr);
  });
}

function editCreativePost(id) {
  const item = window.APP_DATA.creative.find(c => c.id === id);
  if (!item) return;

  const modal = document.getElementById('modal-creative');
  const form = document.getElementById('creative-form-element');
  const typeSelect = document.getElementById('creative-type-in');

  document.getElementById('creative-edit-id').value = item.id;
  document.getElementById('creative-title-in').value = item.title;
  document.getElementById('creative-author-in').value = item.author;
  document.getElementById('creative-readtime-in').value = item.readTime;
  document.getElementById('creative-excerpt-in').value = item.excerpt;

  typeSelect.value = item.type;
  typeSelect.dispatchEvent(new Event('change'));

  if (item.type === 'Novel') {
    activeChaptersList = item.chapters ? [...item.chapters] : [];
    // Populate cached raw text
    activeChaptersList.forEach((c, idx) => {
      if (!c._rawContent) {
        const div = document.createElement('div');
        div.innerHTML = c.content;
        const pList = div.querySelectorAll('p');
        c._rawContent = pList.length > 0 ? Array.from(pList).map(p => p.innerText).join('\n\n') : div.innerText;
      }
    });
    renderChaptersBuilderList();
  } else {
    document.getElementById('creative-content-in').value = item.content;
  }

  document.getElementById('creative-modal-title-text').innerText = 'साहित्यिक रचना परिमार्जन गर्नुहोस्';
  modal.style.display = 'flex';
}

function deleteCreativePost(id) {
  if (confirm('तपाईं यो साहित्यिक रचना स्थायी रूपमा हटाउन चाहनुहुन्छ?')) {
    const sb = window.supabaseClient;
    if (!sb) return;

    Promise.all([
      sb.from('novel_chapters').delete().eq('creative_id', id),
      sb.from('comments').delete().eq('creative_id', id),
      sb.from('creative').delete().eq('id', id)
    ]).then(async () => {
      await window.refreshAppData();
      const activeTab = document.querySelector('#creative-mgr-tabs .lit-tab-btn.active').getAttribute('data-type');
      renderCreativeTable('', activeTab);
      loadDashboardData();
      showAdminToast('साहित्यिक रचना हटाइयो!');
    }).catch(err => {
      console.error("Error deleting creative post:", err);
      alert("Failed to fully delete post from Supabase.");
    });
  }
}

/* ================= 8. COMMENT MODERATION ================= */
function setupCommentsModeration() {
  const searchInput = document.getElementById('comments-mgr-search');
  searchInput.addEventListener('input', () => {
    renderCommentsTable(searchInput.value);
  });
}

function renderCommentsTable(searchQuery = '') {
  const tbody = document.getElementById('comments-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Gather flat list of all comments
  const commentsList = [];
  window.APP_DATA.creative.forEach(creation => {
    if (creation.comments) {
      creation.comments.forEach((comm, idx) => {
        commentsList.push({
          id: comm.id,
          creativeId: creation.id,
          creativeTitle: creation.title,
          commentIndex: idx,
          name: comm.name,
          comment: comm.comment,
          date: comm.date
        });
      });
    }
  });

  // Apply filters
  let filtered = commentsList;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.comment.toLowerCase().includes(q) || c.creativeTitle.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          कुनै प्रतिक्रियाहरू उपलब्ध छैनन्।
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700;">${item.name}</td>
      <td>
        <a href="creative.html?id=${item.creativeId}" target="_blank" style="color: var(--primary); font-weight: 600;">
          ${item.creativeTitle}
        </a>
      </td>
      <td>${item.comment}</td>
      <td style="font-size: 0.85rem; white-space: nowrap;">${item.date}</td>
      <td>
        <button class="action-row-btn btn-delete-comment" style="color: #ff4a5a;" title="Delete Comment">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

    tr.querySelector('.btn-delete-comment').addEventListener('click', () => {
      if (confirm('तपाईं यो प्रतिक्रिया मेटाउन चाहनुहुन्छ?')) {
        const sb = window.supabaseClient;
        if (!sb) return;

        sb.from('comments').delete().eq('id', item.id).then(async ({ error }) => {
          if (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment from Supabase.");
            return;
          }
          await window.refreshAppData();
          renderCommentsTable(searchQuery);
          loadDashboardData();
          showAdminToast('प्रतिक्रिया हटाइयो!');
        });
      }
    });

    tbody.appendChild(tr);
  });
}

/* ================= 9. COMMUNITY SUBMISSIONS ================= */
let activeSubmissionSelected = null;

function setupSubmissionsManager() {
  const detailModal = document.getElementById('modal-submission-detail');
  const btnCloseX = document.getElementById('btn-close-modal-submission');
  
  const btnReject = document.getElementById('btn-sub-reject');
  const btnApprove = document.getElementById('btn-sub-approve');

  const closeDetailModal = () => {
    detailModal.style.display = 'none';
    activeSubmissionSelected = null;
  };
  
  btnCloseX.onclick = closeDetailModal;

  // REJECT Submissions
  btnReject.addEventListener('click', () => {
    if (!activeSubmissionSelected) return;
    if (confirm('तपाईं यो सामुदायिक सिर्जना अस्वीकृत गरी हटाउन चाहनुहुन्छ?')) {
      const sb = window.supabaseClient;
      if (!sb) return;

      sb.from('submissions').delete().eq('id', activeSubmissionSelected.id).then(async ({ error }) => {
        if (error) {
          console.error("Error deleting submission:", error);
          alert("Failed to reject submission.");
          return;
        }
        await window.refreshAppData();
        closeDetailModal();
        renderSubmissionsTable();
        loadDashboardData();
        showAdminToast('सामुदायिक सामग्री अस्वीकृत गरियो!');
      });
    }
  });

  // APPROVE Submissions
  btnApprove.addEventListener('click', () => {
    if (!activeSubmissionSelected) return;
    
    const sub = activeSubmissionSelected;
    
    // Close detail overlay
    closeDetailModal();
    
    // Pre-fill creation forms depending on target submission category type
    if (sub.type === 'News') {
      // Trigger news panel & form
      document.querySelector('.sidebar-item-link[data-target="news"]').click();
      document.getElementById('btn-open-create-news').click();
      
      document.getElementById('news-title-in').value = sub.title;
      document.getElementById('news-author-in').value = sub.name;
      document.getElementById('news-content-in').value = `<p>${sub.body.split('\n').filter(p => p.trim() !== '').join('</p>\n<p>')}</p>`;
      document.getElementById('news-excerpt-in').value = sub.body.substring(0, 150) + '...';
    } 
    else if (sub.type === 'Photo') {
      // Trigger gallery panel & form
      document.querySelector('.sidebar-item-link[data-target="gallery"]').click();
      document.getElementById('btn-open-create-gallery').click();
      
      document.getElementById('gallery-title-in').value = sub.title;
      document.getElementById('gallery-caption-in').value = `द्वारा बुझाइएको: ${sub.name}. ${sub.body}`;
    } 
    else {
      // Poem, Story, Novel -> Creative panel & form
      document.querySelector('.sidebar-item-link[data-target="creative"]').click();
      // Set appropriate active sub-tab
      document.querySelectorAll('#creative-mgr-tabs .lit-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-type') === sub.type) btn.click();
      });
      document.getElementById('btn-open-create-creative').click();
      
      document.getElementById('creative-title-in').value = sub.title;
      document.getElementById('creative-author-in').value = sub.name;
      document.getElementById('creative-type-in').value = sub.type;
      document.getElementById('creative-type-in').dispatchEvent(new Event('change'));
      document.getElementById('creative-excerpt-in').value = sub.body.substring(0, 150) + '...';
      
      if (sub.type === 'Novel') {
        // Init chapter list with prefilled single chapter
        activeChaptersList = [{
          chapterNumber: 1,
          title: `अध्याय १: ${sub.title}`,
          content: `<div class="nepali-text">${sub.body.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p.trim()}</p>`).join('\n')}</div>`,
          _rawContent: sub.body
        }];
        renderChaptersBuilderList();
      } else {
        document.getElementById('creative-content-in').value = sub.body;
      }
    }

    // INTERCEPT SAVE CALLBACK: We listen to form submissions so we can remove the pending submission from the queue.
    // To do this simply, we will remove this item from window.APP_DATA.submissions upon successful save of the form.
    // We register a one-shot handler or check in the save code.
    // To keep it simple: we can store the pending approved ID in window context
    window._approvingSubmissionId = sub.id;
  });
}

// Legacy hook cleaned up since approvals are now handled directly inside CRUD submits.

function renderSubmissionsTable() {
  const tbody = document.getElementById('submissions-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  const list = window.APP_DATA.submissions || [];

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          लाममा हाल कुनै सामुदायिक सामग्री उपलब्ध छैन।
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(sub => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 700;">${sub.name}</td>
      <td style="font-size: 0.85rem;">${sub.email}</td>
      <td>
        <span class="badge-status" style="background-color: var(--tag-bg); color: var(--tag-text);">${sub.type}</span>
      </td>
      <td style="font-weight: 600;">${sub.title}</td>
      <td style="font-size: 0.85rem; white-space: nowrap;">${sub.date}</td>
      <td>
        <button class="btn-create-post btn-review-sub" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" data-id="${sub.id}">
          समीक्षा (Review)
        </button>
      </td>
    `;

    tr.querySelector('.btn-review-sub').addEventListener('click', () => reviewSubmission(sub.id));

    tbody.appendChild(tr);
  });
}

function reviewSubmission(id) {
  const sub = window.APP_DATA.submissions.find(s => s.id === id);
  if (!sub) return;

  activeSubmissionSelected = sub;

  const modal = document.getElementById('modal-submission-detail');
  
  document.getElementById('sub-detail-name').innerText = sub.name;
  document.getElementById('sub-detail-email').innerText = sub.email;
  document.getElementById('sub-detail-type').innerText = sub.type;
  document.getElementById('sub-detail-date').innerText = sub.date;
  document.getElementById('sub-detail-title').innerText = sub.title;
  document.getElementById('sub-detail-body').innerText = sub.body;

  modal.style.display = 'flex';
}

/* ================= 10. SYSTEM UTILITIES ================= */
function showAdminToast(message) {
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
      z-index: 999;
      max-width: 400px;
      font-size: 0.95rem;
      animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    ">
      <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
        <i class="fas fa-check-circle" style="color: #25D366; font-size: 1.25rem; margin-top: 0.1rem;"></i>
        <div>${message}</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', toastHtml);

  setTimeout(() => {
    const toast = document.querySelector('.toast-notification');
    if (toast) {
      toast.style.animation = 'toastOut 0.4s ease-in forwards';
      setTimeout(() => toast.remove(), 400);
    }
  }, 4000);
}
