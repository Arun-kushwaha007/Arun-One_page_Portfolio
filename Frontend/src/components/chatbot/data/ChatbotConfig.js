export const BOT_CONFIG = {
  name: "Arun's Portfolio Assistant",
  version: "3.0.0",
  personality:
    "I answer from Arun's portfolio content, predefined FAQs, projects, experience, and contact information.",
  status: "Portfolio Synced",
  load: "local knowledge base",
  voiceEnabled: true,
};

export const QUICK_COMMANDS = [
  { id: 'intro', label: 'About Arun', command: '/about' },
  { id: 'projects', label: 'Projects', command: '/projects' },
  { id: 'stack', label: 'Tech Stack', command: '/stack' },
  { id: 'experience', label: 'Experience', command: '/experience' },
  { id: 'contact', label: 'Contact', command: '/contact' },
];
