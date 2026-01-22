import { useEffect } from 'react';
import { motion as Motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCursor } from '../../context/CursorContext.jsx';

const CustomCursor = () => {
  const { cursorType, setCursorType } = useCursor();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      // Auto-detect clickable elements if not manually overridden
      if (cursorType === 'default') {
        const target = e.target;
        if (
            target.tagName === 'A' || 
            target.tagName === 'BUTTON' || 
            target.closest('a') || 
            target.closest('button') ||
            target.closest('.cursor-pointer')
        ) {
            setCursorType('button');
        } 
      }
    };
    
    const handleMouseOut = () => {
        if (cursorType === 'button') {
            setCursorType('default');
        }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, cursorType, setCursorType]);

  const variants = {
    default: {
      height: 16,
      width: 16,
      backgroundColor: "#00f3ff", // neon-blue
      x: -8,
      y: -8,
      mixBlendMode: "difference"
    },
    button: {
      height: 64,
      width: 64,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid #00f3ff",
      x: -32,
      y: -32,
      mixBlendMode: "normal"
    },
    text: {
      height: 32,
      width: 4,
      backgroundColor: "#bc13fe", // neon-purple
      x: -2,
      y: -16,
      borderRadius: 0,
      mixBlendMode: "difference"
    },
    project: {
        height: 100,
        width: 100,
        backgroundColor: "rgba(0, 243, 255, 0.1)",
        border: "1px solid rgba(0, 243, 255, 0.5)",
        x: -50,
        y: -50,
        mixBlendMode: "normal"
    }
  };

  return (
    <>
      <Motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center backdrop-blur-sm"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        variants={variants}
        animate={cursorType}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
          <AnimatePresence>
            {cursorType === 'project' && (
                <Motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-neon-blue font-mono text-xs font-bold"
                >
                    VIEW
                </Motion.span>
            )}
            {cursorType === 'button' && (
                <Motion.div
                    layoutId="cursor-ring"
                    className="absolute inset-0 border border-neon-blue rounded-full opacity-50"
                    animate={{ scale: [1, 1.2, 1] }} // Pulse
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            )}
          </AnimatePresence>
      </Motion.div>
      
      {/* Secondary trailing dot */}
      {cursorType === 'default' && (
          <Motion.div 
            className="fixed top-0 left-0 w-2 h-2 bg-neon-purple rounded-full pointer-events-none z-[9999]"
            style={{
                translateX: cursorX,
                translateY: cursorY,
                x: -1,
                y: -1
            }}
            transition={{ type: "spring", mass: 0.1 }}
          />
      )}
    </>
  );
};

export default CustomCursor;
