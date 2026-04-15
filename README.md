# Arun One Page Portfolio

[![Live Demo: arunkushwaha.xyz](https://img.shields.io/badge/Live%20Demo-arunkushwaha.xyz-ff00ff?style=for-the-badge&logo=google-chrome&logoColor=white)](https://arunkushwaha.xyz)

Cyberpunk-styled portfolio built with React and Vite. The site presents Arun Kushwaha's profile, experience, projects, skills, contact details, and a set of interactive UI systems including a browser terminal, chatbot assistant, animated overlays, and a Matrix-style easter egg.

![Portfolio Demo](Frontend/public/portfolio.gif)

## What This Repo Contains

This repository is centered on the `Frontend/` app:

- `Frontend/src/App.jsx` wires the full one-page experience together.
- `Frontend/src/data/portfolio.js` holds the portfolio content model.
- `Frontend/src/components/` contains the page sections and interactive UI modules.
- `Frontend/src/components/chatbot/` contains the portfolio assistant, intent resolution, and voice helpers.
- `Frontend/public/assets/` stores images, avatar frames, and chatbot audio assets.

## Feature Highlights

- Single-page portfolio with hero, about, experience, projects, skills, contact, and footer sections
- Animated cyberpunk presentation with overlays, custom cursor, glitch effects, and Matrix rain
- Embedded `TerminalCLI` component for terminal-style interaction
- `PortfolioChatbot` with typed responses, intent-based replies, optional voice playback, and animated avatars
- Smooth scrolling and layered visual effects powered by Framer Motion, Tailwind CSS v4, and React 19
- Data-driven content so most profile updates can be made from a single source file

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Three.js with `@react-three/fiber` and `@react-three/drei`
- ESLint

## Local Development

Prerequisites:

- Node.js 18+ recommended
- npm

Install and run:

```bash
cd Frontend
npm install
npm run dev
```

Production build:

```bash
cd Frontend
npm run build
npm run preview
```

Lint:

```bash
cd Frontend
npm run lint
```

## Tests

The repo currently includes focused Node-based tests for the chatbot knowledge and voice-selection utilities:

```bash
cd Frontend
node src/components/chatbot/data/chatbotKnowledge.test.js
node src/components/chatbot/data/chatbotVoice.test.js
```

These are not yet wired into an npm script, so they are run directly with Node.

## Updating Portfolio Content

Most portfolio copy and structured content live in:

- `Frontend/src/data/portfolio.js`

Use that file to update:

- hero content
- profile summary
- social links
- skills
- experience
- projects
- education

Interactive assistant responses are derived from the chatbot data layer under:

- `Frontend/src/components/chatbot/data/`

## Project Structure

```text
.
|-- README.md
|-- LEARN.md
|-- CONTRIBUTING.md
`-- Frontend
    |-- package.json
    |-- public
    |   `-- assets
    `-- src
        |-- App.jsx
        |-- data
        |   `-- portfolio.js
        |-- components
        |-- context
        |-- hooks
        `-- utils
```

## Contribution Notes

Arun Kushwaha is the primary author and maintainer of this project. If you want to report an issue or contribute a fix, follow the process documented in [CONTRIBUTING.md](/D:/ak/New%20folder/Arun-One_page_Portfolio/CONTRIBUTING.md).

## License

This project is released under the [MIT License](/D:/ak/New%20folder/Arun-One_page_Portfolio/LICENSE).
