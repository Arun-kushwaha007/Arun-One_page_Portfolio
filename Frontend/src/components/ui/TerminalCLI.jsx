import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minus, Maximize2, Command, Search, History as HistoryIcon, Globe, Mail, Github, Linkedin, Code } from 'lucide-react';
import useCyberpunkSound from '../../hooks/useCyberpunkSound';
import { useMatrix } from '../../context/MatrixContext';
import { education, experiences, profile, projects, skills } from '../../data/portfolio';

// --- Constants & Registry ---

const SECTION_ALIASES = {
  hero: 'home',
  home: 'home',
  about: 'about',
  exp: 'experience',
  experience: 'experience',
  project: 'projects',
  projects: 'projects',
  skill: 'skills',
  skills: 'skills',
  contact: 'contact',
};

const OPEN_ALIASES = {
  github: { url: profile.social.github, icon: Github },
  linkedin: { url: profile.social.linkedin, icon: Linkedin },
  leetcode: { url: profile.social.leetcode, icon: Code },
  codeforces: { url: profile.social.codeforces, icon: Code },
  email: { url: `mailto:${profile.email}`, icon: Mail },
};

// --- Sub-components ---

const TypedEntry = ({ content, type, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const speed = 10; // ms per char

  useEffect(() => {
    if (index < content.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + content[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, content, onComplete]);

  const styles = {
    command: "text-white flex items-center gap-2",
    system: "text-cyan-400/90 font-bold",
    response: "text-neon-green/90 terminal-glow",
    error: "text-red-400 font-bold italic",
    header: "text-neon-purple font-black tracking-widest uppercase mb-2 border-b border-neon-purple/20 pb-1",
    info: "text-blue-400 font-medium",
    highlight: "text-amber-400 font-bold",
    secondary: "text-gray-500 font-mono",
    link: "text-neon-blue underline font-bold",
  };

  return (
    <div className={`mb-1 min-h-[1.2rem] ${styles[type] || styles.response}`}>
      {type === 'command' && <span className="text-neon-blue font-bold">➜ ~</span>}
      {displayed}
      {index < content.length && (
        <span className="inline-block w-1.5 h-4 bg-neon-green ml-0.5 animate-pulse" />
      )}
    </div>
  );
};

const TerminalCLI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: '>>> ARUN_OS v4.0.0 :: INITIALIZING CORE...' },
    { type: 'system', content: '>>> HYBRID_CLI: STANDBY. TYPE "HELP" TO BEGIN.' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabMatches, setTabMatches] = useState([]);
  const [tabIndex, setTabIndex] = useState(-1);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const playSound = useCyberpunkSound();
  const { toggleMatrixMode, isMatrixMode } = useMatrix();

  const COMMANDS = useMemo(() => {
    const runGoto = (args) => {
        const arg = args[0]?.toLowerCase();
        if (!arg) return [{ type: 'info', content: 'USAGE: cd/goto <section> (e.g. skills, projects)' }];
        if (arg === '..') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return [{ type: 'system', content: 'Returning to core node (home)...' }];
        }
        const target = SECTION_ALIASES[arg] || arg;
        const el = document.getElementById(target);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return [{ type: 'system', content: `Navigating to [${target}]...` }];
        }
        return [{ type: 'error', content: `ERR_SECTION_NOT_FOUND: ${arg}` }];
    };

    const registry = {
      help: { desc: 'Show all available commands', run: () => [
        { type: 'header', content: '--- OS_AVAILABLE_PROTOCOLS ---' },
        ...Object.entries(registry).filter(([name]) => !['is', 'skill', 'project', 'cd', 'got', 'dir'].includes(name)).map(([name, cmd]) => ({
          type: 'response', content: `  ${name.padEnd(12)} :: ${cmd.desc}`
        })),
        { type: 'secondary', content: '* Hint: Try typing just the name of a section (e.g., "projects")' }
      ]},
      whoami: { desc: 'Show full profile dossier', run: () => [
        { type: 'header', content: `// SUBJECT: ${profile.name.toUpperCase()}` },
        { type: 'info', content: `ROLE: ${profile.role}` },
        { type: 'info', content: `LOCA: ${profile.location}` },
        { type: 'response', content: `BIOD: ${profile.summary}` },
        { type: 'link', content: `CONT: ${profile.email}` },
      ]},
      ls: { desc: 'List directory components', run: () => [
        { type: 'highlight', content: 'projects/  skills/  experience/  socials/  education/  contact/' }
      ]},
      is: { desc: 'Alias for ls', run: () => registry.ls.run() },
      dir: { desc: 'Alias for ls', run: () => registry.ls.run() },
      skills: { desc: 'Show categorized tech stack', run: () => [
          { type: 'header', content: '--- TECH_CAPABILITIES ---' },
          ...Object.entries(skills).map(([key, val]) => ({ type: 'response', content: `${key.toUpperCase()}: ${val.items.join(', ')}` }))
      ]},
      skill: { desc: 'Alias for skills', run: () => registry.skills.run() },
      projects: { desc: 'List all project IDs', run: () => [
        { type: 'header', content: '--- DEPLOYED_PROJECTS ---' },
        ...projects.map(p => ({ type: 'response', content: ` -> ${p.id.padEnd(12)} | ${p.title}` })),
        { type: 'info', content: 'TIP: type "project <id>" for full specs.' }
      ]},
      project: { desc: 'Show project specs [id]', run: (args) => {
          const id = args[0];
          const p = projects.find(proj => proj.id === id);
          if (p) {
              return [
                  { type: 'header', content: `// SPEC: ${p.title.toUpperCase()}` },
                  { type: 'highlight', content: `TECH: ${p.tech.join(', ')}` },
                  { type: 'response', content: `DESC: ${p.description}` },
                  ...p.points.map(pt => ({ type: 'secondary', content: ` - ${pt}` })),
                  { type: 'link', content: `LINK: ${p.links.demo || p.links.github || 'N/A'}` }
              ];
          }
          if (!id) return registry.projects.run();
          return [{ type: 'error', content: `ERR_PROJECT_NOT_FOUND: ${id}` }];
      }},
      edu: { desc: 'Show education credentials', run: () => [
          { type: 'header', content: '--- ACADEMIC_RECORDS ---' },
          { type: 'highlight', content: `DEGREE: ${education.degree}` },
          { type: 'response', content: `INST: ${education.institution}` },
          { type: 'secondary', content: `PERD: ${education.period}` },
          { type: 'secondary', content: `CRSW: ${education.coursework}` },
      ]},
      exp: { desc: 'Show professional experience', run: () => [
          { type: 'header', content: '--- PROFESSIONAL_CHRONOLOGY ---' },
          ...experiences.flatMap(e => [
              { type: 'highlight', content: `[${e.period}] ${e.role} @ ${e.company}` },
              ...e.description.map(d => ({ type: 'secondary', content: `   - ${d}` }))
          ])
      ]},
      cat: { desc: 'Examine [topic]', run: (args) => {
          const topic = args[0]?.toLowerCase();
          if (!topic) return [{ type: 'error', content: 'USAGE: cat <projects|skills|experience|education|contact>' }];
          if (registry[topic]) return registry[topic].run();
          if (topic === 'about') return registry.whoami.run();
          if (topic === 'contact') return [
              { type: 'header', content: '--- CONTACT_CHANNELS ---' },
              { type: 'link', content: `EMAIL: ${profile.email}` },
              { type: 'response', content: `PHON: ${profile.phone}` },
              { type: 'response', content: `LOCN: ${profile.location}` },
          ];
          return [{ type: 'error', content: `ERR_TOPIC_NULL: ${topic}` }];
      }},
      socials: { desc: 'List linked social nodes', run: () => [
          { type: 'header', content: '--- SOCIAL_NODES ---' },
          ...Object.entries(profile.social).map(([key, val]) => ({ type: 'link', content: `${key.toUpperCase()}: ${val}` }))
      ]},
      clear: { desc: 'Clear command buffer', run: () => { setHistory([]); return []; }},
      history: { desc: 'Show execution history', run: () => commandHistory.map((h, i) => ({ type: 'secondary', content: `${i + 1}. ${h}` })) },
      date: { desc: 'System timestamp', run: () => [{ type: 'system', content: `LOCAL_TIME: ${new Date().toLocaleString()}` }] },
      pwd: { desc: 'Print working directory', run: () => [{ type: 'secondary', content: '/users/arun/portfolio' }] },
      goto: { desc: 'Navigate to [section]', run: runGoto },
      cd: { desc: 'Alias for goto', run: runGoto },
      got: { desc: 'Alias for goto', run: runGoto },
      search: { desc: 'Query portfolio database', run: (args) => {
          const query = args.join(' ').toLowerCase();
          if (!query) return [{ type: 'error', content: 'USAGE: search <term>' }];
          const results = [
              ...projects.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.points.some(pt => pt.toLowerCase().includes(query))).map(p => `Project: ${p.title}`),
              ...Object.values(skills).flatMap(s => s.items).filter(sk => sk.toLowerCase().includes(query)).map(sk => `Skill: ${sk}`),
              ...experiences.filter(e => e.company.toLowerCase().includes(query) || e.role.toLowerCase().includes(query) || e.description.some(d => d.toLowerCase().includes(query))).map(e => `Experience: ${e.company}`)
          ].slice(0, 5);
          return results.length ? results.map(r => ({ type: 'highlight', content: `MATCH: ${r}` })) : [{ type: 'response', content: 'NO_MATCHES_FOUND' }];
      }},
      matrix: { desc: 'Toggle matrix environment', run: () => { toggleMatrixMode(); return [{ type: 'system', content: 'MATRIX_INFUSION_PROTOCOL: ACTIVATED' }]; }},
      open: { desc: 'Open [link]', run: (args) => {
          const target = args[0]?.toLowerCase();
          if (OPEN_ALIASES[target]) {
              window.open(OPEN_ALIASES[target].url, '_blank');
              return [{ type: 'system', content: `Opening ${target} in external node...` }];
          }
          return [{ type: 'error', content: `TARGET_UNRESOLVED: ${target || 'NULL'}` }];
      }},
      exit: { desc: 'Terminate session', run: () => { setIsOpen(false); return []; }}
    };
    return registry;
  }, [toggleMatrixMode, commandHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      playSound('glitch');
    }
  }, [isOpen, playSound]);

  const handleCommand = useCallback((val) => {
    const raw = val.trim();
    if (!raw) return;

    const [cmd, ...args] = raw.toLowerCase().split(' ');
    setHistory(prev => [...prev, { type: 'command', content: raw }]);
    setCommandHistory(prev => [...prev, raw]);
    setHistoryIndex(-1);

    if (COMMANDS[cmd]) {
      const output = COMMANDS[cmd].run(args);
      setHistory(prev => [...prev, ...output]);
      playSound('click');
    } else if (SECTION_ALIASES[cmd] || document.getElementById(cmd)) {
      // Direct navigation if section name matches
      const output = COMMANDS.goto.run([cmd]);
      setHistory(prev => [...prev, ...output]);
      playSound('click');
    } else {
      setHistory(prev => [...prev, { type: 'error', content: `COMMAND_UNRECOGNIZED: ${cmd}` }]);
    }
    setInput('');
  }, [COMMANDS, playSound]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleCommand(input);
        setTabMatches([]);
        setTabIndex(-1);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = historyIndex + 1;
        if (next < commandHistory.length) {
            const cmd = commandHistory[commandHistory.length - 1 - next];
            setInput(cmd);
            setHistoryIndex(next);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = historyIndex - 1;
        if (next >= 0) {
            const cmd = commandHistory[commandHistory.length - 1 - next];
            setInput(cmd);
            setHistoryIndex(next);
        } else {
            setInput('');
            setHistoryIndex(-1);
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const allCmds = Object.keys(COMMANDS);
        let matches = tabMatches;
        let newIdx = tabIndex;

        if (matches.length === 0) {
            matches = allCmds.filter(c => c.startsWith(input.toLowerCase()));
            setTabMatches(matches);
        }

        if (matches.length > 0) {
            newIdx = (newIdx + 1) % matches.length;
            setTabIndex(newIdx);
            setInput(matches[newIdx]);
        }
    } else {
        setTabMatches([]);
        setTabIndex(-1);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-[110] flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border-2 border-neon-green/40 bg-black/80 text-neon-green shadow-[0_0_20px_rgba(10,255,10,0.2)] transition-all hover:border-white hover:text-white group"
          >
            <Terminal className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 rounded-2xl bg-neon-green/5 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className={`fixed bottom-0 left-0 z-[110] flex flex-col overflow-hidden border-t-2 border-r-2 border-neon-green/50 bg-black/95 font-mono text-sm backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] crt-flicker ${
              isExpanded ? 'h-[90vh] w-full md:w-[850px]' : 'h-[60vh] md:h-[400px] w-full md:w-[700px]'
            } rounded-tr-2xl`}
          >
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none crt-scanlines opacity-30" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-neon-green/20 bg-neon-green/5 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-neon-green/50" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-green/70">
                    <Globe className="h-3 w-3 animate-spin-slow" />
                    USER@ARUN_OS:~
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-white/40 hover:text-white transition-colors">
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-red-500 transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div 
                ref={scrollRef}
                className="relative z-10 flex-1 overflow-y-auto p-6 scrollbar-none selection:bg-neon-green selection:text-black"
                onClick={() => inputRef.current?.focus()}
            >
              <AnimatePresence mode="popLayout">
                {history.map((entry, idx) => (
                    <TypedEntry 
                        key={`${idx}`}
                        content={entry.content}
                        type={entry.type}
                    />
                ))}
              </AnimatePresence>

              {/* Input Line */}
              <div className="mt-4 flex items-center gap-3">
                <span className="flex items-center gap-1 text-neon-blue font-bold">
                    <span className="text-[10px] opacity-50">PROMPT</span>
                    ➜
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  spellCheck="false"
                  autoComplete="off"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border-none bg-transparent py-1 text-white outline-none caret-neon-green placeholder:text-white/5"
                  placeholder='type "help" to list protocols...'
                  autoFocus
                />
              </div>
            </div>

            {/* Status Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-neon-green/10 bg-black px-5 py-2 text-[10px] text-neon-green/40 uppercase tracking-widest font-bold">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><HistoryIcon className="w-3 h-3"/> HSTRY: {commandHistory.length}</span>
                    <span className="flex items-center gap-1.5"><Command className="w-3 h-3"/> ENV: PORTFOLIO_V4</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isMatrixMode ? 'bg-neon-green' : 'bg-neon-blue'}`} />
                    {isMatrixMode ? 'MATRIX_ENABLED' : 'TERMINAL_STABLE'}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalCLI;
