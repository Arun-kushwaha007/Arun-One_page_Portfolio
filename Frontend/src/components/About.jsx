import { useRef, useEffect } from 'react';
import { 
  motion, 
  useMotionTemplate, 
  useMotionValue, 
  useSpring,
  animate,
  useInView
} from 'framer-motion';
import { 
  Code, 
  Cpu, 
  Globe, 
  Terminal, 
  Zap, 
  Briefcase, 
  GraduationCap,
  Layout,
  Server,
  Database,
  ArrowRight
} from 'lucide-react';
import { profile, skills, education, projects, experiences } from '../data/portfolio';
import { Section } from './ui/Section';

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (inView) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration,
        onUpdate: (v) => {
          node.textContent = Math.floor(v).toString() + "+";
        },
      });
      return () => controls.stop();
    }
  }, [value, duration, inView]);

  return <span ref={ref} className="text-4xl font-bold text-white mb-1">0+</span>;
};

const SpotlightCard = ({ children, className = "", delay = 0 }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`group relative border border-white/10 bg-gray-900/40 overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
    >
       {/* Noise Texture */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 243, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

const About = () => {
  const totalProjects = 10; 
  const yearsExperience = 3;

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Section Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-300">
             <span className="text-neon-blue">02.</span> About Me
          </h2>
          <div className="h-px bg-white/10 flex-1 max-w-xs" />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* 1. Profile Core (Large Left) */}
          <SpotlightCard className="md:col-span-1 lg:row-span-2 min-h-[380px] bg-black/60">
            <div className="relative h-full flex flex-col justify-end p-5 z-20">
              <div className="absolute inset-0">
                 <img 
                  src={profile.image} 
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-0.5">{profile.name}</h3>
                <p className="text-neon-blue font-mono text-xs mb-3">{profile.role.split('|')[0]}</p>
                <div className="flex gap-2">
                   <div className="px-2 py-0.5 rounded-full bg-neon-blue/20 border border-neon-blue/30 text-[10px] text-neon-blue font-mono">
                      Available
                   </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* 2. Bio / Summary (Top Wide) */}
          <SpotlightCard className="md:col-span-2 lg:col-span-3 p-6 flex flex-col justify-center bg-gray-900/60" delay={0.1}>
             <div className="flex items-start gap-4 mb-4">
                <Terminal className="w-6 h-6 text-neon-green mt-1" />
                <div>
                   <h4 className="text-lg font-bold text-white mb-1">System Audit: <span className="text-neon-green">ACTIVE</span></h4>
                   <p className="text-sm font-mono text-gray-500">INITIATING_CORE_DUMP...</p>
                </div>
             </div>
             
             <p className="text-gray-300 leading-relaxed text-sm md:text-[15px] mb-6 border-l w-fit border-white/10 pl-4">
               {profile.summary}
             </p>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {profile.role.split('|').slice(1).map((role, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                        <span className="text-xs text-gray-300 font-mono">{role.trim()}</span>
                    </div>
                ))}
             </div>
          </SpotlightCard>

          {/* 3. Stats Block 1 */}
          <SpotlightCard className="flex flex-col items-center justify-center p-6 text-center bg-black/40" delay={0.2}>
             <Briefcase className="w-8 h-8 text-neon-blue mb-3 opacity-80" />
             <AnimatedCounter value={yearsExperience} />
             <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-1">Years Experience</span>
          </SpotlightCard>

          {/* 4. Stats Block 2 */}
          <SpotlightCard className="flex flex-col items-center justify-center p-6 text-center bg-black/40" delay={0.3}>
             <Layout className="w-8 h-8 text-neon-purple mb-3 opacity-80" />
             <AnimatedCounter value={totalProjects} />
             <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-1">Projects Built</span>
          </SpotlightCard>

          {/* 5. Stats Block 3 (Education) */}
           <SpotlightCard className="flex flex-col justify-between p-6 bg-black/40" delay={0.4}>
              <div>
                  <div className="flex items-center gap-2 mb-3 text-gray-400">
                     <GraduationCap className="w-5 h-5" />
                     <span className="text-xs font-mono uppercase">Education</span>
                  </div>
                  <h4 className="text-base font-bold text-white leading-tight mb-1">{education.degree.split(' in ')[0]}</h4>
                  <p className="text-xs text-gray-500">{education.institution}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono">{education.period.split(' – ')[1]}</span>
                  <span className="text-xs text-neon-green font-bold">GPA 8/10</span>
              </div>
           </SpotlightCard>

          {/* 6. Tech Stack Grouped */}
          <SpotlightCard className="md:col-span-2 lg:col-span-2 p-6 flex flex-col bg-gray-900/60" delay={0.5}>
              <div className="flex items-center gap-3 mb-5">
                 <Cpu className="w-5 h-5 text-neon-blue" />
                 <h4 className="text-lg font-bold text-white">Tech Arsenal</h4>
              </div>

               <div className="space-y-4">
                  {/* Languages */}
                  <div>
                      <h5 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Core Languages</h5>
                      <div className="flex flex-wrap gap-2">
                          {skills["Languages"].items.map((skill) => (
                              <span key={skill} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </div>
                  
                  {/* Frameworks & Tools (Combined for density) */}
                  <div>
                      <h5 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Frameworks & Tools</h5>
                      <div className="flex flex-wrap gap-2">
                           {[...skills["Backend"].items, ...skills["Frontend"].items.filter(i => !i.includes("Tailwind"))].slice(0, 8).map((skill) => (
                              <span key={skill} className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 hover:bg-blue-500/20 transition-colors">
                                  {skill}
                              </span>
                          ))}
                           <span className="px-2 py-1 text-xs text-gray-600 font-mono">+More</span>
                      </div>
                  </div>
               </div>
          </SpotlightCard>
          
          {/* 7. Connect CTA */}
          <SpotlightCard className="md:col-span-1 p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-neon-blue/5 transition-colors" delay={0.6}>
              <div 
                onClick={scrollToContact}
                className="w-full h-full flex flex-col items-center justify-center p-2 rounded-xl transition-all"
              >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-6 h-6 text-white group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Let's Connect</h4>
                  <p className="text-xs text-gray-400 mb-4">Open for collaborations & opportunities</p>
                  
                  <div className="flex gap-3 justify-center">
                    {Object.entries(profile.social).map(([platform, link]) => (
                        <div 
                            key={platform} 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(link, '_blank');
                            }}
                            className="text-gray-500 hover:text-neon-blue transition-colors cursor-pointer"
                        >
                            <Globe className="w-4 h-4" /> 
                        </div>
                    ))}
                  </div>
              </div>
          </SpotlightCard>

        </div>
      </div>
    </Section>
  );
};

export default About;
