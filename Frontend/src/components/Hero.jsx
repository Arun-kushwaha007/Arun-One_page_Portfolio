import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '../data/portfolio';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import Hero3DObject from './Hero3DObject';
import { useRef } from 'react';
import { useCursor } from '../context/CursorContext.jsx';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const { setCursorType } = useCursor();

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yVisual = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      <div className="z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center pt-20 md:pt-0">
        
        {/* Text Content */}
        <div 
            className="text-left order-2 md:order-1 relative z-20"
            onMouseEnter={() => setCursorType('text')}
            onMouseLeave={() => setCursorType('default')}
        >
          <Motion.div 
            style={{ y: yText, opacity }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-lg md:text-2xl text-neon-green font-mono mb-2 md:mb-4">
              &lt;Hello_World /&gt;
            </h2>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold mb-4 md:mb-6 leading-tight">
              I am <br />
              <span className="glitch-text text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400" data-text={profile.name}>
                {profile.name}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-400 mb-6 md:mb-8 max-w-lg leading-relaxed">
              {profile.role} <br />
              <span className="text-neon-blue text-base md:text-lg">Building the future with code & AI.</span>
            </p>

            <div className="flex gap-4 md:gap-6">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 md:p-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-neon-blue transition-all group"
              >
                <Github className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-neon-blue" />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 md:p-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-neon-blue transition-all group"
              >
                <Linkedin className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-neon-blue" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="p-3 md:p-4 border border-white/20 rounded-full hover:bg-white/10 hover:border-neon-blue transition-all group"
              >
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-neon-blue" />
              </a>
            </div>
          </Motion.div>
        </div>

        {/* 3D/Visual Element Placeholder (or Image) */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end relative h-[300px] md:h-auto z-10">
          <Motion.div
            style={{ y: yVisual, opacity }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full flex items-center justify-center"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <Hero3DObject />
          </Motion.div>
        </div>
      </div>

      <Motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
      </Motion.div>
    </section>
  );
};

export default Hero;
