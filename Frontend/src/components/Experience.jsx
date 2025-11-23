import { experiences } from '../data/portfolio';
import { Section } from './ui/Section';
import { motion } from 'framer-motion';
import GlitchText from './ui/GlitchText';

const Experience = () => {
  return (
    <Section id="experience" className="">
      <h2 className="text-4xl md:text-6xl font-bold mb-20 text-center">
        <span className="border-b-4 border-neon-green text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500">
          MISSION LOG
        </span>
      </h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Data Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-transparent -translate-x-1/2 hidden md:block opacity-30" />

        <div className="space-y-20">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row gap-12 items-center relative ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Connector Line (Mobile Hidden) */}
              <div className="hidden md:block absolute left-1/2 top-1/2 w-12 h-px bg-neon-blue/50 -translate-x-1/2" 
                   style={{ 
                     left: index % 2 === 0 ? 'calc(50% + 24px)' : 'calc(50% - 24px)',
                     width: '48px'
                   }} 
              />

              {/* Central Node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black border-2 border-neon-green rounded-full z-10 hidden md:block shadow-[0_0_10px_#0aff0a]">
                <div className="absolute inset-0 bg-neon-green animate-ping opacity-50 rounded-full" />
              </div>

              {/* Content Card */}
              <div className="flex-1 w-full group">
                <div className="relative bg-black/60 border border-white/10 p-6 rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all duration-300">
                  {/* Scanning Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/30 shadow-[0_0_15px_#00f3ff] -translate-y-full group-hover:animate-scan" />
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-blue" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-blue" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-blue" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-blue" />

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <GlitchText text={exp.role} className="text-xl md:text-2xl mb-1 block" />
                      <div className="text-neon-purple font-mono text-sm tracking-widest">
                        @{exp.company.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-mono mb-1">STATUS: COMPLETED</div>
                      <div className="text-neon-green font-mono text-sm">{exp.period}</div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-gray-400 text-sm font-mono flex items-start gap-3">
                        <span className="text-neon-blue mt-1">➜</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Empty Space for Layout Balance */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Experience;
