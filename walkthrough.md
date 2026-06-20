# Admin Panel — Implementation Walkthrough

## Overview

A complete, premium admin dashboard has been built for the **"परिवर्तनका लागि आवाज"** community website. The admin can manage all site content — news posts, gallery photos, creative writing (stories, poems, novels) — plus moderate comments and process user submissions. All data persists via `localStorage`.

---

## Files Changed

### Modified Files

| File | Change Summary |
|------|---------------|
| [data.js](file:///d:/project/Antigravity_project_trial/js/data.js) | Added `localStorage` persistence layer, `saveAppData()`, `getFormattedDate()`, and `submissions` array |
| [main.js](file:///d:/project/Antigravity_project_trial/js/main.js) | Community submission form now captures all fields and stores them in `APP_DATA.submissions` |
| [creative.js](file:///d:/project/Antigravity_project_trial/js/creative.js) | Likes and comment submissions now call `saveAppData()` for persistent storage |
| [index.html](file:///d:/project/Antigravity_project_trial/index.html) | Added "नियन्त्रण कक्ष (Admin Panel)" link in footer |
| [news.html](file:///d:/project/Antigravity_project_trial/news.html) | Added admin panel link in footer |
| [gallery.html](file:///d:/project/Antigravity_project_trial/gallery.html) | Added admin panel link in footer |
| [creative.html](file:///d:/project/Antigravity_project_trial/creative.html) | Added admin panel link in footer |
| [contact.html](file:///d:/project/Antigravity_project_trial/contact.html) | Added admin panel link in footer |
| [about.html](file:///d:/project/Antigravity_project_trial/about.html) | Added admin panel link in footer |

### New Files

| File | Description |
|------|-------------|
| [admin.html](file:///d:/project/Antigravity_project_trial/admin.html) | Complete admin dashboard page with sidebar navigation, stat cards, manager tables, modal forms, and embedded premium CSS |
| [admin.js](file:///d:/project/Antigravity_project_trial/js/admin.js) | JavaScript controller handling auth, CRUD, Base64 uploads, comment moderation, and submission approval pipeline |

---

## Features Built

### 1. Passcode Authentication
- Login wall with glassmorphism card requiring passcode **`admin123`**
- Session persisted via `sessionStorage` (survives page reloads, clears on tab close)
- Logout button with confirmation prompt

### 2. Dashboard Overview
- **4 stat cards** showing counts of: News Posts, Gallery Photos, Creative Writings, Comments
- **Quick Action buttons** for creating news, uploading photos, adding creations, viewing submissions
- Dynamic date display in header

### 3. News Manager
- Full table listing all news articles with thumbnails, titles, categories, authors, dates, featured status
- **Search** by title/author and **filter** by category
- **Create/Edit** form modal with:
  - All fields (title, category, author, date, read time, excerpt, HTML content body)
  - Image source toggle: URL input or local file upload (Base64 encoded)
  - Live image preview
  - Featured post toggle switch
- **Delete** with confirmation dialog

### 4. Gallery Manager
- Visual card grid displaying all gallery photos with category badges and captions
- **Search** by title and **filter** by category
- **Create/Edit** modal with title, category, caption, and dual image source (URL / file upload)
- **Delete** with confirmation dialog

### 5. Creative Writing Manager
- **Tabbed interface**: Stories / Poems / Novels
- Table listing with title, author, read time, likes/comments counts
- **Create/Edit** modal with:
  - Dynamic type switcher — selecting "Novel" hides the content field and shows the **Chapter Builder**
  - **Chapter Builder**: Add/edit/delete ordered chapters with chapter numbers, titles, and content
  - Separate nested chapter form modal
- **Delete** with confirmation dialog

### 6. Comment Moderation
- Flat table aggregating **all comments** across all creative writings
- Shows commenter name, parent literature title (linked), comment text, date
- **Search** across commenter names and comment text
- **Delete** individual comments

### 7. Community Submissions Queue
- Lists all user-submitted content from the floating CTA form on the public site
- Shows submitter name, email, content type, title, date
- **Review** modal showing full submission details
- **Approve** — pre-fills the appropriate creation form (News/Gallery/Creative) with submission data, auto-removes from queue on save
- **Reject** — deletes the submission

### 8. Data Persistence Layer
- `APP_DATA` loads from `localStorage` on every page; falls back to hardcoded defaults on first visit
- Global `saveAppData()` function writes current state to `localStorage`
- All CRUD operations, likes, comments, and submissions trigger `saveAppData()`
- Changes made in admin are immediately reflected when browsing the public site

---

## How to Test

1. **Open** `index.html` in a browser (double-click the file or use a local server)
2. **Clear localStorage first** if you want a fresh start: open DevTools Console → `localStorage.clear()` → refresh
3. **Submit content** via the floating "सिर्जना पठाउनुहोस्" button on the homepage
4. **Open admin panel** by clicking "नियन्त्रण कक्ष (Admin Panel)" in the footer, or navigate directly to `admin.html`
5. **Login** with passcode: `admin123`
6. **Test CRUD**: Create a news post, upload a photo, add a poem, then verify they appear on the public site
7. **Approve a submission**: Go to Submissions tab → Review → Approve & Edit → Save
8. **Moderate comments**: Navigate to Comments tab → delete unwanted comments
9. **Toggle dark mode** via the theme button in the admin sidebar

> [!TIP]
> The admin panel fully supports **dark mode** — toggle it from the sidebar and all panels, modals, tables, and cards adapt to the dark theme seamlessly.
