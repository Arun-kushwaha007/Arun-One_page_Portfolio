import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { projects } from '../data/portfolio';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DeviceMockup = () => {
  const containerRef = useRef(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scrollScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]);
  const scrollY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -30]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.3]);
  const scrollRotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);
  
  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-based rotation for smooth follow
  const rotateX = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 150, damping: 20 });

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse distance from center (-15 to 15 degrees)
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    const y = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  // Reset rotation on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-cycle projects every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentProjectIndex];

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        scale: scrollScale, 
        y: scrollY, 
        opacity: scrollOpacity,
        rotateZ: scrollRotateZ,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      {/* Floating glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-transparent to-neon-purple/20 blur-3xl opacity-50 animate-pulse pointer-events-none" />

      {/* The 3D Laptop */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
        className="relative"
      >
        {/* Laptop Body */}
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Screen Bezel */}
          <div 
            className="relative w-[280px] md:w-[450px] lg:w-[550px] aspect-[16/10] rounded-t-xl bg-gradient-to-b from-gray-800 to-gray-900 p-2 md:p-3 shadow-2xl border border-white/10"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
          >
            {/* Inner Screen */}
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-black shadow-inner">
              {/* Project Image */}
              <motion.img 
                key={currentProjectIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={currentProject?.image || "/api/placeholder/600/375"} 
                alt={currentProject?.title}
                className="w-full h-full object-cover"
              />
              
              {/* Screen Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />

              {/* Project Info Overlay */}
              <motion.div 
                key={`info-${currentProjectIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
              >
                <p className="text-xs md:text-sm font-bold text-white truncate">{currentProject?.title}</p>
                <p className="text-[10px] md:text-xs text-gray-400 truncate">{currentProject?.tech?.slice(0, 3).join(' • ')}</p>
              </motion.div>
            </div>

            {/* Webcam dot */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700 border border-gray-600">
              <div className="absolute inset-0.5 rounded-full bg-gray-800" />
            </div>
          </div>

          {/* Laptop Base/Keyboard */}
          <div 
            className="relative w-[300px] md:w-[490px] lg:w-[600px] h-3 md:h-4 -mt-px mx-auto bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg shadow-lg border-x border-b border-white/5"
            style={{ 
              transform: "rotateX(-75deg) translateZ(10px)",
              transformOrigin: "top center",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-1 bg-gray-600 rounded-b" />
          </div>
        </div>

        {/* Reflection/Shadow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-neon-blue/30 blur-xl rounded-full" />
      </motion.div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={prevProject}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        
        {/* Dots indicator */}
        <div className="flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentProjectIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentProjectIndex ? 'bg-neon-blue w-4' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextProject}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

export default DeviceMockup;
