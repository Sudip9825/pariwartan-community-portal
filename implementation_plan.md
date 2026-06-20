# Implementation Plan - Fully Functional Language Translator Toggle

We will implement a premium, completely functional language translation system allowing users to toggle the website between **Nepali** and **English** with a single click. The language preference will be persisted in `localStorage` and will dynamically translate both static page elements and dynamically rendered database content immediately, without requiring a page reload.

## User Review Required

> [!IMPORTANT]
> **Minimalist Navigation Action Toggle**: The toggle button will be placed in the `.nav-actions` container of the header. For maximum aesthetic coherence, we will implement it as a circular `.icon-btn` containing bold text (`EN` when site is in Nepali, `ने` when in English). This informs the user of the language they will switch to upon clicking, matching the style of the search and theme buttons.
>
> **Dynamic Injection**: To keep the header markup clean and simplify future maintenance, the language toggle button itself will be dynamically injected via JavaScript into `.nav-actions` on page load.

> [!TIP]
> **Dynamic Article Translation**: To ensure full translation of news and creative articles without mutating the `localStorage`-based database schema (which would break the admin panel's CRUD operations), we will map the default article titles, excerpts, read times, and categories in a translation dictionary inside `js/translator.js`. A global `t(text)` helper function will perform the translations dynamically during frontend rendering.

---

## Proposed Changes

We will create a global translation controller, add localized hooks `data-i18n` to static HTML tags, and update dynamic page scripts to translate content on the fly.

### 1. Translation Engine

#### [NEW] [js/translator.js](file:///d:/project/Antigravity_project_trial/js/translator.js)
- Maintain a static translation dictionary mapping:
  - Static translation keys (e.g. `nav_home` -> `गृहपृष्ठ` / `Home`).
  - Dynamic content titles, excerpts, and authors from `DEFAULT_APP_DATA`.
- Expose global translation helpers:
  - `t(text)`: Translate dynamic text between English and Nepali based on the active language.
  - `translateDate(dateStr)`: Dynamically translate month names and convert numerals between standard Arabic digits (0-9) and Nepali numerals (०-९).
  - `applyTranslations()`: Iterate through all DOM elements with `data-i18n` attributes, translate their text or placeholders, preserve child icons, and update the toggle button label.
- Initialize the system on `DOMContentLoaded` by injecting the toggle button and applying initial translations.
- Trigger dynamic page re-renders immediately when the user switches languages.

---

### 2. Main Site Interactions & Modals

#### [MODIFY] [js/main.js](file:///d:/project/Antigravity_project_trial/js/main.js)
- Add `data-i18n` attributes to the HTML templates of:
  - Dynamically injected floating CTA (`सिर्जना पठाउनुहोस्` / `Submit Creation`).
  - Dynamically injected submit content modal (labels, options, placeholders, buttons).
  - Dynamically injected search drawer.
- Modify the live search live filter to match queries in a translation-friendly way.

---

### 3. Dynamic Page Controllers

Modify JS rendering templates to use `t()` and `translateDate()`.

#### [MODIFY] [js/news.js](file:///d:/project/Antigravity_project_trial/js/news.js)
- Update card-rendering templates to wrap titles, excerpts, categories, read times, and button text (e.g., `t("थप पढ्नुहोस्")`) in the translation helper.
- Wrap card and article details dates in `translateDate()`.
- Add dictionary keys for news page categories.

#### [MODIFY] [js/gallery.js](file:///d:/project/Antigravity_project_trial/js/gallery.js)
- Translate gallery card overlays (categories, titles) and fullscreen lightbox metadata (title, category, caption) using `t()`.
- Translate empty category state messages.

#### [MODIFY] [js/creative.js](file:///d:/project/Antigravity_project_trial/js/creative.js)
- Translate cards, literature metadata, and reader contents.
- Translate comment author names, dates (`translateDate`), and text.
- Add translation wrappers to form labels, textareas, and alerts.

---

### 4. Static HTML Layouts

Include `js/translator.js` and annotate static text with `data-i18n` attributes.

#### [MODIFY] [index.html](file:///d:/project/Antigravity_project_trial/index.html)
- Load `js/translator.js` in `<script>` tags.
- Tag header logo, navigation menus, footer headers, and body titles with appropriate `data-i18n` keys.
- Update inline rendering calls (`renderHero`, etc.) to work correctly with translator updates.

#### [MODIFY] [news.html](file:///d:/project/Antigravity_project_trial/news.html)
- Add translator script tag.
- Annotate headers, category filter buttons, input placeholders, and search bars with `data-i18n`.

#### [MODIFY] [gallery.html](file:///d:/project/Antigravity_project_trial/gallery.html)
- Add translator script tag.
- Annotate header, filter tabs, and lightbox navigation controls.

#### [MODIFY] [creative.html](file:///d:/project/Antigravity_project_trial/creative.html)
- Add translator script tag.
- Annotate tabs, reader configuration panels, back buttons, and comment section inputs.

#### [MODIFY] [about.html](file:///d:/project/Antigravity_project_trial/about.html)
- Add translator script tag.
- Annotate main mission text, statistics labels, and team member details.

#### [MODIFY] [contact.html](file:///d:/project/Antigravity_project_trial/contact.html)
- Add translator script tag.
- Annotate panel titles, office descriptions, inputs, placeholders, and buttons.

---

## Verification Plan

### Manual Verification
1. **Toggle Interactivity**: Load `index.html` and click the language toggle button. Verify that the static headers and footer, as well as the dynamic cards, translate immediately.
2. **Persistence**: Change language to English, reload the page, and verify it stays in English.
3. **News Detail View**: Click on a news card. Verify the single article view shows titles and contents in the correct language.
4. **Gallery Filtering**: Navigate to `gallery.html`, select different categories, and open the fullscreen lightbox. Verify captions and labels are translated correctly.
5. **Creative Corner Comments**: Open a story in `creative.html`, submit a comment, and verify that the comment metadata dates translate properly.
6. **Submissions Modals**: Trigger the floating CTA from any page. Verify the submission form labels and placeholders switch languages.
