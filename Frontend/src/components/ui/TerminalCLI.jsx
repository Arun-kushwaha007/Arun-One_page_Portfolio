import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minus } from 'lucide-react';
import useCyberpunkSound from '../../hooks/useCyberpunkSound';
import { useMatrix } from '../../context/MatrixContext';

const TerminalCLI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to ARUN_OS v2.0.45' },
    { type: 'system', content: 'Type "help" for available commands.' },
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const playSound = useCyberpunkSound();
  const { toggleMatrixMode } = useMatrix();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(' ');
    const command = args[0];

    let response = null;

    switch (command) {
      case 'help':
        response = [
          'Available commands:',
          '  help        - Show this help message',
          '  clear       - Clear terminal history',
          '  whoami      - Display user info',
          '  goto [loc]  - Scroll to section (hero, about, exp, projects, skills, contact)',
          '  matrix      - Toggle Matrix mode',
          '  date        - Show current system time',
        ];
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        response = 'Arun Kushwaha | Full-Stack Developer | DevOps Enthusiast';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'matrix':
        toggleMatrixMode();
        response = 'Toggling Matrix Mode...';
        break;
      case 'goto':
        if (args[1]) {
          const section = document.getElementById(args[1]);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            response = `Navigating to ${args[1]}...`;
          } else {
            response = `Error: Location "${args[1]}" not found.`;
          }
        } else {
          response = 'Usage: goto [section_id]';
        }
        break;
      case '':
        break;
      default:
        response = `Command not found: ${command}. Type "help" for list.`;
    }

    if (response) {
      if (Array.isArray(response)) {
        response.forEach(line => {
          setHistory(prev => [...prev, { type: 'response', content: line }]);
        });
      } else {
        setHistory(prev => [...prev, { type: 'response', content: response }]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    playSound('type');
    setHistory(prev => [...prev, { type: 'command', content: input }]);
    handleCommand(input);
    setInput('');
  };

  return (
    <>
      {/* Toggle Button (Visible when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              playSound('click');
            }}
            className="fixed bottom-4 left-4 z-50 p-3 bg-black/80 border border-neon-green/50 text-neon-green rounded-full hover:bg-neon-green/20 transition-all shadow-[0_0_15px_rgba(10,255,10,0.3)]"
          >
            <Terminal className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full md:w-[600px] h-[300px] bg-black/90 border-t-2 border-r-2 border-neon-green/50 rounded-tr-xl z-50 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden font-mono text-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-neon-green/10 border-b border-neon-green/30">
              <div className="flex items-center gap-2 text-neon-green">
                <Terminal className="w-4 h-4" />
                <span className="font-bold tracking-wider">TERMINAL_CLI</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="text-neon-green hover:text-white">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-neon-green hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-green/30 scrollbar-track-transparent"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((entry, i) => (
                <div key={i} className={`mb-1 ${entry.type === 'command' ? 'text-white' : 'text-neon-green/80'}`}>
                  {entry.type === 'command' && <span className="text-neon-blue mr-2">➜ ~</span>}
                  {entry.content}
                </div>
              ))}
              
              {/* Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                <span className="text-neon-blue">➜ ~</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
                  autoFocus
                />
              </form>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalCLI;
