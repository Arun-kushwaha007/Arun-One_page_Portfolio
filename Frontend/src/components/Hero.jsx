import { useRef, useState, useEffect, useCallback } from 'react';
import { motion as Motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Terminal, Shield } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useCursor } from '../context/CursorContext.jsx';

import { assetCache } from '../utils/assetLoader';

// ─────────────────────────────────────────────────────────────
// AboutAvatar: Simple 36-50 loop from avatar-move set ONLY
// ─────────────────────────────────────────────────────────────
export const AboutAvatar = ({ isVisible = false }) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(35); // start at index 35 = frame 36
  const [isReady, setIsReady] = useState(false);

  const draw = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas || !assetCache.heroMove[index]) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assetCache.heroMove[index], 0, 0, canvas.width, canvas.height);
  }, []);

  // Reactive check for assets
  useEffect(() => {
    const handleReady = () => {
      if (assetCache.isLoaded || assetCache.heroMove.length > 0) {
        setIsReady(true);
        draw(35);
      }
    };

    handleReady();
    assetCache.listeners.push(handleReady);
    return () => {
      assetCache.listeners = assetCache.listeners.filter(l => l !== handleReady);
    };
  }, [draw]);

  // Loop frames 36-50 (indices 35-49)
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      frameRef.current = frameRef.current >= 49 ? 35 : frameRef.current + 1;
      draw(frameRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isReady, draw]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={1200}
      className="w-full h-auto object-cover transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        filter: 'contrast(1.15) brightness(1.05)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)',
        maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)',
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// HeroAvatar: Full lifecycle (idle loop → scroll scrub + move)
// Uses viewport-relative positioning so the path is consistent
// across ALL screen sizes (14", 16", ultrawide, etc.)
// ─────────────────────────────────────────────────────────────
const HeroAvatar = ({ scrollYProgress }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const frameRef = useRef(0); // current hero loop frame index
  const intervalRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const drawHero = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas || !assetCache.heroIdle[index]) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assetCache.heroIdle[index], 0, 0, canvas.width, canvas.height);
  }, []);

  const drawMove = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas || !assetCache.heroMove[index]) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assetCache.heroMove[index], 0, 0, canvas.width, canvas.height);
  }, []);

  // Reactive check for assets
  useEffect(() => {
    const handleReady = () => {
      if (assetCache.isLoaded || assetCache.heroIdle.length > 0) {
        setIsReady(true);
        drawHero(0);
      }
    };

    handleReady();
    assetCache.listeners.push(handleReady);
    return () => {
      assetCache.listeners = assetCache.listeners.filter(l => l !== handleReady);
    };
  }, [drawHero]);

  // ── Hero idle loop (30 frames) ──
  const startLoop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % 30;
      drawHero(frameRef.current);
    }, 100);
  }, [drawHero]);

  const stopLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start loop when ready and not scrolling
  useEffect(() => {
    if (isReady && !isScrolling) {
      startLoop();
    }
    return () => stopLoop();
  }, [isReady, isScrolling, startLoop, stopLoop]);

  // ── Scroll detection + Move frame scrubbing ──
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isReady) return;

    if (v < 0.01) {
      // At top → hero idle loop
      if (isScrolling) setIsScrolling(false);
    } else {
      // Scrolling → stop hero loop, scrub move frames
      if (!isScrolling) setIsScrolling(true);
      
      // Map scroll 0.01→1.0 to move frames 0→49
      const moveFrame = Math.min(49, Math.floor((v / 1.0) * 50));
      drawMove(moveFrame);
    }
  });

  // ── Responsive travel-distance calculation ──
  // Dynamically measure where the avatar needs to travel from hero → about profile card
  // This ensures consistent positioning across ALL screen sizes
  const [isMobile, setIsMobile] = useState(false);
  const [travelY, setTravelY] = useState({ mid: 400, end: 930 });
  const [travelX, setTravelX] = useState({ mid: 30, end: 25 });
  const [travelScale, setTravelScale] = useState({ s1: 0.7, s2: 0.35, s3: 0.45 });

  useEffect(() => {
    const calculatePath = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 1024;
      setIsMobile(mobile);

      if (mobile) {
        // Mobile: stacked layout, shorter Y travel, no X drift
        setTravelY({ mid: vh * 0.35, end: vh * 0.65 });
        setTravelX({ mid: 0, end: 0 });
        setTravelScale({ s1: 0.95, s2: 0.92, s3: 0.87 });
        return;
      }

      // ── Desktop: dynamically measure start → end positions ──
      const heroAvatar = wrapperRef.current;
      const aboutCard = document.querySelector('[data-avatar-target="profile-card"]');
      
      if (heroAvatar && aboutCard) {
        const heroRect = heroAvatar.getBoundingClientRect();
        const aboutRect = aboutCard.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Calculate actual pixel distance from hero avatar center to about card center
        const heroCenterY = heroRect.top + scrollTop + heroRect.height / 2;
        const aboutCenterY = aboutRect.top + scrollTop + aboutRect.height / 2;
        const heroCenterX = heroRect.left + heroRect.width / 2;
        const aboutCenterX = aboutRect.left + aboutRect.width / 2;

        const deltaY = aboutCenterY - heroCenterY;
        const deltaX = aboutCenterX - heroCenterX;

        // The avatar path follows a smooth curve from hero→about
        // Mid-point is ~50% of the journey
        setTravelY({ mid: deltaY * 0.5, end: deltaY * 0.95 });
        setTravelX({ mid: deltaX * 0.3, end: deltaX * 0.7 });
      } else {
        // Fallback: use viewport-relative values that scale with screen size
        // These use vh/vw proportions instead of hardcoded pixels
        setTravelY({ mid: vh * 0.4, end: vh * 0.75 });
        setTravelX({ mid: vw * 0.025, end: vw * 0.025 });
      }

      // Scale down proportionally — larger screens need slightly larger end scale
      // because the about card is physically larger
      const scaleFactor = Math.max(0.8, Math.min(1, vw / 1536));
      setTravelScale({
        s1: 0.7 * scaleFactor,
        s2: 0.5 * scaleFactor,
        s3: 0.35 * scaleFactor,
      });
    };

    // Initial calculation + debounced recalculation on resize
    calculatePath();
    // Recalculate after a short delay to ensure DOM is fully rendered
    const initTimer = setTimeout(calculatePath, 500);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculatePath, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      clearTimeout(initTimer);
    };
  }, []);

  // ── Scroll-driven positioning using dynamic values ──
  const avatarY = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    isMobile ? [0, travelY.mid, travelY.end] : [0, travelY.mid, travelY.end]
  );
  const avatarX = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    isMobile ? [0, 0, 0] : [0, travelX.mid, travelX.end]
  );
  const avatarScale = useTransform(
    scrollYProgress, 
    [0, 0.5, 0.8, 1], 
    isMobile ? [1, 0.95, 0.92, 0.87] : [1, travelScale.s1, travelScale.s2, travelScale.s3]
  );
  const avatarOpacity = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.5, 0.7, 0.85] : [0, 0.7, 0.85, 1], 
    [1, 1, 0.5, 0]
  );

  return (
    <Motion.div
      ref={wrapperRef}
      style={{
        y: avatarY,
        x: avatarX,
        scale: avatarScale,
        opacity: avatarOpacity,
      }}
      className="relative w-full flex justify-center z-50"
    >
      {!isReady && (
        <div className="absolute inset-0 bg-neon-blue/10 animate-pulse blur-3xl rounded-full scale-50" />
      )}
      <canvas
        ref={canvasRef}
        width={1200}
        height={1200}
        className="w-full max-w-[1600px] h-auto mix-blend-screen md:scale-150 pointer-events-none"
        style={{
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 75%)',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 75%)',
          filter: isReady ? 'contrast(1.15) brightness(1.05)' : 'contrast(1) brightness(0.5) grayscale(1)',
        }}
      />
    </Motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const { setCursorType } = useCursor();

  // Parallax & Transition values
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Magnetic button
  const xSpring = useSpring(0, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMagnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    xSpring.set(x * 0.35);
    ySpring.set(y * 0.35);
  };

  const resetMagnetic = () => {
    xSpring.set(0);
    ySpring.set(0);
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-y-visible z-30 px-4 md:px-20 selection:bg-neon-blue/30"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-[0.10]" />
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-neon-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-neon-purple/5 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
                <Motion.div
                    style={{ y: yText }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onMouseEnter={() => setCursorType('text')}
                    onMouseLeave={() => setCursorType('default')}
                >
                    {/* Available Status */}
                    <div className="flex items-center gap-3 mb-6 md:mb-10">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
                                Status: Building the Future
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-4 md:mb-8 cursor-default">
                        Design. Code. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
                          Engineering.
                        </span>
                    </h1>

                    <p className="text-md md:text-xl text-gray-400 font-light leading-relaxed max-w-xl mb-6 md:mb-12">
                        {profile.hero.summary}
                    </p>

                    {/* Action Area */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                        <Motion.a
                            href={profile.hero.primaryCta.href}
                            style={{ x: xSpring, y: ySpring }}
                            onMouseMove={handleMagnetic}
                            onMouseLeave={resetMagnetic}
                            className="relative group px-4 py-2 md:px-10 md:py-5 bg-white text-black rounded-full overflow-hidden transition-all duration-300 transform active:scale-95 flex items-center gap-3"
                        >
                            <span className="relative z-10 font-bold uppercase tracking-widest text-[10px] md:text-xs">View My Work</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-neon-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Motion.a>

                        <a 
                            href={profile.hero.secondaryCta.href}
                            className="text-gray-400 hover:text-white font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all flex items-center gap-3 group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform inline-block">Contact Me</span>
                            <div className="h-px w-8 bg-gray-800 transition-all group-hover:bg-neon-purple group-hover:w-12 ml-2" />
                        </a>
                    </div>
                </Motion.div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 relative -mt-20 md:mt-0">
                <Motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full flex justify-center items-center pointer-events-none"
                >
                    <HeroAvatar scrollYProgress={scrollYProgress} />
                </Motion.div>
            </div>
        </div>
      </div>

      <Motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden absolute  md:bottom-12 left-1/2 -translate-x-1/2 md:flex flex-col items-center gap-3 text-gray-500 hover:text-white transition-colors"
      >
        <span className="text-[10px] uppercase font-mono tracking-[0.4em] vertical-text">Explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gray-700 to-transparent relative">
            <Motion.div 
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-[-1.5px] w-[4px] h-[4px] bg-neon-blue rounded-full shadow-[0_0_8px_rgba(0,243,255,0.8)]"
            />
        </div>
      </Motion.a>
    </section>
  );
};

export default Hero;
