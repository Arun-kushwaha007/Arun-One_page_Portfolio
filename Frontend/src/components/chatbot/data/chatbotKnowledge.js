import { profile } from '../../../data/portfolio.js';
import { QUICK_COMMANDS } from './ChatbotConfig.js';

function normalizeText(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9\s/+.-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreKeywords(normalizedInput, keywords = []) {
  return keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return score;
    return normalizedInput.includes(normalizedKeyword) ? score + 1 : score;
  }, 0);
}


export function buildKnowledgeBase() {

  const projectFollowUps = ['project-pdf-csv-pipeline', 'project-collabnest', 'project-ai-fir', 'project-resume-roaster', 'project-self-driving-car'];

  const projectEntries = [
    {
      id: 'project-pdf-csv-pipeline',
      label: 'PDF-CSV Pipeline',
      keywords: ['pdf', 'csv', 'pipeline', 'enterprise', 'gcp', 'document ai'],
      reply: "The Enterprise PDF to CSV Pipeline is a production-grade system using GCP Document AI. It processes over 5,000 documents per batch and features dynamic worker scaling with rate-limiting.",
      followUps: projectFollowUps.filter(id => id !== 'project-pdf-csv-pipeline').concat(['stack', 'contact']),
      reaction: 'project-mode',
    },
    {
      id: 'project-collabnest',
      label: 'Collab-Nest',
      keywords: ['collab-nest', 'collaboration', 'real-time', 'socket', 'redis'],
      reply: "Collab-Nest is a real-time collaboration platform. It was build with Node.js, Socket-IO, and Redis. It's designed for high performance, handling over 100 requests per second with near-zero connection failures.",
      followUps: projectFollowUps.filter(id => id !== 'project-collabnest').concat(['stack', 'contact']),
      reaction: 'project-mode',
    },
    {
      id: 'project-ai-fir',
      label: 'AI-FIR Analysis',
      keywords: ['fir', 'legal', 'police', 'ai fir', 'hackathon'],
      reply: "The AI FIR analysis project uses a RAG pipeline for legal-act prediction. It ranked in the top 10 out of over 400 teams at the Rajasthan Police Hackathon for its accuracy and system design.",
      followUps: projectFollowUps.filter(id => id !== 'project-ai-fir').concat(['stack', 'contact']),
      reaction: 'project-mode',
    },
    {
      id: 'project-resume-roaster',
      label: 'Resume Roaster',
      keywords: ['resume', 'roaster', 'ats', 'optimizer', 'llm'],
      reply: "Resume Roaster is an AI-powered ATS optimizer. It uses LLMs for semantic parsing and keyword optimization, currently processing over 100 requests daily with very low response times.",
      followUps: projectFollowUps.filter(id => id !== 'project-resume-roaster').concat(['stack', 'contact']),
      reaction: 'project-mode',
    },
    {
      id: 'project-self-driving-car',
      label: 'Self-Driving Car',
      keywords: ['self-driving', 'car', 'simulation', 'neural network', 'genetic algorithm'],
      reply: "This is a JavaScript-based self-driving car simulation. It uses Neural Networks and Genetic Algorithms for autonomous navigation, complete with ray-casting sensors and collision detection.",
      followUps: projectFollowUps.filter(id => id !== 'project-self-driving-car').concat(['stack', 'contact']),
      reaction: 'project-mode',
    }
  ];

  const entries = [
    {
      id: 'intro',
      label: 'Tell me about Arun',
      keywords: ['who is arun', 'about arun', 'about', 'background', 'summary', profile.name],
      reply: "Arun Kushwaha is a Full-Stack Developer specializing in scalable backend systems and cloud infrastructure. He is a final-year student at NIT Hamirpur with a focus on low-latency architectures and production-grade services.",
      followUps: ['projects', 'stack', 'experience', 'contact'],
      reaction: 'wave',
    },
    {
      id: 'projects',
      label: 'Projects',
      keywords: ['projects', 'project', 'portfolio', 'build', 'work', 'demo'],
      reply: "Arun has several high-impact projects. The main highlights include an Enterprise PDF to CSV Pipeline, the Collab-Nest real-time platform, AI FIR analysis, and a Self-Driving Car simulation. Which one would you like to hear more about?",
      followUps: ['project-pdf-csv-pipeline', 'project-collabnest', 'project-ai-fir', 'project-resume-roaster', 'project-self-driving-car'],
      reaction: 'project-mode',
    },
    {
      id: 'stack',
      label: 'Tech Stack',
      keywords: ['stack', 'skills', 'tech', 'tools', 'frameworks', 'languages', 'backend', 'frontend', 'cloud'],
      reply: "Arun's tech stack is quite extensive. He works with JavaScript, Python, and Go for languages. For backend, he uses Node.js, Express, and FastAPI with databases like PostgreSQL and Redis. He's also proficient in Cloud and DevOps tools like GCP, AWS, Docker, and Kubernetes.",
      followUps: ['projects', 'experience', 'contact'],
      reaction: 'cpu',
    },
    {
      id: 'experience',
      label: 'Experience',
      keywords: ['experience', 'internship', 'intern', 'work', 'career', 'roles', 'spec'],
      reply: "Arun has professional experience as a Software Developer Intern at Credit-Mitra and as a Freelance Full-Stack Engineer. He also has significant leadership experience as the President of the SPEC Society at NIT Hamirpur.",
      followUps: ['projects', 'education', 'contact'],
      reaction: 'document',
    },
    {
      id: 'education',
      label: 'Education',
      keywords: ['education', 'college', 'degree', 'nit', 'cgpa', 'study'],
      reply: "Arun is pursuing a B-Tech in Electronics and Communication from NIT Hamirpur. He maintains a strong CGPA of 8.05 and has completed advanced coursework in System Design, Algorithms, and Operating Systems.",
      followUps: ['projects', 'experience', 'contact'],
      reaction: 'document',
    },
    {
      id: 'contact',
      label: 'Contact',
      keywords: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'connect'],
      reply: "You can reach Arun via email at arunsk1310@gmail.com. You can also connect with him on LinkedIn or check out his latest code contributions on GitHub.",
      followUps: ['projects', 'stack', 'experience'],
      reaction: 'mail',
    },
    {
      id: 'clear',
      label: 'Reset chat',
      keywords: ['clear', 'reset', 'restart', '/clear'],
      reply: 'Clearing the current conversation and returning to the default portfolio prompts.',
      action: 'CLEAR_CHAT',
      followUps: ['intro', 'projects', 'stack'],
      reaction: 'shield',
    },
  ];

  const fallback = {
    id: 'fallback',
    label: 'Fallback',
    keywords: [],
    reply:
      "I only answer from Arun's portfolio content. Try asking about projects, tech stack, experience, education, or contact details.",
    followUps: ['intro', 'projects', 'stack', 'contact'],
    reaction: 'alert',
  };

  const allEntries = [...entries, ...projectEntries, fallback];

  return {
    defaultPromptIds: ['intro', 'projects', 'stack', 'experience', 'contact'],
    entries: allEntries,
    entriesById: Object.fromEntries(allEntries.map((entry) => [entry.id, entry])),
    quickCommands: QUICK_COMMANDS,
    projectEntries,
    fallback,
  };
}

