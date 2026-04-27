import assert from 'node:assert/strict';

import { buildKnowledgeBase, resolvePortfolioIntent } from './chatbotKnowledge.js';

const knowledgeBase = buildKnowledgeBase();

const collabnestEntry = knowledgeBase.projectEntries.find((entry) => entry.id === 'project-collabnest');
assert.ok(collabnestEntry);
assert.match(collabnestEntry.reply, /Collab-?Nest/i);
assert.match(collabnestEntry.reply, /Redis/i);

const projectIntent = resolvePortfolioIntent('tell me about collab-nest and real-time work', knowledgeBase);
assert.equal(projectIntent.id, 'project-collabnest');
assert.match(projectIntent.reply, /Collab-?Nest/i);

const fallbackIntent = resolvePortfolioIntent('what is your favorite movie', knowledgeBase);
assert.equal(fallbackIntent.id, 'fallback');
assert.match(fallbackIntent.reply, /projects/i);
assert.match(fallbackIntent.reply, /skills|tech stack/i);

const contactIntent = resolvePortfolioIntent('how can i contact arun', knowledgeBase);
assert.equal(contactIntent.id, 'contact');
assert.match(contactIntent.reply, /arunsk1310@gmail.com/i);

console.log('chatbotKnowledge tests passed');
