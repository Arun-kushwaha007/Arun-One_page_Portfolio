<!-- // ...existing code... -->
# Arun-One_page_Portfolio

A single-page portfolio site built with React + Vite showcasing projects, skills, experience, and contact information.

## Overview

This repository contains a front-end React application (Vite) that renders a responsive portfolio site with animated UI, a starfield background, project lightboxes, and accessible layout.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide icons
- (optional) three.js / @react-three/fiber + @react-three/drei for advanced visuals

## Project Structure

Frontend/
- index.html
- vite.config.js
- package.json
- public/ (static assets such as images)
- src/
  - main.jsx         — app entry
  - App.jsx          — main Portfolio component
  - components/
    - Stars.jsx      — starfield / background component
  - assets/          — imported images used by the site
  - index.css        — Tailwind imports and global styles

## Getting started (local development)

Prerequisites:
- Node.js (v16+ recommended)
- npm (or yarn / pnpm)

Steps:

1. Open a terminal and change to the Frontend folder:
```sh
cd Frontend
```

2. Install dependencies:
```sh
npm install
# or
# pnpm install
# yarn
```

3. Start the dev server:
```sh
npm run dev
```
- Vite serves the app (default: http://localhost:5173).

4. Build for production:
```sh
npm run build
```

5. Preview the production build locally:
```sh
npm run preview
```

## Helpful commands

- Start dev server: npm run dev
- Build production: npm run build
- Preview build: npm run preview
- Lint (if configured): npm run lint

## Notes & Tips

- Static assets are located under Frontend/public and Frontend/src/assets. Use the public folder for files served at root (e.g., /assets/arunsk.jpg).
- If you encounter "ENOSPC: System limit for number of file watchers reached" when running Vite on Linux, increase inotify watchers or exclude folders in your editor:
  - Temporary increase: sudo sysctl -w fs.inotify.max_user_watches=524288
  - Persist: echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/99-inotify.conf && sudo sysctl --system
  - Or exclude large folders (node_modules, .git, assets) in VS Code's files.watcherExclude.
- Tailwind is configured via the project's CSS and Vite plugin (see vite.config.js). Make sure PostCSS/Tailwind setup is intact if styles don't load.
- App entry point: src/main.jsx mounts App.jsx (the Portfolio component).

## Deployment

Build the project (npm run build) and deploy the contents of the `dist` directory to any static host (Vercel, Netlify, GitHub Pages, or an Azure Static Web App). For Azure deployments, follow Azure Static Web Apps best practices and CI/CD steps (configure build command and output directory to `dist`).

## Credits

Built by Arun Kushwaha.

