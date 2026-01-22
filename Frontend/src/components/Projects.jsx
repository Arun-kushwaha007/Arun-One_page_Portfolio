import { useRef } from 'react';
import { projects } from '../data/portfolio';
import { motion as Motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useCursor } from '../context/CursorContext.jsx';

const ProjectCard = ({ project, index, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });
  const { setCursorType } = useCursor();

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  
  // Crazy rotation based on scroll velocity
  const scrollVelocity = useVelocity(scrollYProgress);
  const skew = useSpring(useTransform(scrollVelocity, [-1, 1], [-10, 10]), {
    mass: 0.1, stiffness: 200, damping: 10
  });

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
      <Motion.div 
        style={{ scale, skewX: skew, rotateX: skew, top: `calc(${index * 25}px)` }} 
        className="relative flex flex-col md:flex-row h-[70vh] w-full max-w-7xl rounded-3xl bg-black border border-white/10 overflow-hidden origin-top shadow-2xl"
      >
        
        {/* Project Image Area (60%) */}
        <div 
            className="md:w-[60%] h-1/2 md:h-full relative overflow-hidden group cursor-none"
            onMouseEnter={() => setCursorType('project')}
            onMouseLeave={() => setCursorType('default')}
        >
          <Motion.div style={{ scale: imageScale }} className="w-full h-full">
            <img 
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
          </Motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:bg-transparent" />
          
           {/* Floating Tech Tags */}
           <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                 <span key={t} className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-neon-blue">
                    #{t}
                 </span>
              ))}
           </div>
        </div>

        {/* Project Details Area (40%) */}
        <div className="md:w-[40%] h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-between bg-[#080808] relative">
           
           {/* Cyberpunk grid bg */}
           <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#fff_1px,transparent_1px)] bg-[size:20px_20px]" />

           <div>
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple opacity-50">
                    0{index + 1}
                 </span>
                 <div className="h-px w-20 bg-white/20" />
              </div>

              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {project.description}
              </p>
           </div>

           <div className="flex items-center gap-6">
              {project.links.github && (
                 <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors group">
                    <Github className="w-5 h-5 group-hover:text-white transition-colors" />
                    <span className="font-mono text-sm">REPO</span>
                 </a>
              )}
              {project.links.demo && (
                 <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neon-blue transition-colors group">
                    <span className="font-bold text-sm">VISIT SITE</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                 </a>
              )}
           </div>
        </div>

      </Motion.div>
    </div>
  );
};

const Projects = () => {
  const container = useRef(null);

  return (
    <div ref={container} id="projects" className="relative bg-black border-t border-white/10">
      
       {/* Section Header */}
       <div className="sticky top-0 h-[20vh] flex items-center justify-center z-10 pointer-events-none mix-blend-difference">
          <h2 className="text-9xl font-bold text-white/10 tracking-tighter">WORKS</h2>
       </div>

      <div className="pb-[20vh]">
        {projects.map((project, i) => {
          const targetScale = 1 - ((projects.length - i) * 0.05);
          return (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={i} 
              targetScale={targetScale} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
