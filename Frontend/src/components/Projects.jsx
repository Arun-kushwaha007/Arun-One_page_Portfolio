import { useRef } from 'react';
import { projects } from '../data/portfolio';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

const CinematicCard = ({ project }) => {
  return (
    <div className="group relative w-[85vw] md:w-[800px] h-[500px] flex-shrink-0 bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-neon-blue/50 transition-all duration-500">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex flex-col h-full md:flex-row">
        
        {/* Image Section (60%) */}
        <div className="h-1/2 md:h-full md:w-3/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-900 animate-pulse z-0" /> {/* Loading state bg */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Tech Overlay on Image */}
          <div className="absolute bottom-4 left-4 z-20 flex gap-2">
             <div className="px-2 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded text-xs font-mono text-neon-blue">
                // {project.tech[0]}
             </div>
          </div>
        </div>

        {/* Content Section (40%) - The "Glass Panel" */}
        <div className="h-1/2 md:h-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center relative bg-black/20 md:bg-transparent">
           {/* Decorative Lines */}
           <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-white/10 rounded-tr-2xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-white/10 rounded-bl-2xl opacity-50" />

           <div className="mb-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-neon-blue transition-colors">
                {project.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.slice(0, 4).map(t => (
                  <span key={t} className="text-xs font-mono text-gray-500 border border-white/5 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
                {project.description}
              </p>
           </div>

           {/* Action Area */}
           <div className="flex items-center gap-6 mt-6 md:mt-0 pt-6 border-t border-white/5">
              <div className="flex gap-4">
                 {project.links.github && (
                   <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white hover:text-neon-green transition-colors">
                     <Github className="w-4 h-4" /> SOURCE
                   </a>
                 )}
                 {project.links.demo && (
                   <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white hover:text-neon-blue transition-colors">
                     <ExternalLink className="w-4 h-4" /> LIVE
                   </a>
                 )}
              </div>
              
              <div className="ml-auto w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-neon-blue group-hover:border-neon-blue transition-all">
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-black -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const Projects = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Smooth scroll physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to horizontal translation
  const x = useTransform(scaleX, [0, 1], ["0%", "-85%"]);
  
  // Parallax for text
  const titleX = useTransform(scaleX, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <section ref={targetRef} id="projects" className="relative h-[300vh] bg-black/20">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full mix-blend-screen" />
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        {/* Content Rail */}
        <motion.div style={{ x }} className="flex gap-12 px-6 md:px-24 w-max items-center">
          
          {/* Introduction Card */}
          <div className="w-[85vw] md:w-[600px] h-[500px] flex-shrink-0 flex flex-col justify-center px-4 md:px-0">
             <motion.div style={{ x: titleX, opacity }}>
                <h2 className="text-5xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple leading-none">
                  SELECTED <br /> WORKS
                </h2>
                <div className="h-1 w-24 bg-neon-green mb-6" />
                <p className="text-xl text-gray-400 max-w-md font-light leading-relaxed">
                  A collection of advanced web applications, system designs, and AI integrations.
                  <span className="block mt-4 text-sm font-mono text-neon-blue">
                    // DRAG_OR_SCROLL_TO_EXPLORE
                  </span>
                </p>
             </motion.div>
          </div>

          {/* Project List */}
          {projects.map((project) => (
             <CinematicCard key={project.id} project={project} />
          ))}

          {/* End Card */}
           <div className="w-[85vw] md:w-[400px] h-[500px] flex-shrink-0 flex flex-col justify-center items-center text-center">
              <h3 className="text-4xl font-bold text-gray-700 mb-4">MORE COMING SOON</h3>
              <p className="text-gray-500 font-mono text-sm">// SYSTEM_UPGRADE_PENDING</p>
           </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
