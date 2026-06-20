# 📢 "परिवर्तनका लागि आवाज" (Voice for Change)
## The Community Portal - Simple Explanation Guide

This guide explains how this website works, what technologies we use, and how we keep it secure, using simple everyday terms so that anyone (even without a computer science background) can understand it.

---

## 🏢 The Big Picture (How the System is Built)

To understand this project, imagine a **Public Library** that also has a private **Manager's Office**:

```
[ Visitor Browsing index.html, news.html, etc. ]
       │
       ▼ (Uses the library catalog to read books)
 ┌───────────┐         ┌────────────────────────┐
 │ Frontend  │ <─────> │ Cloud Database (Store) │
 └───────────┘         └────────────────────────┘
       ▲ (Manager uses keys to add/edit books)
       │
[ Admin Panel (admin.html) using Password ]
```

1. **The Public Portal (The Library Floor)**: This is what normal visitors see. They can read news, look at photos, read poems or stories, write comments, and submit their own writings.
2. **The Admin Panel (The Manager's Office)**: This is a restricted page (`admin.html`) where the administrator manages the library (adds new articles, approves community submissions, or deletes bad comments).
3. **The Database (The Bookshelf Storage)**: A shared storage space in the cloud (**Supabase**) where all articles, photos, and comments are stored safely so everyone sees the exact same information.

---

## 🛠️ The Tools & Technology Used

We built this website using the "building blocks" of the web, keeping it fast, clean, and modern:

| Tool | What it is | Real-world Analogy | What it does in our website |
| :--- | :--- | :--- | :--- |
| **HTML5** | HyperText Markup Language | **The Skeleton/Walls** | Defines where headers, text paragraphs, images, and buttons go on each page. |
| **CSS3** | Cascading Style Sheets | **The Paint & Interior Design** | Sets the colors, fonts, spacing, shadows, dark/light theme, and smooth animations. |
| **JavaScript** | Programming Language | **The Electricity/Wiring** | Makes the pages interactive (filters category tabs, opens the full-screen photo views, and handles button clicks). |
| **Supabase** | Cloud Database Service | **The Storage Vault** | Saves all the news posts, poems, user comments, and submissions safely on the internet. |

---

## 🔄 The Workflow (How Data Flows)

Here is a step-by-step example of what happens when someone interacts with the website:

### Example A: A Visitor Submits a Poem
1. **Writing**: A visitor clicks the feather icon (`सिर्जना पठाउनुहोस्` / Submit Creation) on the homepage and fills out the form with their poem.
2. **Sending**: JavaScript takes the text and sends it to the **Supabase Cloud Vault** where it sits in a "Pending Queue".
3. **Admin Review**: The admin logs into the Admin Panel, reviews the poem, clicks "Approve", edits any typos, and clicks "Save".
4. **Publishing**: The poem is moved from the queue to the public bookshelf. The next time anyone loads the site, they will instantly see the new poem.

---

## 🔒 Security & Authentication (How We Protect the Site)

Security is about making sure only authorized people can change the library books. We protect the site in two ways:

### 1. The Entrance Lock (Admin Passcode)
*   **What it is**: When someone tries to visit the Admin Panel (`admin.html`), they are blocked by a login screen asking for a passcode (`admin123`).
*   **How it works**: This passcode is like a simple combination lock on the door. It is handled by the browser (`sessionStorage`), meaning once they close the browser tab, the door automatically locks again.

### 2. The Cloud Vault Safe (Supabase Row Level Security)
*   **The Problem**: A smart hacker might try to bypass the login page and send commands directly to our database over the internet.
*   **The Solution (RLS)**: We configure **Row Level Security (RLS)** rules directly on our Supabase database. These rules act like a bank vault teller that double-checks every request:
    *   **Rule for Reading**: Anyone on the internet is allowed to look at the news, photos, and poems (`SELECT` permissions).
    *   **Rule for Writing**: Only someone who is authenticated with an official Admin Key is allowed to save new news posts or delete comments (`INSERT`, `UPDATE`, and `DELETE` permissions). If a hacker tries to modify data directly, the cloud vault rejects them.
