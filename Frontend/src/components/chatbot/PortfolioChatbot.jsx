import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  SendHorizontal, 
  X, 
  Activity, 
  Command,
  Bot
} from 'lucide-react';
// import { profile } from '../../data/portfolio';
import { BOT_CONFIG } from './data/ChatbotConfig';
import { buildKnowledgeBase, resolvePortfolioIntent } from './data/chatbotKnowledge';
import { selectPreferredVoice } from './data/chatbotVoice';
import { assetCache } from '../../utils/assetLoader';

const TYPING_DELAY_MS = 250;
const TYPING_SPEED_MS = 8;

// No local loading logic needed anymore

function createMessage(role, text, extras = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...extras,
  };
}

export default function PortfolioChatbot({ isOpen, onOpenChange }) {
  const knowledgeBase = useMemo(() => buildKnowledgeBase(), []);
  const intentMap = knowledgeBase.entriesById;
  const inputRef = useRef(null);

  const welcomeMessage = useMemo(
    () =>
      createMessage(
        'bot',
        `Portfolio assistant online. ${BOT_CONFIG.personality} Ask me anything about Arun's website, or use the quick questions below.`,
        { reaction: 'wave' }
      ),
    []
  );

  const [messages, setMessages] = useState([welcomeMessage]);
  const [promptIds, setPromptIds] = useState(knowledgeBase.defaultPromptIds);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  const typingIntervalRef = useRef(null);
  const thinkingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const openingAudioTimeoutRef = useRef(null);
  const frameRef = useRef(0);
  const hasPlayedIntroRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [characterMode, setCharacterMode] = useState('bot'); // 'bot' or 'hero'

  const isBotSpeaking = useMemo(() => isThinking || isAudioPlaying, [isThinking, isAudioPlaying]);

  const clearActivePlayback = useCallback(() => {
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel?.();
  }, []);

  const speakReply = useCallback((text, intentId) => {
    if (!voiceEnabled || !text) return;

    // 1. Clear previous playback
    clearActivePlayback();
    setIsAudioPlaying(false);

    // 2. Fallback logic: Only use TTS if local audio is unavailable
    const systemFallback = () => {
      // Final guard: if browser is already speaking or if we explicitly don't want fallback
      if (!window.speechSynthesis) return;
      
      console.log(`[Audio] Using system voice fallback for: ${intentId}`);
      const utterance = new SpeechSynthesisUtterance(text);
      const selectedVoice = selectPreferredVoice(availableVoices);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }
      utterance.rate = 1.05;
      utterance.pitch = 0.85;
      
      utterance.onstart = () => {
        if (intentId !== 'bot-open') setIsAudioPlaying(true);
      };
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);

      // Fix for Chrome GC bug: hold a global reference to the utterance
      window.__chatUtterance = utterance;

      window.speechSynthesis.speak(utterance);
    };

    // 3. Attempt local playback (Preloaded or On-demand)
    const preloadedAudio = assetCache.audio[intentId];

    if (preloadedAudio) {
      console.log(`[Audio] Playing preloaded asset: ${intentId}`);
      audioRef.current = preloadedAudio;
      preloadedAudio.currentTime = 0;
      
      if (intentId !== 'bot-open') setIsAudioPlaying(true);
      
      const onEnded = () => {
        setIsAudioPlaying(false);
        preloadedAudio.removeEventListener('ended', onEnded);
      };
      preloadedAudio.addEventListener('ended', onEnded);
      
      // If preloaded, we assume it exists. If it fails (e.g. autoplay), 
      // we only fallback if it's a critical failure.
      preloadedAudio.play().catch(err => {
        console.warn("[Audio] Preloaded play failed:", err);
        // Don't necessarily fallback to TTS for autoplay errors, 
        // usually if preloaded exists, we want THAT or nothing.
        // But for safety, we fallback if it's not and autoplay issue.
        if (err.name !== 'NotAllowedError') systemFallback();
        else setIsAudioPlaying(false);
      });
    } else {
      // Intent not in cache, try one-off load
      const audioPath = `/assets/audio/chatbot/${intentId}.mp3`;
      console.log(`[Audio] Checking local file: ${audioPath}`);
      const audio = new Audio(audioPath);
      
      audio.oncanplaythrough = () => {
        audioRef.current = audio;
        if (intentId !== 'bot-open') setIsAudioPlaying(true);
        audio.onended = () => setIsAudioPlaying(false);
        audio.play().catch(systemFallback);
      };
      
      audio.onerror = () => {
        console.warn(`[Audio] Local file not found at ${audioPath}`);
        systemFallback();
      };

      audio.load();
    }
  }, [voiceEnabled, availableVoices, clearActivePlayback]);

  // Immediately kill any currently playing audio if the user clicks Mute
  // But do NOT kill the typing interval — let the text finish rendering
  useEffect(() => {
    if (!voiceEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel?.();
      setIsAudioPlaying(false);
    }
  }, [voiceEnabled]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    
    // Play global exit voice
    speakReply("System shutting down. Bye, see you!", "bot-close");

    // Force frame to 30 if we're deeper in the loop, to start the reverse sequence
    if (frameRef.current > 29) {
      frameRef.current = 29;
    }
  }, [isClosing, speakReply]);

  const drawFrame = useCallback((index, set = 'bot') => {
    const canvas = canvasRef.current;
    const images = set === 'bot' ? assetCache.chatbotAvatar : assetCache.heroIdle;
    if (!canvas || !images[index]) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
  }, []);

  // Reactive check for assets
  useEffect(() => {
    const handleReady = () => {
      if (assetCache.isLoaded || assetCache.chatbotAvatar.length > 0) {
        setIsReady(true);
        drawFrame(0);
      }
    };

    handleReady();
    assetCache.listeners.push(handleReady);
    return () => {
      assetCache.listeners = assetCache.listeners.filter(l => l !== handleReady);
    };
  }, [drawFrame]);

  // Reset animation and play greeting when opening
  useEffect(() => {
    if (isOpen) {
      frameRef.current = 0;
      setIsClosing(false);
      setCharacterMode('bot'); // Always start as bot
      if (isReady) drawFrame(0, 'bot');
      
      // Play intro audio ONLY on first open, not on mute/unmute toggles
      if (!hasPlayedIntroRef.current) {
        hasPlayedIntroRef.current = true;
        openingAudioTimeoutRef.current = window.setTimeout(() => {
          speakReply("Hello, I am your digital assistant. How can I help you today?", "bot-open");
        }, 2000);
      }
    } else {
      // Clear timeout if closed early
      if (openingAudioTimeoutRef.current) {
        window.clearTimeout(openingAudioTimeoutRef.current);
        openingAudioTimeoutRef.current = null;
      }
      // Reset intro flag so it plays again on next open
      hasPlayedIntroRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isReady, drawFrame]);

  // Frame animation loop
  useEffect(() => {
    if (!isReady) return undefined;

    const interval = setInterval(() => {
      let nextFrame = frameRef.current;
      let nextMode = characterMode;

      if (isClosing) {
        // Shutdown logic: Reverse frames 30 -> 1 (indices 29 -> 0)
        // We ALWAYS use bot assets for the final shutdown regardless of characterMode
        if (nextFrame > 0) {
          nextFrame -= 1;
          nextMode = 'bot'; 
        } else {
          onOpenChange(false);
          setMessages([welcomeMessage]);
          setPromptIds(knowledgeBase.defaultPromptIds);
          setIsThinking(false);
          setDraft('');
          clearInterval(interval);
          return;
        }
      } else if (!voiceEnabled) {
        // Voice OFF: Human Avatar Mode
        if (nextMode === 'bot') {
          // Phase 1: Power down current bot
          if (nextFrame > 0) {
            nextFrame -= 1;
          } else {
            // Phase 2: Switch to Hero
            nextMode = 'hero';
            nextFrame = 0;
          }
        } else {
          // Phase 3: Loop Hero Idle (0-29)
          nextFrame = (nextFrame + 1) % 30;
        }
      } else {
        // Voice ON: AI Bot Mode
        if (nextMode === 'hero') {
          // Switch back to bot opening state
          nextMode = 'bot';
          nextFrame = 0;
        }

        if (isBotSpeaking) {
          // Loop speaking frames: 31 to 50 (indices 30 to 49)
          if (nextFrame < 30 || nextFrame >= 49) {
            nextFrame = 30;
          } else {
            nextFrame += 1;
          }
        } else {
          // Opening + Idle logic
          // Play opening frames 1-30 (indices 0-29), then jump to idle frame 40 (index 39)
          if (nextFrame < 29) {
            nextFrame += 1;
          } else {
            nextFrame = 39;
          }
        }
      }
      
      frameRef.current = nextFrame;
      setCharacterMode(nextMode);
      drawFrame(nextFrame, nextMode);
    }, isClosing ? 50 : (characterMode === 'hero' ? 80 : 120));

    return () => clearInterval(interval);
  }, [isReady, isBotSpeaking, isClosing, voiceEnabled, characterMode, drawFrame, onOpenChange, welcomeMessage, knowledgeBase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!window.speechSynthesis) return undefined;

    const syncVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };

    syncVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', syncVoices);

    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', syncVoices);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) window.clearInterval(typingIntervalRef.current);
      if (thinkingTimeoutRef.current) window.clearTimeout(thinkingTimeoutRef.current);
      if (openingAudioTimeoutRef.current) window.clearTimeout(openingAudioTimeoutRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel?.();
    };
  }, []);


  const resolveIntent = (rawText = '') => {
    return resolvePortfolioIntent(rawText, knowledgeBase);
  };

  const typeBotReply = (intent) => {
    clearActivePlayback();
    setIsThinking(true);

    thinkingTimeoutRef.current = window.setTimeout(() => {
      setIsThinking(false);
      
      if (intent.action === 'CLEAR_CHAT') {
        setMessages([welcomeMessage]);
        setPromptIds(knowledgeBase.defaultPromptIds);
        return;
      }

      const botMessage = createMessage('bot', '', { isTyping: true, reaction: intent.reaction });
      let nextIndex = 0;

      setMessages((current) => [...current, botMessage]);
      setPromptIds(intent.followUps);

      // START AUDIO IMMEDIATELY with the answer
      speakReply(intent.reply, intent.id);

      typingIntervalRef.current = window.setInterval(() => {
        nextIndex += 1;
        setMessages((current) =>
          current.map((message) =>
            message.id === botMessage.id
              ? {
                  ...message,
                  text: intent.reply.slice(0, nextIndex),
                  isTyping: nextIndex < intent.reply.length,
                }
              : message
          )
        );

        if (nextIndex >= intent.reply.length) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          // Audio is already playing or finished
        }
      }, TYPING_SPEED_MS);
    }, TYPING_DELAY_MS);
  };

  const sendMessage = (text, isInternal = false) => {
    const intent = resolveIntent(text);
    if (!isInternal) {
      setMessages((current) => [...current, createMessage('user', text)]);
    }
    typeBotReply(intent);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const nextDraft = draft.trim();
    if (!nextDraft) return;
    setDraft('');
    sendMessage(nextDraft);
  };


  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => onOpenChange(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-[120] hidden items-center gap-4 rounded-3xl border p-2 shadow-2xl backdrop-blur-2xl transition-all duration-500 md:bottom-8 md:right-8 md:flex ${
          isOpen
            ? 'pointer-events-none translate-y-12 opacity-0'
            : 'border-cyan-500/30 bg-black/60 text-white'
        }`}
      >
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
          <Bot className="h-7 w-7 text-cyan-400" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" 
          />
        </div>
      
      </motion.button>

      {/* Main Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] hidden items-center justify-center md:flex">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Full Screen Modal Container */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0.4 : 1 }}
              exit={{ opacity: 0 }}
              className="relative flex h-full w-full overflow-hidden text-white"
            >
              {/* Left Column: Chat Interface (60%) */}
              <motion.div 
                animate={{ 
                  x: isClosing ? -100 : 0,
                  opacity: isClosing ? 0 : 1 
                }}
                transition={{ duration: 0.5, ease: "easeIn" }}
                className="relative flex h-full w-full flex-col border-r border-white/5 md:w-[60%] bg-black/60 backdrop-blur-3xl"
              >
                {/* Header */}
                <div className="p-8 md:p-12 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-white/90">Curator AI</h1>
                      <p className="text-[10px] mt-1 font-bold tracking-[0.3em] text-cyan-500/60 uppercase">Advanced Portfolio Assistant</p>
                    </div>
                    <button 
                      onClick={handleClose}
                      className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto overscroll-contain p-8 md:p-12 space-y-10 no-scrollbar"
                >
                  {messages.map((msg) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className="flex flex-col gap-4"
                    >
                      <div className={`flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase ${
                        msg.role === 'user' ? 'justify-end text-white/40' : 'text-cyan-500/60'
                      }`}>
                        {msg.role === 'bot' && <Activity className="h-3 w-3 animate-pulse" />}
                        {msg.role === 'user' ? 'ACCESS_REQUEST' : 'CORE_INTERFACE'}
                      </div>

                      <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] text-base leading-relaxed p-6 rounded-2xl border ${
                          msg.role === 'user' 
                            ? 'bg-blue-600/10 border-blue-500/20 text-white/80 rounded-tr-none' 
                            : 'bg-white/5 border-white/5 text-white/70 rounded-tl-none font-light'
                        }`}>
                          {msg.text}
                          {msg.isTyping && (
                            <motion.span 
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                              className="ml-1 inline-block h-4 w-1.5 rounded-full bg-cyan-400 align-middle"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isThinking && (
                    <div className="flex flex-col gap-4">
                      <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-cyan-500/60 flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                        PROCESSING_DATA...
                      </div>
                      <div className="flex gap-2">
                        {[0, 1, 2].map((d) => (
                          <motion.div
                            key={d}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.1 }}
                            className="h-1 w-12 rounded-full bg-cyan-500/20"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 md:p-12 pt-0 space-y-8">
                  <div className="flex flex-wrap gap-3">
                    {promptIds.map((id) => {
                      const entry = intentMap[id];
                      if (!entry) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            setMessages((current) => [...current, createMessage('user', entry.label, { isCommand: true })]);
                            sendMessage(entry.id, true); // Send the ID as the command for exact matching
                          }}
                          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[11px] font-medium tracking-wider text-white/50 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                        >
                          {entry.label}
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSubmit} className="relative group">
                    <input
                      ref={inputRef}
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Input query for system analysis..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-base text-white placeholder:text-white/20 outline-none transition-all focus:border-cyan-500/40"
                    />
                    <div className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center gap-4">
                       <button
                          type="button"
                          onClick={() => setVoiceEnabled(!voiceEnabled)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${voiceEnabled ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/20'}`}
                        >
                          {voiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </button>
                        <button
                          type="submit"
                          className="flex h-10 w-10 items-center justify-center text-white/40 hover:text-cyan-400 transition-colors"
                        >
                          <SendHorizontal className="h-6 w-6" />
                        </button>
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Right Column: Speaking Character (40%) */}
              <div className="relative hidden md:block w-[52%] h-full bg-black">
                {/* Reactive Canvas Avatar Area */}
                <div className="absolute inset-0 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={1600}
                    height={1600}
                    className="h-full w-full object-cover opacity-90 mix-blend-screen brightness-110 grayscale-[20%] transition-opacity duration-700"
                    style={{ opacity: isReady ? 0.9 : 0 }}
                  />
                  {/* Digital Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                  
                  {/* Status Markers */}
                  <div className="absolute right-12 top-12 flex flex-col items-end gap-3">
                    <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/60 px-6 py-2.5 backdrop-blur-xl">
                       <div className={`h-2.5 w-2.5 rounded-full ${isThinking || messages.some(m => m.isTyping) ? 'bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]' : 'bg-white/20'}`} />
                       <span className="text-[11px] font-bold tracking-[0.25em] text-white/90 uppercase">
                         {isThinking || messages.some(m => m.isTyping) ? 'LINK_ACTIVE' : 'SYSTEM_IDLE'}
                       </span>
                    </div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
                      SYNC_LATENCY: {Math.floor(Math.random() * 5 + 5)}MS
                    </div>
                  </div>

                  {/* Tech Specs Overlay */}
                  <div className="absolute left-10 bottom-12 space-y-2 pointer-events-none">
                     <div className="text-[9px] font-mono text-cyan-500/40 uppercase tracking-widest">Digital Twin v2.4.0</div>
                     <div className="h-0.5 w-12 bg-cyan-500/20" />
                     <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Neural weights: Optimized</div>
                  </div>
                </div>

                {/* Decorative Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
