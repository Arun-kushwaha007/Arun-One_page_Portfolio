import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  SendHorizonal, 
  Sparkles, 
  X, 
  Terminal, 
  Activity, 
  Command,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { profile } from '../../data/portfolio';
import { BOT_CONFIG } from './data/ChatbotConfig';
import { buildKnowledgeBase, resolvePortfolioIntent } from './data/chatbotKnowledge';
import { selectPreferredVoice } from './data/chatbotVoice';

const TYPING_DELAY_MS = 250;
const TYPING_SPEED_MS = 14;

// Shared image cache loaded once and kept in memory
const avatarCache = { images: [], loaded: false };

function loadAvatarImages() {
  if (avatarCache.loaded) return Promise.resolve(avatarCache.images);
  
  const promises = Array.from({ length: 50 }, (_, i) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `/assets/avatar-chat-bot/${String(i + 1).padStart(2, '0')} - Edited.png`;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  });

  return Promise.all(promises).then((results) => {
    avatarCache.images = results.filter(img => img !== null);
    avatarCache.loaded = true;
    return avatarCache.images;
  });
}

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
  const [reaction, setReaction] = useState('idle');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  const typingIntervalRef = useRef(null);
  const thinkingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const isBotSpeaking = useMemo(() => isThinking || messages.some((m) => m.isTyping), [isThinking, messages]);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas || !avatarCache.images[index]) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarCache.images[index], 0, 0, canvas.width, canvas.height);
  }, []);

  // Preload frames once
  useEffect(() => {
    loadAvatarImages().then(() => {
      setIsReady(true);
      drawFrame(0);
    });
  }, [drawFrame]);

  // Reset animation when opening
  useEffect(() => {
    if (isOpen) {
      frameRef.current = 0;
      if (isReady) drawFrame(0);
    }
  }, [isOpen, isReady, drawFrame]);

  // Frame animation loop
  useEffect(() => {
    if (!isReady) return undefined;

    const interval = setInterval(() => {
      // Logic for frame range
      let nextFrame = frameRef.current;
      if (isBotSpeaking) {
        // Loop speaking frames: 31 to 50 (indices 30 to 49)
        if (nextFrame < 30 || nextFrame >= 49) {
          nextFrame = 30;
        } else {
          nextFrame += 1;
        }
      } else {
        // Idle logic: Play frames 1-40 (indices 0-39) once, then hold at 40
        if (nextFrame < 39) {
          nextFrame += 1;
        } else {
          // Stay at frame 40 (index 39) if not speaking
          nextFrame = 39;
        }
      }
      
      frameRef.current = nextFrame;
      drawFrame(nextFrame);
    }, 120);

    return () => clearInterval(interval);
  }, [isReady, isBotSpeaking, drawFrame]);

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
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onOpenChange]);

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
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  const speakReply = (text) => {
    if (!voiceEnabled || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = selectPreferredVoice(availableVoices);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = 1.1;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const clearActivePlayback = () => {
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    window.speechSynthesis?.cancel?.();
  };

  const resolveIntent = (rawText = '') => {
    return resolvePortfolioIntent(rawText, knowledgeBase);
  };

  const typeBotReply = (intent) => {
    clearActivePlayback();
    setIsThinking(true);
    setReaction('thinking');

    thinkingTimeoutRef.current = window.setTimeout(() => {
      setIsThinking(false);
      
      if (intent.action === 'CLEAR_CHAT') {
        setMessages([welcomeMessage]);
        setPromptIds(knowledgeBase.defaultPromptIds);
        setReaction('idle');
        return;
      }

      const botMessage = createMessage('bot', '', { isTyping: true, reaction: intent.reaction });
      let nextIndex = 0;

      setMessages((current) => [...current, botMessage]);
      setReaction(intent.reaction);
      setPromptIds(intent.followUps);

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
          speakReply(intent.reply);
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

  const handleCommandClick = (cmd) => {
    setMessages((current) => [...current, createMessage('user', cmd.label, { isCommand: true })]);
    sendMessage(cmd.command, true);
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
        className={`fixed bottom-6 right-6 z-[120] flex items-center gap-4 rounded-3xl border p-2 shadow-2xl backdrop-blur-2xl transition-all duration-500 md:bottom-8 md:right-8 ${
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
        <div className="pr-6 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Arun Assistant</p>
          <p className="text-sm font-medium text-white/90">Website Q and A</p>
        </div>
      </motion.button>

      {/* Main Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.section
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="liquid-glass relative flex h-[700px] w-full max-w-5xl overflow-hidden rounded-[2rem] border-cyan-500/20 text-white shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              {/* Left Column: Chat Interface */}
              <div className="relative flex h-full w-full flex-col border-r border-white/5 md:w-[45%] lg:w-[40%] bg-black/40">
                {/* Header */}
                <div className="p-8 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white/90">Curator AI</h1>
                      <p className="text-[10px] font-medium tracking-[0.15em] text-cyan-400/60 uppercase mt-1">
                        NEURAL_LINK_ACTIVE
                      </p>
                    </div>
                    <button 
                      onClick={() => onOpenChange(false)}
                      className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto overscroll-contain p-8 space-y-8 no-scrollbar"
                >
                  {messages.map((msg) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className="flex flex-col gap-3"
                    >
                      <div className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase ${
                        msg.role === 'user' ? 'justify-end text-white/40' : 'text-cyan-500/60'
                      }`}>
                        {msg.role === 'bot' && <Activity className="h-3 w-3 animate-pulse" />}
                        {msg.role === 'user' ? 'USER' : 'CURATOR'}
                      </div>

                      <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] text-sm leading-relaxed p-4 rounded-2xl border ${
                          msg.role === 'user' 
                            ? 'bg-blue-600/10 border-blue-500/30 text-white/80 rounded-tr-none' 
                            : 'bg-white/5 border-white/10 text-white/70 rounded-tl-none font-light'
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
                    <div className="flex flex-col gap-3">
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-500/60 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                        ANALYZING...
                      </div>
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((d) => (
                          <motion.div
                            key={d}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.1 }}
                            className="h-1 w-6 rounded-full bg-cyan-500/30"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 pt-0 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {knowledgeBase.quickCommands.slice(0, 3).map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleCommandClick(cmd)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium tracking-wider text-white/50 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                      >
                        {cmd.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="relative group">
                    <input
                      ref={inputRef}
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Inquire further..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-cyan-500/50"
                    />
                    <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
                       <button
                          type="button"
                          onClick={() => setVoiceEnabled(!voiceEnabled)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${voiceEnabled ? 'text-cyan-400' : 'text-white/20'}`}
                        >
                          {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </button>
                        <button
                          type="submit"
                          className="flex h-8 w-8 items-center justify-center text-white/40 hover:text-cyan-400 transition-colors"
                        >
                          <SendHorizonal className="h-5 w-5" />
                        </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Speaking Character */}
              <div className="relative hidden flex-1 h-full md:block bg-black">
                {/* Reactive Canvas Avatar Area */}
                <div className="absolute inset-0 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={1200}
                    height={1200}
                    className="h-full w-full object-cover opacity-80 mix-blend-screen brightness-125 transition-opacity duration-500"
                    style={{ opacity: isReady ? 0.8 : 0 }}
                  />
                  {/* Digital Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                  
                  {/* Status Markers */}
                  <div className="absolute right-8 top-8 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-md">
                       <div className={`h-2 w-2 rounded-full ${isThinking || messages.some(m => m.isTyping) ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]' : 'bg-white/20'}`} />
                       <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
                         {isThinking || messages.some(m => m.isTyping) ? 'STREAMING' : 'IDLE'}
                       </span>
                    </div>
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      BUFF_LATENCY: 12ms
                    </div>
                  </div>

                  {/* Character Meta */}
                  <div className="absolute bottom-12 left-12 space-y-4">
                    <div className="h-px w-24 bg-cyan-500/50" />
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 uppercase">SYNTHETIC_AVATAR_01</p>
                      <h2 className="text-5xl font-bold tracking-tighter text-white/90 mt-2">ARUN_BOT</h2>
                    </div>
                    <p className="max-w-xs text-xs font-light leading-relaxed text-white/40 italic">
                      "I am a digital extension of Arun's technical expertise, ready to converse on systems and design."
                    </p>
                  </div>
                </div>

                {/* Decorative Tech Elements */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