export function resolvePortfolioIntent(rawText = '', knowledgeBase = buildKnowledgeBase()) {
  const normalizedInput = normalizeText(rawText);

  if (!normalizedInput) {
    return knowledgeBase.fallback;
  }

  const commandMatch = knowledgeBase.quickCommands.find((command) =>
    normalizedInput.includes(normalizeText(command.command))
  );
  if (commandMatch) {
    return knowledgeBase.entriesById[commandMatch.id] ?? knowledgeBase.fallback;
  }

  // Check for exact ID match (useful for button clicks)
  if (knowledgeBase.entriesById[normalizedInput.replace(/\s+/g, '-')]) {
    return knowledgeBase.entriesById[normalizedInput.replace(/\s+/g, '-')];
  }
  
  // Also check for ID match without the 'project-' prefix if applicable
  if (knowledgeBase.entriesById[normalizedInput]) {
    return knowledgeBase.entriesById[normalizedInput];
  }

  const bestMatch = knowledgeBase.entries
    .filter((entry) => entry.id !== 'fallback')
    .map((entry) => ({
      entry,
      score: scoreKeywords(normalizedInput, entry.keywords),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const leftIsProject = left.entry.id.startsWith('project-');
      const rightIsProject = right.entry.id.startsWith('project-');

      if (leftIsProject === rightIsProject) {
        return 0;
      }

      return rightIsProject ? 1 : -1;
    })[0];

  return bestMatch?.score > 0 ? bestMatch.entry : knowledgeBase.fallback;
}
