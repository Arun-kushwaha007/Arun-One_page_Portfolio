import React, { useEffect, useRef } from 'react';
import { useMatrix } from '../../context/MatrixContext';

const MatrixRain = () => {
  const canvasRef = useRef(null);
  const { isMatrixMode } = useMatrix();

  useEffect(() => {
    if (!isMatrixMode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      // Darker fade for trails (higher opacity black = faster fade/darker bg)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Standard green
      ctx.font = fontSize + 'px monospace';
      
      // Reduced glow effect
      ctx.shadowBlur = 2;
      ctx.shadowColor = '#0F0';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        
        // Fewer bright characters
        if (Math.random() > 0.99) {
           ctx.fillStyle = '#BBF'; // Slightly muted white
        } else {
           // Darker green for standard characters
           ctx.fillStyle = '#0a440a'; 
        }

        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      // Reset shadow for performance
      ctx.shadowBlur = 0;
      
      animationFrameId = requestAnimationFrame(draw);
    };

    let animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMatrixMode]);

  if (!isMatrixMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[60] opacity-30 mix-blend-screen"
    />
  );
};

export default MatrixRain;
