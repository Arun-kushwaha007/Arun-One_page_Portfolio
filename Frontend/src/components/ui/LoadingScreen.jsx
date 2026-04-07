import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'revealing' | 'done'
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const videoRef = useRef(null);

  const LOAD_DURATION = 3200; // ms
  const REVEAL_DELAY = 400;

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min((elapsed / LOAD_DURATION) * 100, 100);

      setProgress(pct);

      if (pct < 100) {
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
    };
  }, []);

  // Accelerate video playback as progress increases (0.5x → 4x)
  useEffect(() => {
    if (videoRef.current) {
      const speed = 0.5 + (progress / 100) * 3.5;
      videoRef.current.playbackRate = Math.min(speed, 4);
    }
  }, [progress]);

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
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/loader-video.mp4"
      />

      {/* Vignette overlay — darkens center for UI readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.6) 100%)',
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
