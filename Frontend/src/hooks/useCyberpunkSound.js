import { useCallback, useRef, useEffect } from 'react';

const useCyberpunkSound = () => {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Initialize AudioContext lazily
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback((type = 'hover') => {
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      // High pitched short blip
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
    } else if (type === 'click') {
      // Deeper confirmation sound
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } else if (type === 'type') {
      // Very short click for typing
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(600, now);
      gainNode.gain.setValueAtTime(0.02, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      oscillator.start(now);
      oscillator.stop(now + 0.03);
    } else if (type === 'glitch') {
      // Random noise burst
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(100, now);
      oscillator.frequency.linearRampToValueAtTime(1000, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
    }
  }, []);

  return playSound;
};

export default useCyberpunkSound;
