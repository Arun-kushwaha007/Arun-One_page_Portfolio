import { useRef, useState, useEffect } from 'react';
import { motion as Motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Github, Linkedin, Mail, Sparkles, Terminal, Shield } from 'lucide-react';
import DeviceMockup from './DeviceMockup';
import { profile } from '../data/portfolio';
import { useCursor } from '../context/CursorContext.jsx';

const AvatarSequence = () => {
    const [frame, setFrame] = useState(1);

    useEffect(() => {
        // Preload exactly 30 frames
        for (let i = 1; i <= 30; i++) {
            const img = new Image();
            img.src = `/assets/avatar/${String(i).padStart(2, '0')} - Edited.png`;
        }
        
        // 5 FPS (200ms per frame) to complete 30 frames in 6 seconds
        const interval = setInterval(() => {
            setFrame(prev => (prev >= 30 ? 1 : prev + 1));
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const currentImage = `/assets/avatar/${String(frame).padStart(2, '0')} - Edited.png`;

    return (
        <Motion.img 
            src={currentImage}
            alt={`Hero display sequence ${frame}`}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[1600px] h-auto mix-blend-screen scale-150 pointer-events-none"
            style={{ 
                WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
                maskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
                filter: 'contrast(1.15) brightness(1.05)'
            }}
        />
    );
};

const Hero = () => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const { setCursorType } = useCursor();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax & Transition values
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Magnetic button values (simplified for this implementation)
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden  md:px-20 selection:bg-neon-blue/30"
    >
      {/* Immersive Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-[0.10]" />
        
        {/* Subtle Glow Spheres */}
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-neon-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-neon-purple/5 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
                <Motion.div
                    style={{ y: yText, opacity: isMobile ? 1 : heroOpacity }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onMouseEnter={() => setCursorType('text')}
                    onMouseLeave={() => setCursorType('default')}
                >
                    {/* Available Status */}
                    <div className="flex items-center gap-3 mb-10">
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

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-8 cursor-default">
                        Design. Code. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
                          Engineering.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl mb-12">
                        {profile.hero.summary}
                    </p>

                    {/* Action Area */}
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <Motion.a
                            href={profile.hero.primaryCta.href}
                            style={{ x: xSpring, y: ySpring }}
                            onMouseMove={handleMagnetic}
                            onMouseLeave={resetMagnetic}
                            className="relative group px-10 py-5 bg-white text-black rounded-full overflow-hidden transition-all duration-300 transform active:scale-95 flex items-center gap-3"
                        >
                            <span className="relative z-10 font-bold uppercase tracking-widest text-xs">View My Work</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-neon-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Motion.a>

                        <a 
                            href={profile.hero.secondaryCta.href}
                            className="text-gray-400 hover:text-white font-mono text-xs tracking-[0.3em] uppercase transition-all flex items-center gap-3 group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform inline-block">Contact Me</span>
                            <div className="h-px w-8 bg-gray-800 transition-all group-hover:bg-neon-purple group-hover:w-12 ml-2" />
                        </a>
                    </div>
                </Motion.div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 relative">
                <Motion.div
                    style={{ opacity: isMobile ? 1 : heroOpacity }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full flex justify-center items-center pointer-events-none"
                >
                    {/* Avatar Frame Sequence */}
                    <div className="relative w-full flex justify-center">
                        <AvatarSequence />
                    </div>
                </Motion.div>
            </div>
        </div>
      </div>

      <Motion.a
        href="#about"
        style={{ opacity: isMobile ? 1 : heroOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-500 hover:text-white transition-colors"
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
