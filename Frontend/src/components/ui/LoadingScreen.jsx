import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { preloadAllAssets } from '../../utils/assetLoader';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'revealing' | 'done'
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const isLoadedRef = useRef(false);
  // Use a ref so the RAF loop always reads the latest asset progress without stale closure
  const assetProgressRef = useRef(0);

  const LOAD_DURATION = 5000; // ms (Target 6 seconds)
  const REVEAL_DELAY = 400;

  useEffect(() => {
    // Create a single shared AudioContext and resume it on the first user interaction
    // to reliably bypass autoplay restrictions without leaking multiple contexts.
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = AudioCtxClass ? new AudioCtxClass() : null;
    const resumeAudioCtx = () => {
      if (audioCtx) audioCtx.resume().catch(() => {});
    };
    if (audioCtx) {
      // Attempt an immediate resume (succeeds when the page already had a gesture)
      resumeAudioCtx();
      window.addEventListener('click', resumeAudioCtx, { once: true });
      window.addEventListener('touchstart', resumeAudioCtx, { once: true });
      window.addEventListener('keydown', resumeAudioCtx, { once: true });
    }

    // Start preloading assets immediately
    preloadAllAssets((p) => {
      // Write directly to the ref so the RAF callback always reads the latest value
      assetProgressRef.current = p;
    }).then(() => {
      console.log('[LoadingScreen] Preload complete, setting isLoadedRef to true');
      isLoadedRef.current = true;
    });

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      // Calculate time-based progress
      const timeProgress = Math.min((elapsed / LOAD_DURATION) * 100, 100);
      
      // Combined progress: we follow the actual asset loading but don't finish before LOAD_DURATION
      // This ensures we reach 100% at either the end of the duration or when assets are done,
      // but we wait at least LOAD_DURATION.
      const currentProgress = isLoadedRef.current 
        ? Math.max(timeProgress, assetProgressRef.current) 
        : Math.min(timeProgress, 99); // Cap at 99 if assets aren't done

      setProgress(currentProgress);

      if (currentProgress < 100 || elapsed < LOAD_DURATION) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('revealing');
        setTimeout(() => {
          setPhase('done');
          setTimeout(() => onComplete(), 800);
        }, REVEAL_DELAY);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtx) {
        window.removeEventListener('click', resumeAudioCtx);
        window.removeEventListener('touchstart', resumeAudioCtx);
        window.removeEventListener('keydown', resumeAudioCtx);
        audioCtx.close().catch(() => {});
      }
    };
  }, []);


  // SVG circle params
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background GIF with Dynamic Energy Effects */}
      <motion.img
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/loader-video.gif"
        alt="Loading background"
        style={{
          filter: `brightness(${0.8 + (progress / 100) * 0.5}) contrast(${1 + (progress / 100) * 0.3})`,
          scale: 1 + (progress / 100) * 0.1,
          x: progress > 50 ? (Math.random() - 0.5) * (progress - 50) * 0.1 : 0,
          y: progress > 50 ? (Math.random() - 0.5) * (progress - 50) * 0.1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 10 }}
      />

      {/* Optimized Vignette overlay — lighter center for vibrancy */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Center content */}
      <div className="relative z-10 pt-10 flex flex-col items-center justify-center gap-2">
        {/* Frosted backdrop */}
        <div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            filter: 'blur(10px)',
          }}
        />
        {/* Circular progress ring */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          <svg
            width="180"
            height="180"
            className="absolute"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
            />
            {/* Outer glow arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.05s linear', filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.6))' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#00f3ff" />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage in center */}
          <motion.span
            className="font-mono text-3xl font-bold tracking-wider select-none"
            style={{
              color: '#ffffff',
              textShadow: '0 0 24px rgba(0,243,255,0.6), 0 0 48px rgba(0,243,255,0.3), 0 2px 8px rgba(0,0,0,0.9)',
            }}
            animate={phase === 'revealing' ? { opacity: 0, scale: 0.8 } : {}}
            transition={{ duration: 0.3 }}
          >
            {Math.floor(progress)}
            <span className="text-base font-normal text-white/60 ml-0.5">%</span>
          </motion.span>
        </div>

        {/* Name reveal after loading */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={
            phase === 'revealing' || phase === 'done'
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span
            className="font-mono text-xs tracking-[0.35em] uppercase"
            style={{
              color: 'rgba(255,255,255,0.8)',
              textShadow: '0 0 16px rgba(0,243,255,0.4), 0 2px 6px rgba(0,0,0,0.8)',
            }}
          >
            ARUN_OS v4.0
          </span>
        </motion.div>


      </div>

      {/* Top loading bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent z-10">
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #00f3ff, #a855f7, #00f3ff)',
            boxShadow: '0 0 12px rgba(0,243,255,0.5)',
            width: `${progress}%`,
            transition: 'width 0.05s linear',
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
