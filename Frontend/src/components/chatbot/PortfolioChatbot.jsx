import { useEffect, useMemo, useRef, useState } from 'react';
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

const TYPING_DELAY_MS = 250;
const TYPING_SPEED_MS = 14;

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

  const typingIntervalRef = useRef(null);
  const thinkingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);

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
    utterance.rate = 1.1;
    utterance.pitch = 1;
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

      {/* Main Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="fixed inset-x-4 bottom-4 top-4 md:top-auto z-[130] flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#030712]/95 shadow-[0_32px_128px_rgba(0,0,0,0.8)] backdrop-blur-3xl md:inset-auto md:bottom-8 md:right-8 md:h-[720px] md:w-[440px]"
          >
            {/* Header Area */}
            <div className="relative border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div 
                    animate={reaction !== 'idle' ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
                    transition={{ duration: 0.5, repeat: reaction !== 'idle' ? Infinity : 0 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 blur-sm opacity-50" />
                    <img src={profile.image} alt="Arun" className="relative h-14 w-14 rounded-2xl border border-white/20 object-cover" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Arun&apos;s Portfolio Bot
                      <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        {BOT_CONFIG.status}
                      </span>
                      <span className="text-[10px] text-white/30 truncate max-w-[120px]">
                        Latency: {BOT_CONFIG.load}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
                </button>
              </div>

              {/* Status Bar */}
              <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {knowledgeBase.quickCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleCommandClick(cmd)}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-white/70 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400"
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              <LayoutGroup>
                {messages.map((msg) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`group relative max-w-[85%] rounded-[1.5rem] p-4 text-sm leading-relaxed shadow-xl border ${
                      msg.role === 'user' 
                        ? 'border-cyan-500/30 bg-gradient-to-br from-cyan-600/20 to-blue-700/20 text-white rounded-tr-none' 
                        : 'border-white/10 bg-white/5 text-white/90 rounded-tl-none font-light'
                    }`}>
                      {msg.role === 'bot' && (
                        <div className="absolute -left-10 top-0 hidden md:block">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5">
                            {msg.reaction === 'cpu' ? <Cpu className="h-4 w-4 text-cyan-400" /> :
                             msg.reaction === 'project-mode' ? <Layers className="h-4 w-4 text-green-400" /> :
                             <Sparkles className="h-4 w-4 text-blue-400" />}
                          </div>
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap">
                        {msg.text}
                        {msg.isTyping && (
                          <motion.span 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="ml-1 inline-block h-4 w-1.5 rounded-full bg-cyan-400 align-middle"
                          />
                        )}
                      </div>
                      
                      <div className={`mt-2 flex items-center gap-2 text-[10px] ${msg.role === 'user' ? 'text-cyan-300/50' : 'text-white/30'}`}>
                        {msg.timestamp}
                        {msg.isCommand && <Command className="h-2.5 w-2.5" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isThinking && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((d) => (
                          <motion.div
                            key={d}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.1 }}
                            className="h-1.5 w-1.5 rounded-full bg-cyan-500/50"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </LayoutGroup>
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2">
              <div className="mb-4 flex flex-wrap gap-2">
                {promptIds.map((id) => intentMap[id] && (
                  <button
                    key={id}
                    onClick={() => sendMessage(intentMap[id].label)}
                    className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-[11px] text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {intentMap[id].label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about projects, experience, skills, or contact info..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 pr-16 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/[0.08]"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 text-white/30">
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${voiceEnabled ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/10'}`}
                  >
                    {voiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                  <button
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-black transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    <SendHorizonal className="h-5 w-5" />
                  </button>
                </div>
              </form>
              
              <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
                <span className="flex items-center gap-2"><Terminal className="h-3 w-3" /> v{BOT_CONFIG.version}</span>
                <span className="flex items-center gap-2"><Activity className="h-3 w-3" /> Optimized</span>
                <span className="flex items-center gap-2"><Zap className="h-3 w-3" /> Low Latency</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
