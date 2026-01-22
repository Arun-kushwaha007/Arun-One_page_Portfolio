import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [text, setText] = useState([]);
  const fullText = [
    "> INITIALIZING SYSTEM...",
    "> LOADING KERNEL MODULES...",
    "> MOUNTING VIRTUAL FILE SYSTEM...",
    "> CONNECTING TO NEURAL NET...",
    "> ACCESS GRANTED."
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(prev => [...prev, fullText[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-start justify-end p-8 md:p-16 font-mono"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-lg">
        {text.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-neon-green mb-2 text-sm md:text-base tracking-wider"
          >
            {line}
          </motion.div>
        ))}
        <motion.div
          className="w-3 h-5 bg-neon-green inline-block ml-2"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
      </div>

       {/* Loading Bar */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gray-900">
          <motion.div 
            className="h-full bg-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "linear" }}
          />
       </div>
    </motion.div>
  );
};

export default LoadingScreen;
