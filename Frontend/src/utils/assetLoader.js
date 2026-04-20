/**
 * Centralized Asset Loader for the Portfolio
 * 
 * Phase 1 (Critical): heroIdle + heroMove — loaded during loading screen
 * Phase 2 (Deferred): chatbotAvatar + audio — loaded after page renders
 */

export const assetCache = {
  heroIdle: [],
  heroMove: [],
  chatbotAvatar: [],
  audio: {},
  isLoaded: false,
  isChatAssetsLoaded: false,
  progress: 0,
  listeners: [],
};

const notifyListeners = () => {
  assetCache.listeners.forEach(cb => cb());
};

// ── Critical image sets: loaded during loading screen ──
const CRITICAL_IMAGE_SETS = [
  { key: 'heroIdle', folder: 'avatar', count: 30 },
  { key: 'heroMove', folder: 'avatar-move', count: 50 },
];

// ── Deferred image sets: loaded after page renders ──
const DEFERRED_IMAGE_SETS = [
  { key: 'chatbotAvatar', folder: 'avatar-chat-bot', count: 50 },
];

const AUDIO_FILES = [
  'bot-open',
  'bot-close',
  'intro',
  'projects',
  'stack',
  'experience',
  'education',
  'contact',
  'clear',
  'fallback',
  // Project-specific audio (IDs from portfolio.js)
  'project-pdf-csv-pipeline',
  'project-collabnest',
  'project-ai-fir',
  'project-resume-roaster',
  'project-self-driving-car',
  'project-chat-app',
  'project-resqterra',
];

/**
 * Load a set of image sequences into the cache
 */
const loadImageSet = (set, onProgress) => {
  return Array.from({ length: set.count }, (_, i) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `/assets/${set.folder}/${String(i + 1).padStart(2, '0')} - Edited.webp`;
      img.onload = () => {
        assetCache[set.key][i] = img;
        if (onProgress) onProgress();
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${img.src}`);
        if (onProgress) onProgress();
        resolve();
      };
    });
  });
};

/**
 * Phase 1: Preload critical assets (heroIdle + heroMove)
 * Called during loading screen — blocks until complete
 */
export const preloadAllAssets = (onProgress) => {
  if (assetCache.isLoaded) return Promise.resolve();

  const totalImages = CRITICAL_IMAGE_SETS.reduce((sum, set) => sum + set.count, 0);
  let loadedItems = 0;

  const updateProgress = () => {
    loadedItems++;
    const progress = Math.min((loadedItems / totalImages) * 100, 100);
    assetCache.progress = progress;
    if (onProgress) onProgress(progress);
  };

  const imagePromises = CRITICAL_IMAGE_SETS.flatMap((set) => loadImageSet(set, updateProgress));

  return Promise.all(imagePromises).then(() => {
    console.log('[AssetLoader] Critical assets loaded:', {
      idle: assetCache.heroIdle.filter(Boolean).length,
      move: assetCache.heroMove.filter(Boolean).length,
    });
    assetCache.isLoaded = true;
    notifyListeners();
    return assetCache;
  });
};

/**
 * Phase 2: Preload deferred assets (chatbot avatar + audio)
 * Called after page finishes loading — non-blocking
 */
export const preloadDeferredAssets = () => {
  if (assetCache.isChatAssetsLoaded) return Promise.resolve();

  const imagePromises = DEFERRED_IMAGE_SETS.flatMap((set) => loadImageSet(set, null));

  const audioPromises = AUDIO_FILES.map((id) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = `/assets/audio/chatbot/${id}.mp3`;
      
      audio.oncanplaythrough = () => {
        assetCache.audio[id] = audio;
        resolve();
        audio.oncanplaythrough = null;
      };

      audio.onerror = () => {
        // Many audio files might not exist yet, we don't want to block
        resolve();
      };

      audio.load();
    });
  });

  return Promise.all([...imagePromises, ...audioPromises]).then(() => {
    console.log('[AssetLoader] Deferred assets loaded:', {
      chat: assetCache.chatbotAvatar.filter(Boolean).length,
      audio: Object.keys(assetCache.audio).length,
    });
    assetCache.isChatAssetsLoaded = true;
    notifyListeners();
    return assetCache;
  });
};
