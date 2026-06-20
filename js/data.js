/**
 * Pariwantan Ka Lagi Aawaj - Data Layer (Supabase Edition)
 * Fetches all data from Supabase tables on page load, reconstructs
 * the nested APP_DATA structure, and exposes async write helpers.
 *
 * All page controllers should wait for `window.dbReady` before rendering.
 */

// Hardcoded defaults used ONLY for initial seeding if tables are empty
const DEFAULT_APP_DATA = {
  news: [],
  gallery: [],
  creative: [],
  submissions: []
};

// Global state — populated asynchronously
let APP_DATA = { ...DEFAULT_APP_DATA };
window.APP_DATA = APP_DATA;

/**
 * dbReady — a Promise that resolves once all Supabase data is fetched.
 * Every page controller should use:
 *   window.dbReady.then(() => { ... render ... });
 */
window.dbReady = new Promise(async (resolve) => {
  try {
    const sb = window.supabaseClient;
    if (!sb) {
      console.error('Supabase client not initialized. Check supabase-config.js');
      resolve();
      return;
    }

    // Fetch all tables in parallel
    const [newsRes, galleryRes, creativeRes, chaptersRes, commentsRes, submissionsRes] = await Promise.all([
      sb.from('news').select('*').order('id', { ascending: false }),
      sb.from('gallery').select('*').order('id', { ascending: false }),
      sb.from('creative').select('*').order('id', { ascending: false }),
      sb.from('novel_chapters').select('*').order('chapter_number', { ascending: true }),
      sb.from('comments').select('*').order('id', { ascending: false }),
      sb.from('submissions').select('*').order('id', { ascending: false })
    ]);

    // Map news — convert snake_case DB columns to camelCase JS properties
    APP_DATA.news = (newsRes.data || []).map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || '',
      content: row.content || '',
      category: row.category,
      author: row.author || '',
      date: row.date || '',
      readTime: row.read_time || '',
      featured: row.featured || false,
      image: row.image || ''
    }));

    // Map gallery
    APP_DATA.gallery = (galleryRes.data || []).map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      image: row.image || '',
      caption: row.caption || ''
    }));

    // Map creative — attach chapters and comments
    const allChapters = chaptersRes.data || [];
    const allComments = commentsRes.data || [];

    APP_DATA.creative = (creativeRes.data || []).map(row => {
      const item = {
        id: row.id,
        title: row.title,
        type: row.type,
        author: row.author,
        excerpt: row.excerpt || '',
        readTime: row.read_time || '',
        likes: row.likes || 0,
        comments: allComments
          .filter(c => c.creative_id === row.id)
          .map(c => ({
            id: c.id,
            name: c.name,
            date: c.date,
            comment: c.comment
          }))
      };

      if (row.type === 'Novel') {
        item.chapters = allChapters
          .filter(ch => ch.creative_id === row.id)
          .map(ch => ({
            id: ch.id,
            chapterNumber: ch.chapter_number,
            title: ch.title,
            content: ch.content
          }));
      } else {
        item.content = row.content || '';
      }

      return item;
    });

    // Map submissions
    APP_DATA.submissions = (submissionsRes.data || []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      type: row.type,
      title: row.title,
      body: row.body,
      date: row.date
    }));

    // Sync global reference
    window.APP_DATA = APP_DATA;

    console.log('✅ Supabase data loaded successfully.');
  } catch (err) {
    console.error('❌ Failed to load data from Supabase:', err);
  }

  resolve();
});

// ===================== WRITE HELPERS =====================

/**
 * Refresh APP_DATA from Supabase (re-fetch everything).
 * Useful after CRUD operations to keep the in-memory state in sync.
 */
