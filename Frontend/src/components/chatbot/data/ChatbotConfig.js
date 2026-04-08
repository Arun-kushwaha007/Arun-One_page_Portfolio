// Data-driven config for the chatbot personality and interactions
export const BOT_CONFIG = {
  name: "Arun's Digital Twin",
  version: "2.1.0",
  personality: "Highly technical, data-driven, and proactive. Focused on system design, cloud performance, and real-time architectures.",
  status: "Online",
  load: "0.04ms",
  voiceEnabled: true,
};

export const QUICK_COMMANDS = [
  { id: 'projects', label: '🚀 Projects', command: '/projects' },
  { id: 'resume', label: '📄 Resume', command: '/resume' },
  { id: 'stack', label: '💻 Tech Stack', command: '/stack' },
  { id: 'metrics', label: '📊 Metrics', command: '/metrics' },
  { id: 'contact', label: '🤝 Contact', command: '/contact' },
];

export const INTENTS = [
  {
    id: 'intro',
    keywords: ['who', 'about', 'arun', 'yourself', 'background'],
    reply: "I'm Arun Kushwaha's engineering avatar. I'm a final-year B.Tech student at NIT Hamirpur, specializing in building high-performance, real-time systems and production-grade cloud pipelines. My work bridges pure software with systems engineering.",
    followUps: ['projects', 'resume', 'stack'],
    reaction: 'wave'
  },
  {
    id: 'projects',
    keywords: ['project', 'projects', 'build', 'portfolio', 'work', 'demo'],
    reply: `Arun has shipped several complex systems. Key highlights:
    \n1. **CollabNest**: Real-time task platform handling 100+ req/s with Redis session caching.
    \n2. **PDF Pipeline**: Enterprise scale GCP pipeline scaling from 2 to 75 workers.
    \n3. **AI Resume Roaster**: LLM-based parsing with 95%+ accuracy.
    \nWhich one should we dive into?`,
    followUps: ['metrics', 'resume', 'contact'],
    reaction: 'project-mode'
  },
  {
    id: 'resume',
    keywords: ['resume', 'experience', 'intern', 'cv', 'work history'],
    reply: `**Current Role:** SDE Intern @ CreditMitra (Fintech). 
    \n**Background:** 
    \n- President of SPEC Society (Technical), managing 80+ members & $3k budget.
    \n- Freelance Full-Stack Engineer for PDF Extraction platforms.
    \n- Web Coordinator for Electrothon 6.0.
    \nWant the full PDF resume? Just ask!`,
    followUps: ['projects', 'education', 'contact'],
    reaction: 'document'
  },
  {
    id: 'stack',
    keywords: ['stack', 'skills', 'tech', 'languages', 'tools', 'frameworks'],
    reply: "My core stack is built for reliability. \n- **Languages:** TS/JS, Python, Go, C++. \n- **Infra:** GCP, AWS, Docker, Kubernetes. \n- **Backend:** Node, FastAPI, Socket.io, Redis. \nI design for observability and low-latency.",
    followUps: ['metrics', 'projects', 'contact'],
    reaction: 'cpu'
  },
  {
    id: 'metrics',
    keywords: ['metrics', 'performance', 'stats', 'numbers', 'speed', 'load'],
    reply: `Performance is my priority. In tests:
    \n- **CollabNest**: Sustained 6,000 requests @ 101.38 req/s with 0% error rate.
    \n- **PDF Pipeline**: Bulk processed 5,000+ docs per batch with deterministic validation.
    \n- **Simulations**: 200+ vehicles at 30 FPS in neural simulations.`,
    followUps: ['projects', 'stack', 'resume'],
    reaction: 'chart'
  },
  {
    id: 'contact',
    keywords: ['contact', 'hire', 'reach', 'email', 'linkedin', 'connect'],
    reply: "The fastest way to reach Arun is arunsk1310@gmail.com. He's also active on LinkedIn. Would you like me to open the contact form for you?",
    followUps: ['projects', 'resume'],
    reaction: 'mail'
  },
  {
    id: 'clear',
    keywords: ['clear', 'reset', 'restart'],
    reply: "Scanning memory... clearing conversation logs. Back to base protocol.",
    action: 'CLEAR_CHAT',
    followUps: ['intro', 'projects'],
    reaction: 'shield'
  },
  {
    id: 'fallback',
    keywords: [],
    reply: "Protocol exception: I didn't quite catch that. Try asking about my projects, performance metrics, or technical stack.",
    followUps: ['projects', 'stack', 'metrics'],
    reaction: 'alert'
  }
];
