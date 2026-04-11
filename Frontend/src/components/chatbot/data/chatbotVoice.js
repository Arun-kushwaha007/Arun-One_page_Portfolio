function normalize(value = '') {
  return value.toLowerCase();
}

function scoreVoice(voice) {
  const name = normalize(voice?.name);
  const lang = normalize(voice?.lang);

  let score = 0;

  if (lang.startsWith('en-in')) score += 120;
  else if (lang.startsWith('en-gb')) score += 100;
  else if (lang.startsWith('en-us')) score += 80;
  else if (lang.startsWith('en')) score += 60;

  // New: Prioritize high-quality "Neural" or "Natural" voices
  if (name.includes('neural')) score += 200;
  if (name.includes('natural')) score += 180;
  if (name.includes('online')) score += 100;

  if (name.includes('female')) score += 40;
  if (name.includes('zira')) score += 28;
  if (name.includes('aria')) score += 26;
  if (name.includes('sonia')) score += 24;
  if (name.includes('heera')) score += 24;
  if (name.includes('google')) score += 40; // Boosted
  if (name.includes('microsoft')) score += 30; // Boosted
  if (voice?.localService) score += 8;
  if (voice?.default) score += 6;

  return score;
}

export function selectPreferredVoice(voices = []) {
  if (!Array.isArray(voices) || voices.length === 0) {
    return null;
  }

  const englishVoices = voices.filter((voice) => normalize(voice?.lang).startsWith('en'));
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  return [...pool].sort((left, right) => scoreVoice(right) - scoreVoice(left))[0] ?? null;
}