window.refreshAppData = async function () {
  const sb = window.supabaseClient;
  if (!sb) return;

  const [newsRes, galleryRes, creativeRes, chaptersRes, commentsRes, submissionsRes] = await Promise.all([
    sb.from('news').select('*').order('id', { ascending: false }),
    sb.from('gallery').select('*').order('id', { ascending: false }),
    sb.from('creative').select('*').order('id', { ascending: false }),
    sb.from('novel_chapters').select('*').order('chapter_number', { ascending: true }),
    sb.from('comments').select('*').order('id', { ascending: false }),
    sb.from('submissions').select('*').order('id', { ascending: false })
  ]);

  const allChapters = chaptersRes.data || [];
  const allComments = commentsRes.data || [];

  APP_DATA.news = (newsRes.data || []).map(row => ({
    id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt || '',
    content: row.content || '', category: row.category, author: row.author || '',
    date: row.date || '', readTime: row.read_time || '', featured: row.featured || false,
    image: row.image || ''
  }));

  APP_DATA.gallery = (galleryRes.data || []).map(row => ({
    id: row.id, title: row.title, category: row.category,
    image: row.image || '', caption: row.caption || ''
  }));

  APP_DATA.creative = (creativeRes.data || []).map(row => {
    const item = {
      id: row.id, title: row.title, type: row.type, author: row.author,
      excerpt: row.excerpt || '', readTime: row.read_time || '',
      likes: row.likes || 0,
      comments: allComments.filter(c => c.creative_id === row.id).map(c => ({
        id: c.id, name: c.name, date: c.date, comment: c.comment
      }))
    };
    if (row.type === 'Novel') {
      item.chapters = allChapters.filter(ch => ch.creative_id === row.id).map(ch => ({
        id: ch.id, chapterNumber: ch.chapter_number, title: ch.title, content: ch.content
      }));
    } else {
      item.content = row.content || '';
    }
    return item;
  });

  APP_DATA.submissions = (submissionsRes.data || []).map(row => ({
    id: row.id, name: row.name, email: row.email, type: row.type,
    title: row.title, body: row.body, date: row.date
  }));

  window.APP_DATA = APP_DATA;
};

/**
 * Like / Unlike a creative post. Increments or decrements likes in Supabase.
 */
window.supabaseLikePost = async function (postId, increment) {
  const sb = window.supabaseClient;
  if (!sb) return;
  const item = APP_DATA.creative.find(c => c.id === postId);
  if (!item) return;

  const newLikes = Math.max(0, item.likes + increment);
  await sb.from('creative').update({ likes: newLikes }).eq('id', postId);
  item.likes = newLikes;
};

/**
 * Add a comment to a creative post.
 */
window.supabaseAddComment = async function (creativeId, commentObj) {
  const sb = window.supabaseClient;
  if (!sb) return null;

  const { data, error } = await sb.from('comments').insert({
    creative_id: creativeId,
    name: commentObj.name,
    date: commentObj.date,
    comment: commentObj.comment
  }).select().single();

  if (error) {
    console.error('Comment insert error:', error);
    return null;
  }

  // Update in-memory state
  const item = APP_DATA.creative.find(c => c.id === creativeId);
  if (item) {
    item.comments.unshift({
      id: data.id,
      name: data.name,
      date: data.date,
      comment: data.comment
    });
  }
  return data;
};

/**
 * Submit a community creation (floating CTA form).
 */
window.supabaseSubmitCreation = async function (submissionObj) {
  const sb = window.supabaseClient;
  if (!sb) return null;

  const { data, error } = await sb.from('submissions').insert({
    name: submissionObj.name,
    email: submissionObj.email,
    type: submissionObj.type,
    title: submissionObj.title,
    body: submissionObj.body,
    date: submissionObj.date
  }).select().single();

  if (error) {
    console.error('Submission insert error:', error);
    return null;
  }

  // Update in-memory state
  if (!APP_DATA.submissions) APP_DATA.submissions = [];
  APP_DATA.submissions.unshift({
    id: data.id,
    name: data.name,
    email: data.email,
    type: data.type,
    title: data.title,
    body: data.body,
    date: data.date
  });

  return data;
};

// ===================== LEGACY COMPAT =====================

// Keep saveAppData as a no-op for backward compatibility
// (individual operations now write directly to Supabase)
window.saveAppData = function () {
  // No-op — data is persisted to Supabase per-operation now.
  // This stub prevents errors from old code paths that still call it.
};

// Global date formatter (unchanged)
window.getFormattedDate = function () {
  const dateObj = new Date();
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;
};
