import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircleMore, Mic, MicOff, SendHorizonal, Sparkles, X } from 'lucide-react';
import { education, profile, projects, skills } from '../../data/portfolio';

const TYPING_DELAY_MS = 220;
const TYPING_SPEED_MS = 16;

function buildIntents() {
  const skillStack = Object.values(skills)
    .flatMap((group) => group.items)
    .slice(0, 10)
    .join(', ');

  return [
    {
      id: 'intro',
      label: 'Who are you?',
      reaction: 'introducing',
      keywords: ['who', 'about', 'arun', 'yourself'],
      reply:
        "I'm Arun Kushwaha, a full-stack engineer who likes real-time systems, cloud platforms, and applied AI. This avatar version of me is the fast lane through the portfolio.",
      followUps: ['projects', 'skills', 'contact'],
    },
    {
      id: 'projects',
      label: 'Show me projects',
      reaction: 'project-mode',
      keywords: ['project', 'projects', 'build', 'portfolio', 'work'],
      reply: `Start with ${projects[0].title}. It's a production-style document pipeline, and it shows how I think about throughput, reliability, and system design. I also built real-time collaboration and AI-heavy products if you want the next layer.`,
      followUps: ['skills', 'experience', 'contact'],
    },
    {
      id: 'skills',
      label: 'What is your stack?',
      reaction: 'stack-scan',
      keywords: ['stack', 'skills', 'tech', 'tools'],
      reply: `I move across backend, frontend, and infra. My core stack includes ${skillStack}. I care less about hype and more about shipping systems that stay measurable and stable.`,
      followUps: ['projects', 'experience', 'contact'],
    },
    {
      id: 'experience',
      label: 'Tell me about experience',
      reaction: 'timeline',
      keywords: ['experience', 'intern', 'education', 'college', 'nit'],
      reply: `I'm a final-year engineer at ${education.institution}, and I've also worked on internship and freelance builds. The pattern across all of it is ownership: I like getting features from idea to working delivery.`,
      followUps: ['projects', 'skills', 'contact'],
    },
    {
      id: 'contact',
      label: 'How do I contact you?',
      reaction: 'contact-open',
      keywords: ['contact', 'email', 'hire', 'reach', 'message', 'resume'],
      reply: `The cleanest way to reach me is ${profile.email}. If you want to talk about roles, projects, or collaboration, send me a message there and I'll take it from there.`,
      followUps: ['projects', 'intro', 'skills'],
    },
    {
      id: 'fallback',
      label: 'Try another question',
      reaction: 'reroute',
      keywords: [],
      reply:
        "I'm best at talking about Arun's projects, stack, experience, and contact details. Hit one of the guided prompts and I'll stay useful instead of pretending to know everything.",
      followUps: ['intro', 'projects', 'contact'],
    },
  ];
}

function createMessage(role, text, extras = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    ...extras,
  };
}

