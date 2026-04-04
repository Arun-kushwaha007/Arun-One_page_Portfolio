import { useRef } from 'react';
import { projects } from '../data/portfolio';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useCursor } from '../context/CursorContext.jsx';

const ProjectCard = ({ project, index, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });
  const { setCursorType } = useCursor();

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 1]);
  
  // Smoother, position-based tilt for stability
  const rotateX = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
      <Motion.div 
        style={{ scale, rotateX, opacity, top: `calc(${index * 25}px)` }} 
        className="relative flex flex-col md:flex-row h-[70vh] w-full max-w-7xl rounded-3xl bg-[#0c0c0c] border border-white/20 overflow-hidden origin-top shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
      >
        {/* Animated Background Depth - keep these but they'll be subtle through the solid bg if we want, or just behind text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-neon-purple/10 blur-[120px] animate-[pulse_8s_infinite_ease-in-out]"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
          />
          <div 
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-neon-blue/5 blur-[120px] animate-[pulse_10s_infinite_ease-in-out_1s]"
            style={{ borderRadius: '40% 60% 70% 30% / 30% 70% 40% 60%' }}
          />
        </div>
        
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
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 grayscale-[10%] group-hover:grayscale-0"
            />
          </Motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-transparent to-transparent md:bg-gradient-to-r" />
          
           {/* Floating Tech Tags */}
           <div className="absolute bottom-8 left-8 flex flex-wrap gap-2 z-10">
              {project.tech.map((t) => (
                 <span key={t} className="px-4 py-1.5 bg-[#111111] border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-[#00f2ff] uppercase shadow-xl">
                    {t}
                 </span>
              ))}
           </div>
        </div>

        {/* Project Details Area (40%) */}
        <div className="md:w-[40%] h-1/2 md:h-full p-8 md:p-14 flex flex-col justify-between bg-[#111111] relative border-l border-white/5">
           
           {/* Cyberpunk grid bg - slightly more visible for texture */}
           <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(45deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white/40 to-white/5 font-mono">
                    0{index + 1}
                 </span>
                 <div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
                {project.title}
              </h3>
              
              <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-sm">
                {project.description}
              </p>
           </div>

           <div className="flex items-center gap-4 relative z-10">
              {project.links.github && (
                 <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all group"
                    title="View Source"
                 >
                    <Github className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                 </a>
              )}
              {project.links.demo && (
                 <a 
                    href={project.links.demo} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-grow flex items-center justify-between px-8 py-4 rounded-full bg-white text-black hover:bg-neon-blue hover:text-white transition-all duration-300 group"
                 >
                    <span className="font-black text-sm tracking-widest uppercase">Explore Live</span>
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
    <div ref={container} id="projects" className="relative bg-[#050505] border-t border-white/5">
      
       {/* Section Header */}
       <div className="sticky top-0 h-[25vh] flex items-center justify-center z-0 pointer-events-none">
          <h2 className="text-[15vw] font-black text-white/[0.03] tracking-tighter uppercase select-none">
             Selected<br />Works
          </h2>
       </div>

      <div className="pb-[40vh] px-4 md:px-10 lg:px-20">
        {projects.map((project, i) => {
          const targetScale = 1 - ((projects.length - i) * 0.04);
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
