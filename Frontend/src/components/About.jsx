import { useState, useEffect } from 'react';
import { profile, education } from '../data/portfolio';
import { Section } from './ui/Section';
import { motion } from 'framer-motion';

const TerminalLine = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <div className="font-mono text-neon-green text-sm md:text-base mb-2">
      <span className="text-neon-purple mr-2">➜</span>
      <span className="text-neon-blue mr-2">~</span>
      {displayedText}
      <span className="animate-pulse">_</span>
    </div>
  );
};

const About = () => {
  return (
    <Section id="about" className="min-h-screen flex items-center">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        
        {/* Holographic Identity Module */}
        <motion.div 
          className="relative group perspective-1000 max-w-sm mx-auto w-full"
          onMouseMove={(e) => {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / 25;
            const y = (e.clientY - top - height / 2) / 25;
            e.currentTarget.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)';
          }}
          style={{ transition: 'transform 0.1s ease-out' }}
        >
          {/* Rotating Data Rings */}
          <div className="absolute inset-0 -m-8 border border-dashed border-neon-blue/30 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-0 -m-4 border border-dotted border-neon-purple/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* Main Tech Frame */}
          <div className="relative bg-black/80 border-2 border-neon-blue/50 p-2 clip-path-tech-frame backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.2)]">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green" />

            {/* Image Container */}
            <div className="relative overflow-hidden clip-path-tech-inner bg-gray-900">
              <img 
                src={profile.image} 
                alt="Profile" 
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
              />
              
              {/* Scanning Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,243,255,0.1)_50%)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/20 to-transparent translate-y-[-100%] group-hover:animate-scan pointer-events-none" />
              
              {/* Glitch Overlay */}
              <div className="absolute inset-0 bg-neon-blue/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* HUD Elements */}
            <div className="absolute -right-8 top-10 flex flex-col gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-12 h-1 bg-neon-blue/30 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-blue animate-pulse" style={{ width: `${Math.random() * 100}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Identity Label */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
            <div className="text-xs font-mono text-neon-blue tracking-[0.2em] mb-1">IDENTITY_VERIFIED</div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto" />
          </div>
        </motion.div>

        {/* Terminal Content */}
        <div className="bg-black/80 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-auto text-xs text-gray-500 font-mono">bash --login</div>
          </div>

          {/* Terminal Body */}
          <div className="space-y-4 min-h-[300px]">
            <TerminalLine text={`whoami`} delay={0} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pl-6 text-gray-300 font-mono text-base md:text-lg leading-relaxed mb-4"
            >
              "{profile.summary}"
            </motion.div>

            <TerminalLine text={`cat education.json`} delay={2000} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="pl-6 text-gray-300 font-mono text-base md:text-lg"
            >
              {`{`}
              <div className="pl-4">
                <div>"degree": "{education.degree}",</div>
                <div>"institution": "{education.institution}",</div>
                <div>"cgpa": "{education.cgpa}",</div>
                <div>"status": "Final Year"</div>
              </div>
              {`}`}
            </motion.div>

            <TerminalLine text={`./run_skills_analysis.sh`} delay={4000} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              className="pl-6 text-neon-green font-mono text-base md:text-lg"
            >
              [SUCCESS] Full-Stack Loaded...
              <br/>
              [SUCCESS] AI/ML Modules Active...
              <br/>
              [SUCCESS] DevOps Pipeline Ready...
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
