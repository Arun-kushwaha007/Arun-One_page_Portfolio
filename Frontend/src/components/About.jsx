import { useRef, useEffect, useState } from 'react';
import { 
  motion as Motion, 
  useMotionValue, 
  useMotionTemplate,
  animate,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform
} from 'framer-motion';
import { 
  Cpu, 
  Globe, 
  Terminal, 
  Briefcase, 
  GraduationCap,
  Layout,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { profile, skills as portfolioSkills, education } from '../data/portfolio';
import { Section } from './ui/Section';
import { AboutAvatar } from './Hero';

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

  return <span ref={ref} className="text-3xl font-black text-white terminal-glow leading-none">0+</span>;
};

const SpotlightCard = ({ children, className = "", delay = 0, neoColor = "blue" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const glows = {
    blue: "border-neon-blue/40 group-hover:border-neon-blue/80 shadow-neon-blue/5",
    purple: "border-neon-purple/40 group-hover:border-neon-purple/80 shadow-neon-purple/5",
    green: "border-neon-green/40 group-hover:border-neon-green/80 shadow-neon-green/5"
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`group relative border-x border-t border-white/5 border-b-2 overflow-hidden rounded-2xl transition-all duration-500 hover:bg-[#030712]/60 ${glows[neoColor] || glows.blue} ${className}`}
      onMouseMove={handleMouseMove}
    >
       {/* High-Frequency Brutalist Noise Overlay (5% opacity) */}
       <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
       />
       
       <div className="absolute inset-0 z-0 pointer-events-none crt-scanlines opacity-[0.03] group-hover:opacity-[0.05]" />
       <Motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.03),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full z-10">{children}</div>
    </Motion.div>
  );
};

