import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCyberpunkSound from '../../hooks/useCyberpunkSound';

const GlitchChaos = ({ triggered, onComplete }) => {
  const playSound = useCyberpunkSound();
  const [text, setText] = useState("SYSTEM OVERRIDE");

  useEffect(() => {
    if (triggered) {
      playSound('glitch');
      
      // Chaos sequence
      const texts = ["SYSTEM OVERRIDE", "ACCESS GRANTED", "GOD MODE ENABLED", "WELCOME NEO"];
      let i = 0;
      
      const interval = setInterval(() => {
        setText(texts[i % texts.length]);
        i++;
        playSound('type');
      }, 800);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        onComplete();
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [triggered, playSound, onComplete]);

  if (!triggered) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden pointer-events-none"
      >
        {/* Glitch Layers */}
        <div className="absolute inset-0 bg-red-500/20 animate-pulse mix-blend-overlay" />
        <div className="absolute inset-0 bg-blue-500/20 animate-ping mix-blend-overlay" />
        
        {/* Random Noise */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-screen" />

        <motion.h1
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: [1, 1.2, 0.9, 1.5], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="text-6xl md:text-9xl font-bold text-white font-mono text-center glitch-text relative z-10"
          data-text={text}
        >
          {text}
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlitchChaos;
