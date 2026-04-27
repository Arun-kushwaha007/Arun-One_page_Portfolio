# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-04-27

Initial stable release of the Arun One Page Portfolio.

### Added

- **Cyberpunk one-page layout** with hero, about, experience, projects, skills, contact, and footer sections
- **TerminalCLI** — a fully interactive in-browser command-line interface with command history and custom output
- **PortfolioChatbot** — AI-style portfolio assistant with:
  - Intent-based reply resolution from a structured knowledge base
  - Animated avatar (canvas sprite-sheet animation, 50-frame sequences)
  - Web Speech API voice playback with system TTS fallback
  - Typing animation for responses
  - Dual character modes: AI bot and hero idle
- **Matrix rain easter egg** with context-aware activation
- **Custom cursor** with hover glow and section-label effects
- **Animated loading screen** with circular SVG progress ring, background video, and phased reveal
- **Data-driven content model** — all profile copy, projects, skills, and experience sourced from `portfolio.js`
- **Framer Motion** scroll-driven animations, parallax, and entrance effects throughout
- **Responsive design** with mobile-first Tailwind CSS v4 utilities
- **Avatar scroll path animation** — hero avatar tracks smoothly to the About section profile card across all screen sizes
- **Asset preloader** with phased loading strategy for images, audio, and sprite frames
- **SEO** — Open Graph meta tags, sitemap, and canonical URL

### Infrastructure

- **CI/CD** via GitHub Actions — lint, build, and test run on every push and PR
- **GitHub issue templates** — Bug Report and Feature Request forms
- **Pull Request template** with validation checklist
- **ESLint** (flat config, ESLint 9) with `no-unused-vars` and `react-refresh` rules
- **Node-based unit tests** for chatbot knowledge resolution and voice selection, wired into `npm test`

### Docs

- `README.md` — setup, structure, and content update guide
- `CONTRIBUTING.md` — contribution process and PR checklist
- `LEARN.md` — architecture notes and module breakdown
- `LICENSE` — MIT

---

## [Unreleased]

Nothing yet. Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).
