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
        
        {/* Holographic Avatar / Visual */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-black/50 border border-neon-blue/30 rounded-2xl p-2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/50 shadow-[0_0_10px_#00f3ff] animate-scan" />
            <img 
              src={profile.image} 
              alt="Profile" 
              className="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            
            {/* HUD Overlay */}
            <div className="absolute bottom-4 left-4 font-mono text-xs text-neon-blue">
              <div>ID: AK-2025</div>
              <div>STATUS: AVAILABLE</div>
            </div>
          </div>
        </div>

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
              className="pl-6 text-gray-300 font-mono text-sm leading-relaxed mb-4"
            >
              "{profile.summary}"
            </motion.div>

            <TerminalLine text={`cat education.json`} delay={2000} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="pl-6 text-gray-300 font-mono text-sm"
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
              className="pl-6 text-neon-green font-mono text-sm"
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
