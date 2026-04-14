import assert from 'node:assert/strict';

import { selectPreferredVoice } from './chatbotVoice.js';

const voices = [
  { name: 'Google US English', lang: 'en-US', localService: true, default: false },
  { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true, default: true },
  { name: 'Google UK English Female', lang: 'en-GB', localService: true, default: false },
];

const preferredVoice = selectPreferredVoice(voices);
assert.equal(preferredVoice?.name, 'Google UK English Female');

const fallbackVoices = [
  { name: 'French Voice', lang: 'fr-FR', localService: true, default: false },
  { name: 'Default English', lang: 'en-US', localService: true, default: true },
];

const fallbackVoice = selectPreferredVoice(fallbackVoices);
assert.equal(fallbackVoice?.name, 'Default English');

const noVoices = selectPreferredVoice([]);
assert.equal(noVoices, null);

console.log('chatbotVoice tests passed');
