# Jonathan Faith Poedjianto — Portfolio

A fully static, dependency-free portfolio site. No build step, no framework,
no server required — it's plain HTML, CSS, and vanilla JavaScript, so it
runs anywhere a browser can load a file.

## Files

```
index.html                          → the entire site
assets/css/style.css                → design system + all styling
assets/js/main.js                   → nav, scroll reveals, video fallback, cursor
assets/videos/README.txt            → what video files to add, and where
assets/videos/                      → put hero-loop.mp4, friday-loop.mp4,
                                       friday-system-loop.mp4 here when ready
assets/images/README.txt            → exact filenames + recommended size for screenshots
assets/images/                      → drop screenshots here; also fine for a favicon/OG image
```

Everything is self-contained under this one folder. Fonts load from Google
Fonts over a CDN link in `index.html` — the only external dependency.

## Before you publish

Search `index.html` for these and fill them in:
- `[ADD EMAIL ADDRESS]` in the Contact section
- `GITHUB — Coming soon` once you have a public repo to link
- `[ADD IF APPLICABLE]` for LinkedIn, if you want it listed
- The two `[CONFIRM: ...]` placeholders in the Projects section, once you've
  confirmed the exact details for Student Management System and Tic-Tac-Toe
- The screenshot placeholders throughout the FRIDAY section — each one
  states exactly what to capture and why
- Your CV: save it as `assets/CV Jofaith Internship.pdf` (exact filename). The CV links in
  the nav and the Contact section check whether that file exists — until
  it's there, they show as struck-through/disabled automatically; once
  the file is in place, they activate with no code changes needed.

None of these being empty will break the site — placeholders are styled
to look intentional, not broken — but filling them in is what makes this
a finished portfolio rather than a draft.

## Deploying

### Option 1 — GitHub Pages (recommended: free, simple, a GitHub link doubles as your "GitHub presence")

1. Create a new GitHub repository (e.g. `portfolio` or `yourname.github.io`
   — the latter gives you a URL like `https://yourname.github.io` directly).
2. Push this folder's contents to the repo root:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a live URL within a minute or two — either
   `https://<your-username>.github.io/<repo-name>/` or, if you named the
   repo `<your-username>.github.io`, just `https://<your-username>.github.io`.

### Option 2 — Vercel (fastest, good if you want custom domains later)

1. Go to vercel.com, sign in (GitHub login is easiest).
2. Click **Add New → Project**, import the same GitHub repo from Option 1
   (or drag-and-drop this folder directly if you don't want to use GitHub).
3. Framework preset: choose **Other** (this is a static site, no build
   command needed). Leave build/output settings blank.
4. Click **Deploy**. Vercel gives you a live `*.vercel.app` URL immediately,
   and lets you attach a custom domain later if you get one.

### Option 3 — Netlify (also simple, drag-and-drop friendly)

1. Go to app.netlify.com → **Add new site → Deploy manually**.
2. Drag this entire folder onto the upload area.
3. Netlify deploys it instantly and gives you a live `*.netlify.app` URL.

### Which one is easiest?

For a portfolio you're linking on a CV, **GitHub Pages** is the best fit —
it's free, permanent, and a repo named `<your-username>.github.io` gives
you a clean URL that also happens to demonstrate you have a GitHub
account, which is worth having anyway for an internship application.
If you just want something live in the next 60 seconds to preview,
**Netlify's drag-and-drop** is the fastest.

## Notes

- No Claude-specific runtime features are used anywhere in this project —
  it's ordinary HTML/CSS/JS and will run identically on any static host.
- The custom cursor and video containers degrade gracefully: on touch
  devices the cursor is disabled automatically, and any missing video
  file simply falls back to its background gradient rather than showing
  a broken-media icon.
- `prefers-reduced-motion` is respected — reveal animations and the
  custom cursor are skipped for users who've set that preference.
