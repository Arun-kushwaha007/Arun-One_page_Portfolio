import { education, experiences, profile, projects, skills } from '../../../data/portfolio.js';
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

function skillSummary() {
  return Object.entries(skills)
    .slice(0, 4)
    .map(([category, config]) => `${category}: ${config.items.slice(0, 4).join(', ')}`)
    .join('\n');
}

function projectReply(project) {
  const links = [
    project.links?.github ? `GitHub: ${project.links.github}` : null,
    project.links?.demo ? `Demo: ${project.links.demo}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `${project.title}

${project.description}

Tech: ${project.tech.join(', ')}

Highlights:
- ${project.points.join('\n- ')}
${links ? `\n\n${links}` : ''}`;
}

function projectKeywords(project) {
  return [
    project.id,
    project.title,
    project.description,
    ...project.tech,
    ...project.points,
  ];
}

export function buildKnowledgeBase() {
  const projectEntries = projects.map((project) => ({
    id: `project-${project.id}`,
    label: project.title,
    keywords: projectKeywords(project),
    reply: projectReply(project),
    followUps: ['projects', 'stack', 'contact'],
    reaction: 'project-mode',
  }));

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
      label: 'Show project highlights',
      keywords: ['projects', 'project', 'portfolio', 'build', 'work', 'demo'],
      reply: `Here are the main projects on the website:

- ${projects.slice(0, 5).map((project) => project.title).join('\n- ')}

Ask for any one project by name and I will answer from the website content only.`,
      followUps: projectEntries.slice(0, 4).map((entry) => entry.id),
      reaction: 'project-mode',
    },
    {
      id: 'stack',
      label: 'What is the tech stack?',
      keywords: ['stack', 'skills', 'tech', 'tools', 'frameworks', 'languages', 'backend', 'frontend', 'cloud'],
      reply: `Arun's website lists this stack:

${skillSummary()}`,
      followUps: ['projects', 'experience', 'contact'],
      reaction: 'cpu',
    },
    {
      id: 'experience',
      label: 'Show experience',
      keywords: ['experience', 'internship', 'intern', 'work', 'career', 'roles'],
      reply: `Experience highlights:

- ${experiences
        .slice(0, 4)
        .map((experience) => `${experience.role} at ${experience.company.trim()} (${experience.period})`)
        .join('\n- ')}`,
      followUps: ['education', 'projects', 'contact'],
      reaction: 'document',
    },
    {
      id: 'education',
      label: 'Education',
      keywords: ['education', 'college', 'degree', 'nit', 'cgpa', 'study'],
      reply: `${education.degree}
${education.institution}
${education.period}
CGPA: ${education.cgpa}
Coursework: ${education.coursework}`,
      followUps: ['experience', 'projects', 'contact'],
      reaction: 'document',
    },
    {
      id: 'contact',
      label: 'How can I contact Arun?',
      keywords: ['contact', 'email', 'phone', 'hire', 'reach', 'linkedin', 'github', 'connect'],
      reply: `You can contact Arun through:

Email: ${profile.email}
Phone: ${profile.phone}
LinkedIn: ${profile.social.linkedin}
GitHub: ${profile.social.github}`,
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
