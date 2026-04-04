import { useRef } from 'react';
import { motion as Motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, Code2, Globe } from 'lucide-react';
import { projects } from '../data/portfolio';

const featuredProject =
  projects.find((project) => project.id === 'collabnest') ?? projects[0];

const DeviceMockup = () => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const rotateX = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 100, damping: 20 });

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(((event.clientX - centerX) / rect.width) * 15);
    mouseY.set(((centerY - event.clientY) / rect.height) * 15);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Motion.div
      ref={containerRef}
      style={{ scale, rotate, opacity }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="relative w-full max-w-[600px] perspective-2000"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-10 bg-gradient-to-br from-neon-blue/20 via-transparent to-neon-purple/20 blur-3xl opacity-50 animate-pulse" />

      <Motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-[2.5rem] border border-white/20 bg-[#080808] p-2 shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Inner Content with Z-Translation for Depth */}
        <div 
          style={{ transform: 'translateZ(50px)' }}
          className="relative rounded-[2rem] bg-[#111] overflow-hidden border border-white/10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#151515] border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
              <Code2 className="w-3 h-3 text-neon-blue" />
              <span className="text-[10px] font-mono text-gray-400">production.arun.dev</span>
            </div>
          </div>

          {/* Project Preview */}
          <div className="relative aspect-[16/10] overflow-hidden group">
            <img
              src={featuredProject.image}
              alt={featuredProject.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Project Overlays */}
            <div className="absolute inset-x-0 bottom-0 p-8 transform translate-z-40">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 bg-neon-blue text-black text-[10px] font-black rounded uppercase tracking-wider">Project</span>
                <span className="text-white/40 font-mono text-xs">/ {featuredProject.id}</span>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                {featuredProject.title}
              </h3>
            </div>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default DeviceMockup;