export default function PortfolioChatbot() {
  const intents = useMemo(() => buildIntents(), []);
  const intentMap = useMemo(
    () => Object.fromEntries(intents.map((intent) => [intent.id, intent])),
    [intents],
  );

  const welcomeMessage = useMemo(
    () =>
      createMessage(
        'bot',
        "Hey, I'm Arun in avatar mode. Ask about my projects, stack, experience, or how to contact me.",
      ),
    [],
  );

  const [messages, setMessages] = useState([welcomeMessage]);
  const [promptIds, setPromptIds] = useState(['intro', 'projects', 'skills', 'experience', 'contact']);
  const [reaction, setReaction] = useState('idle');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const typingIntervalRef = useRef(null);
  const thinkingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
      }
      if (thinkingTimeoutRef.current) {
        window.clearTimeout(thinkingTimeoutRef.current);
      }
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  const speakReply = (text) => {
    if (!voiceEnabled || !window.speechSynthesis || !text) {
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
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
    const normalized = rawText.trim().toLowerCase();
    if (!normalized) {
      return intentMap.fallback;
    }

    const scoredIntent = intents
      .filter((intent) => intent.id !== 'fallback')
      .map((intent) => ({
        intent,
        score: intent.keywords.reduce((total, keyword) => {
          return normalized.includes(keyword) ? total + 1 : total;
        }, 0),
      }))
      .sort((left, right) => right.score - left.score)[0];

    if (scoredIntent?.score > 0) {
      return scoredIntent.intent;
    }

    return intentMap.fallback;
  };

  const typeBotReply = (intent) => {
    clearActivePlayback();
    setReaction('thinking');

    thinkingTimeoutRef.current = window.setTimeout(() => {
      const botMessage = createMessage('bot', '', { isTyping: true, intentId: intent.id });
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
              : message,
          ),
        );

        if (nextIndex >= intent.reply.length) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          speakReply(intent.reply);
        }
      }, TYPING_SPEED_MS);
    }, TYPING_DELAY_MS);
  };

  const sendIntent = (intent, userLabel) => {
    setMessages((current) => [...current, createMessage('user', userLabel)]);
    typeBotReply(intent);
  };

  const handlePromptClick = (intentId) => {
    const intent = intentMap[intentId] ?? intentMap.fallback;
    sendIntent(intent, intent.label);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextDraft = draft.trim();
    if (!nextDraft) {
      return;
    }

    const intent = resolveIntent(nextDraft);
    setDraft('');
    sendIntent(intent, nextDraft);
  };

  const promptOptions = promptIds.map((id) => intentMap[id]).filter(Boolean);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open Arun avatar chat"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-full border px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition md:bottom-8 md:right-8 ${
          isOpen
            ? 'pointer-events-none opacity-0'
            : 'border-cyan-300/35 bg-[linear-gradient(135deg,rgba(0,243,255,0.2),rgba(10,255,10,0.12))] text-white'
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/55">
          <MessageCircleMore className="h-5 w-5 text-cyan-100" />
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-[10px] uppercase tracking-[0.28em] text-cyan-100/75">Avatar Chat</span>
          <span className="block text-sm font-semibold text-white">Talk to Arun</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.section
            key="chatbot-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-3 bottom-3 z-[125] md:inset-auto md:bottom-8 md:right-8 md:w-[min(30rem,calc(100vw-2rem))]"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(0,243,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(10,255,10,0.14),transparent_25%),rgba(3,6,11,0.94)] p-4 shadow-[0_0_80px_rgba(0,243,255,0.08)] backdrop-blur-xl md:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(0,243,255,0.08))]" />

              <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <motion.div
                    animate={{
                      y: reaction === 'thinking' ? [0, -6, 0] : 0,
                      rotate: reaction === 'project-mode' ? [0, -1.25, 1.25, 0] : 0,
                      scale: reaction === 'contact-open' ? [1, 1.03, 1] : 1,
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: reaction === 'idle' ? 0 : Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative h-18 w-18 shrink-0"
                  >
                    <div className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-br from-cyan-400/30 via-transparent to-neon-green/20 blur-xl" />
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/55 p-2">
                      <img
                        src={profile.image}
                        alt={`${profile.name} avatar`}
                        className="h-14 w-14 rounded-[1rem] object-cover"
                      />
                    </div>
                  </motion.div>

                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      Avatar Protocol
                    </div>
                    <h2 className="mt-2 text-xl font-bold leading-tight text-white">
                      Chat with Arun&apos;s portfolio avatar
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Guided, typed, and built to answer portfolio questions fast.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close Arun avatar chat"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/10 bg-black/40 p-2 text-white/75 transition hover:border-white/25 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative z-10 rounded-[1.7rem] border border-white/10 bg-black/40 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Live Conversation</p>
                    <p className="mt-1 text-sm font-semibold text-white">Mostly guided, fast, and on-topic.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled((current) => !current)}
                    aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-200/15"
                  >
                    {voiceEnabled ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {voiceEnabled ? 'Voice On' : 'Voice Off'}
                  </button>
                </div>

                <div
                  ref={scrollRef}
                  className="mb-4 h-[20rem] space-y-3 overflow-y-auto rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(7,10,15,0.95),rgba(3,5,9,0.8))] p-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[88%] rounded-[1.25rem] px-4 py-3 text-sm leading-7 shadow-[0_10px_25px_rgba(0,0,0,0.18)] ${
                        message.role === 'user'
                          ? 'ml-auto border border-cyan-300/20 bg-cyan-300/15 text-cyan-50'
                          : 'border border-white/8 bg-white/6 text-slate-100'
                      }`}
                    >
                      {message.text}
                      {message.isTyping ? (
                        <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-full bg-cyan-300 align-middle" />
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {promptOptions.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handlePromptClick(prompt.id)}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-200/15"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about projects, skills, or contact..."
                    className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/55 px-5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/55"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-neon-green/35 bg-neon-green/12 px-5 py-3 text-sm font-medium text-neon-green transition hover:border-neon-green/75 hover:bg-neon-green/18"
                  >
                    Send
                    <SendHorizonal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
