# LeadFlow CRM - PWA Setup Guide

This guide details instructions on building, deploying, and installing the Progressive Web Application (PWA) version of the LeadFlow CRM.

---

## 1. How to Build

To compile a production optimized build containing the Service Worker (`ngsw-worker.js`) and resource manifest (`manifest.webmanifest`), run:

```bash
cd frontend
npm run build
```

This compilation:
- Minimizes/compresses production bundles.
- Eliminates unused code.
- Generates `dist/frontend/browser` folder containing assets, pages, styles, and caching logic configurations.

---

## 2. Caching & Offline Support

LeadFlow CRM includes full offline capabilities configured under [ngsw-config.json](file:///c:/Coding/Spring%20Boot/project/customer-lead-crm/frontend/ngsw-config.json):
- **Static Assets:** Cached aggressively using `prefetch` mode on initialization (covers index, scripts, styles, fonts).
- **Core Images/Media:** Cached lazily to prevent slow network resource usage.
- **REST Endpoints Caching:** Configured under `dataGroups` using `freshness` strategy (checks network first with a 3s timeout limit, then falls back to cached data under `/api/leads`, `/api/dashboard`, `/api/lead-types`, etc. when offline).

---

## 3. Version Auto-Updates

The client checks for program updates every time a new session starts.
- Powered by Angular’s `SwUpdate` service.
- If a new version is built and pushed to CDN/Staging, the active app shows a popup snackbar: `"New version available. Update now? RELOAD"`. Clicking reload updates the browser's active cache.

---

## 4. How to Install

### On Android (Chrome / Edge)
1. Open the deployed CRM URL in Chrome.
2. Tap the three vertical dots (menu icon).
3. Select **"Install app"** or **"Add to Home screen"**.
4. Alternatively, tap the **"INSTALL"** button on the snackbar popup prompt that automatically displays at the bottom on initial load.

### On Windows / Desktop OS (Chrome / Edge / Opera)
1. Open the deployed CRM URL in Microsoft Edge or Google Chrome.
2. Click the **"App available - Install LeadFlow CRM"** icon on the right side of the URL navigation bar.
3. Confirm by clicking **"Install"**.
4. The CRM launches in a clean, chromeless app frame window (accessible via Start Menu / Desktop).

---

## 5. Deployment Guide

### Firebase Hosting (Free & Recommended)
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate and initialize the site in project root:
   ```bash
   firebase login
   firebase init hosting
   ```
   - **Public Directory:** `frontend/dist/frontend/browser`
   - **Configure as single-page app:** `Yes`
   - **Set up automatic builds with GitHub:** `Optional`
3. Deploy the application:
   ```bash
   firebase deploy
   ```

### Vercel / Netlify / GitHub Pages
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist/frontend/browser`
- **Redirect Rule:** Configure single-page redirects to `index.html` (e.g. `_redirects` file for Netlify containing `/* /index.html 200`).

---

## 6. Known Limitations
- **Offline Writes:** The current offline implementation supports read-only caching fallback. Creating or editing leads requires active REST connection.
- **Incognito Mode:** Service Workers are disabled in Chrome / Edge incognito tabs, which prevents offline fallback and desktop/mobile installation.
