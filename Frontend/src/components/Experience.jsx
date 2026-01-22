import { useRef } from 'react';
import { experiences } from '../data/portfolio';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import GlitchText from './ui/GlitchText';

const ExperienceCard = ({ exp, index }) => {
  return (
    <div className="relative w-[80vw] md:w-[600px] flex-shrink-0 p-8 border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl group overflow-hidden">
       {/* Cyberpunk Decor */}
       <div className="absolute top-0 right-0 p-4 opacity-50">
          <div className="w-20 h-20 border-t-2 border-r-2 border-neon-purple rounded-tr-2xl" />
       </div>
       <div className="absolute bottom-0 left-0 p-4 opacity-50">
          <div className="w-20 h-20 border-b-2 border-l-2 border-neon-blue rounded-bl-2xl" />
       </div>

       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

       <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
             <div>
                <span className="text-neon-blue font-mono text-xs tracking-[0.2em] mb-2 block">
                  MISSION_ID: 00{index + 1}
                </span>
                <GlitchText text={exp.role} className="text-2xl md:text-3xl font-bold text-white mb-2" />
                <div className="text-neon-purple font-mono text-lg">@{exp.company}</div>
             </div>
             <div className="text-right">
                <div className="px-3 py-1 border border-neon-green/30 bg-neon-green/10 rounded text-neon-green font-mono text-sm shadow-[0_0_10px_rgba(10,255,10,0.2)]">
                   {exp.period}
                </div>
             </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

          <ul className="space-y-4">
             {exp.description.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-gray-300 font-mono text-sm leading-relaxed">
                   <span className="text-neon-blue mt-1">>></span>
                   {item}
                </li>
             ))}
          </ul>
       </div>
    </div>
  );
};

const Experience = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  
  // Parallax elements
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={targetRef} id="experience" className="relative h-[300vh] bg-black">
       <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          
          {/* Background visuals */}
          <motion.div style={{ x: bgX }} className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-1/4 left-0 w-[40vw] h-px bg-neon-purple shadow-[0_0_20px_#bc13fe]" />
             <div className="absolute bottom-1/3 right-0 w-[60vw] h-px bg-neon-blue shadow-[0_0_20px_#00f3ff]" />
          </motion.div>

          {/* Section Title - Fixed then moves */}
          <motion.div style={{ x: titleX }} className="px-8 md:px-24 mb-12 relative z-10">
             <h2 className="text-6xl md:text-9xl font-bold opacity-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-transparent">
                TIMELINE
             </h2>
             <div className="absolute top-1/2 left-8 md:left-24 -translate-y-1/2">
                <h3 className="text-3xl md:text-5xl font-bold text-white">
                   <span className="text-neon-green mr-4">>>></span>
                   Carrier Trajectory
                </h3>
             </div>
          </motion.div>

          {/* Horizontal Scroll Container */}
          <motion.div style={{ x }} className="flex gap-12 px-8 md:px-24 w-max items-center">
             
             {/* Start Node */}
             <div className="w-[300px] flex-shrink-0 text-gray-500 font-mono text-sm">
                <div className="w-4 h-4 bg-neon-green rounded-full shadow-[0_0_15px_#0aff0a] mb-4" />
                <p>INITIALIZING_CAREER_PATH...</p>
             </div>

             {experiences.map((exp, index) => (
                <div key={exp.id} className="relative group">
                   {/* Connector Line */}
                   <div className="absolute top-1/2 -left-12 w-12 h-px bg-white/20" />
                   
                   <ExperienceCard exp={exp} index={index} />
                </div>
             ))}

             {/* Future Node */}
             <div className="w-[400px] flex-shrink-0 flex items-center justify-center p-12 border border-dashed border-white/20 rounded-2xl bg-white/5 mx-12">
                <div className="text-center">
                   <div className="inline-block px-4 py-2 border border-neon-blue text-neon-blue font-mono mb-4 animate-pulse">
                      LOADING_NEXT_CHAPTER...
                   </div>
                   <p className="text-gray-400 text-sm">Open for Senior Roles & Leadership Opportunities</p>
                </div>
             </div>

          </motion.div>
       </div>
    </section>
  );
};

export default Experience;