const IdentificationBanner = () => {
    const [id, setId] = useState("0x0000");
    useEffect(() => {
        const interval = setInterval(() => {
            setId("0x" + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0'));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1 z-30 font-mono text-right">
            <span className="text-[10px] py-0.5 px-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/40 leading-none backdrop-blur-md rounded-full font-bold">
                ID: {id}
            </span>
            <span className="text-[8px] text-white/30 uppercase tracking-widest block leading-none">Aura_Registry:OK</span>
        </div>
    );
};

const About = () => {
  const totalProjects = 10; 
  const yearsExperience = 3;
  const profileCardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll();
  // Mobile: appear much earlier since layout is stacked
  const aboutAvatarOpacity = useTransform(
    scrollYProgress, 
    isMobile ? [0.049, 0.08] : [0.07, 0.08], 
    [0, 1]
  );

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="about" className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Section Heading (inside grid for mobile reordering) */}
          <div className="md:col-span-12 lg:order-first mb-6 relative">
            <Motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-end gap-6"
            >
                <div>
                    <span className="text-neon-blue font-mono text-xs block mb-1 font-bold uppercase tracking-[0.3em]">02. SUBJECT_PROFILE</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                        Architecting Innovation.
                    </h2>
                </div>
                <div className="h-px bg-white/10 flex-1 mb-3 hidden md:block" />
                <Activity className="text-neon-blue/20 w-10 h-10 mb-2 animate-pulse filter drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
            </Motion.div>
          </div>

          {/* 1. Bio Dossier - Row 1 */}
          <SpotlightCard className="md:col-span-12 lg:col-span-9 p-0 lg:order-none" delay={0.1}>
             <div className="h-8 border-b border-white/5 bg-white/5 px-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green/30" />
                </div>
                <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase font-bold">PROTOCOL_ACTIVE::READY</span>
             </div>
             <div className="p-6">
                 <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-neon-blue/5 border border-neon-blue/10">
                        <Terminal className="w-5 h-5 text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.3)]" />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-1">System Identity Audit</h4>
                       <p className="text-[9px] font-bold font-mono text-neon-blue/50 uppercase leading-none">Diagnostics: COMPLETED</p>
                    </div>
                 </div>
                 <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-6 font-normal max-w-4xl tracking-tight">
                   {profile.summary}
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {profile.role.split('|').slice(1).map((role, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-neon-purple/20 transition-all text-left group/node relative overflow-hidden">
                             <Zap className="w-3 h-3 text-neon-purple mb-2 opacity-50 group-hover/node:opacity-100 transition-opacity" />
                             <span className="text-[10px] text-gray-500 font-bold font-mono uppercase group-hover/node:text-white transition-colors block leading-tight">{role.trim()}</span>
                        </div>
                    ))}
                 </div>
             </div>
          </SpotlightCard>

          {/* 2. Profile Node (First on mobile, Right on desktop) */}
          <SpotlightCard className="md:col-span-12 lg:col-span-3 lg:row-span-2 min-h-[400px] lg:min-h-full order-first lg:order-none">
            <div ref={profileCardRef} className="relative h-full w-full group/img flex flex-col">
               <IdentificationBanner />
               <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <Motion.div style={{ opacity: aboutAvatarOpacity }}>
                    <AboutAvatar isVisible={true} />
                  </Motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
               </div>
               <div className="mt-auto p-6 relative z-20">
                  <div className="space-y-0.5">
                      <h3 className="text-2xl font-black text-white leading-tight">{profile.name}</h3>
                      <div className="flex items-center gap-2 text-neon-blue">
                         <span className="h-px w-4 bg-neon-blue" />
                         <span className="font-mono text-[10px] font-bold uppercase tracking-widest leading-none drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]">{profile.role.split('|')[0]}</span>
                      </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                      <div className="px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-[9px] text-neon-blue font-mono uppercase font-bold">
                         Available_Node
                      </div>
                  </div>
               </div>
            </div>
          </SpotlightCard>

          {/* 3. Performance Stats Row - ALL HORIZONTAL */}
          <SpotlightCard className="md:col-span-4 lg:col-span-3 p-6 flex flex-col justify-between" delay={0.2}>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                        <Briefcase className="w-6 h-6 text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.4)]" />
                    </div>
                    <div>
                        <AnimatedCounter value={yearsExperience} />
                        <h5 className="text-[9px] text-neon-blue/60 font-black font-mono tracking-widest uppercase leading-none mt-1">Cycles of Mastery</h5>
                    </div>
                </div>
             </div>
             <div className="mt-6 pt-4 border-t border-white/10">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <Motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} transition={{ duration: 1.5 }} className="h-full bg-neon-blue" />
                </div>
                <div className="flex justify-between mt-1 text-[8px] font-mono text-white/20">
                    <span>L3.ARCHITECT</span>
                    <span>READY</span>
                </div>
             </div>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-4 lg:col-span-3 p-6 flex flex-col justify-between" delay={0.3} neoColor="purple">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                        <Layout className="w-6 h-6 text-neon-purple drop-shadow-[0_0_5px_rgba(188,19,254,0.4)]" />
                    </div>
                    <div>
                        <AnimatedCounter value={totalProjects} />
                        <h5 className="text-[9px] text-neon-purple/60 font-black font-mono tracking-widest uppercase leading-none mt-1">Live Transmissions</h5>
                    </div>
                </div>
             </div>
             <div className="mt-6 pt-4 border-t border-white/10">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <Motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} transition={{ duration: 1.5 }} className="h-full bg-neon-purple" />
                </div>
                <div className="flex justify-between mt-1 text-[8px] font-mono text-white/20">
                    <span>DEPLOYED_NODES</span>
                    <span>OK</span>
                </div>
             </div>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-4 lg:col-span-3 p-6 flex flex-col justify-between" delay={0.4} neoColor="green">
              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-neon-green/10 border border-neon-green/20 relative">
                        <GraduationCap className="w-6 h-6 text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.4)]" />
                         <ShieldCheck className="w-3 h-3 text-neon-green absolute -top-1 -right-1 bg-[#030712] rounded-full" />
                    </div>
                    <div className="text-left overflow-hidden">
                        <h4 className="text-base font-black text-white leading-tight uppercase tracking-tight truncate">{education.degree.split(' in ')[0]}</h4>
                        <p className="text-[9px] text-neon-green/60 font-bold font-mono tracking-widest uppercase leading-none mt-1">Verified_Node</p>
                    </div>
                  </div>
              </div>
              <div className="mt-4 font-mono text-[10px] text-gray-500 uppercase leading-tight text-left">
                  {education.institution}
                  <div className="text-white/60 font-bold mt-1 tracking-widest">GPA: 8.0/10.0</div>
              </div>
          </SpotlightCard>

          {/* 4. Arsenal & CTA Row */}
          <SpotlightCard className="md:col-span-8 lg:col-span-8 p-6" delay={0.5}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                    <Layers className="w-4 h-4 text-neon-blue" />
                 </div>
                 <h4 className="text-xl font-black text-white uppercase tracking-tighter">Strategic Arsenal</h4>
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  <div>
                      <h5 className="flex items-center gap-2 text-[10px] font-black font-mono text-white/20 mb-3 uppercase tracking-widest border-b border-white/10 pb-1">
                         <Activity className="w-3 h-3 text-neon-blue" /> Core Protocols
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                          {[...portfolioSkills["Languages"].items, ...portfolioSkills["Backend"].items.slice(0, 3)].map((skill) => (
                              <span key={skill} className="px-2 py-1 rounded-md border border-white/10 bg-black/40 text-[10px] font-bold text-gray-400 hover:text-white hover:border-neon-blue/40 transition-all cursor-default relative">
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </div>
                  <div>
                      <h5 className="flex items-center gap-2 text-[10px] font-black font-mono text-white/20 mb-3 uppercase tracking-widest border-b border-white/10 pb-1">
                         <Search className="w-3 h-3 text-neon-purple" /> Interface & Logic
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                           {[...portfolioSkills["Backend"].items.slice(3), ...portfolioSkills["Frontend"].items.slice(0, 7)].map((skill) => (
                              <span key={skill} className="px-2 py-1 rounded-md border border-white/10 bg-black/40 text-[10px] font-bold text-gray-400 hover:text-white hover:border-neon-purple/40 transition-all cursor-default">
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </div>
               </div>
          </SpotlightCard>
          
          <SpotlightCard className="md:col-span-4 lg:col-span-4 p-0 group/portal overflow-hidden" delay={0.6}>
              <button 
                onClick={scrollToContact} 
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-neon-blue/5 hover:bg-neon-blue/10 transition-all border-none focus:outline-none cursor-pointer"
              >
                  <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20 group-hover/portal:scale-110 group-hover/portal:rotate-45 transition-all duration-500">
                          <ArrowRight className="w-8 h-8 text-neon-blue" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-neon-blue/30 blur-xl opacity-0 group-hover/portal:opacity-20 transition-opacity" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">Initiate Link</h4>
                    <p className="text-[9px] text-neon-blue font-mono font-bold uppercase tracking-widest leading-none">Awaiting Connection...</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    {Object.keys(profile.social).slice(0, 3).map((platform) => (
                        <div key={platform} className="p-1.5 rounded-md bg-white/5 border border-white/10 text-white/20 group-hover/portal:text-neon-blue group-hover/portal:border-neon-blue/30 transition-all">
                             <Globe className="w-3.5 h-3.5" /> 
                        </div>
                    ))}
                  </div>
              </button>
          </SpotlightCard>
        </div>
      </div>
    </Section>
  );
};

export default About;
