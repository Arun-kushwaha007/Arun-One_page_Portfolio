import { useRef } from 'react';
import { projects } from '../data/portfolio';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-[500px] w-[350px] md:w-[600px] flex-shrink-0 group perspective-1000"
    >
      {/* Holographic Container */}
      <div className="absolute inset-0 bg-black/40 border border-neon-blue/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.1)]">
        
        {/* Projector Light Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-neon-blue shadow-[0_0_50px_#00f3ff] z-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-blue/10 to-transparent pointer-events-none z-10" />

        {/* Image with Scanlines */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-500"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 translate-z-20">
          <h3 className="text-3xl font-bold text-white mb-2 text-shadow-neon">{project.title}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="text-xs font-mono border border-neon-purple/50 text-neon-purple px-2 py-1 rounded bg-black/50 backdrop-blur-md">
                {t}
              </span>
            ))}
          </div>

          <p className="text-gray-300 mb-6 line-clamp-3 font-mono text-sm bg-black/50 p-2 rounded">
            {project.description}
          </p>

          <div className="flex gap-4">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-neon-green transition-colors z-30"
              >
                <Github className="w-5 h-5" /> <span className="font-mono">SOURCE</span>
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-neon-blue transition-colors z-30"
              >
                <ExternalLink className="w-5 h-5" /> <span className="font-mono">DEPLOY</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} id="projects" className="relative h-[300vh] bg-black/20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 px-24 items-center">
          
          {/* Title Card */}
          <div className="h-[500px] w-[400px] flex-shrink-0 flex flex-col justify-center z-10">
             <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple leading-tight">
              HOLO <br/> DECK
            </h2>
            <p className="text-neon-blue font-mono mt-4 text-xl tracking-widest">
              // PROJECT_ARCHIVE
            </p>
          </div>

          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
