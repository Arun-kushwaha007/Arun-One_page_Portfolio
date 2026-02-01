import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '../data/portfolio';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import DeviceMockup from './DeviceMockup';
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
            className="relative"
          >
            <div className="absolute -top-10 -left-6 opacity-40 flex gap-2 pointer-events-none">
              <span className="text-[10px] font-mono py-1 px-2 border border-white/20 bg-white/5 text-white">UNIT_H01</span>
              <span className="text-[10px] font-mono py-1 px-2 border border-white/20 bg-white/5 text-white">CORE_TEMP:OPTIMAL</span>
            </div>

            <h2 className="text-lg md:text-2xl text-neon-green font-mono mb-2 md:mb-4 drop-shadow-[0_0_10px_rgba(10,255,10,0.3)]">
              &lt;Hello_World /&gt;
            </h2>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold mb-4 md:mb-6 leading-tight neo-shadow-purple bg-black p-2 -ml-2 inline-block">
              I am <br />
              <span className="glitch-text text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400" data-text={profile.name}>
                {profile.name}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-400 mb-6 md:mb-8 max-w-lg leading-relaxed border-l-2 border-neon-blue pl-4 py-2">
              {profile.role} <br />
              <span className="text-neon-blue text-base md:text-lg">Building the future with code & AI.</span>
            </p>

            <div className="flex gap-4 md:gap-6">
              {[
                { icon: Github, href: profile.social.github, label: "GITHUB" },
                { icon: Linkedin, href: profile.social.linkedin, label: "LINKEDIN" },
                { icon: Mail, href: `mailto:${profile.email}`, label: "EMAIL" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group p-3 md:p-4 rounded-xl liquid-glass transition-all duration-300 hover:scale-110 neo-shadow overflow-hidden"
                >
                  <div className="absolute inset-0 bg-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <social.icon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-neon-blue relative z-10" />
                </a>
              ))}
            </div>
          </Motion.div>
        </div>

        {/* 3D Device Mockup */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end relative h-[350px] md:h-[500px] z-10 w-full">
          <DeviceMockup />
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
