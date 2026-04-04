import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { education, profile } from '../data/portfolio';
import { Section } from './ui/Section';

const About = () => {
  return (
    <Section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-4"
        >
          <h2 className="text-2xl font-semibold text-white">
            <span className="text-cyan-300">02.</span> {profile.about.title}
          </h2>
          <div className="h-px max-w-xs flex-1 bg-white/10" />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(4,10,20,0.42)] backdrop-blur-xl"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                  Engineering-first profile
                </p>
                <h3 className="mt-2 text-3xl font-semibold text-white">
                  {profile.name}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
                  {profile.about.availability}
                </p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-white/10 bg-slate-950/80 p-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs uppercase tracking-[0.22em]">Location</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white">{profile.location}</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <GraduationCap className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs uppercase tracking-[0.22em]">Education</span>
                </div>
                <p className="mt-3 text-sm font-medium text-white">{education.institution}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{education.degree}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_80px_rgba(4,10,20,0.32)] backdrop-blur-xl sm:p-8"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/85">
              Who I am
            </p>

            <h3 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Building reliable software with a backend, systems, and delivery mindset.
            </h3>

            <div className="mt-6 space-y-4 text-base leading-8 text-slate-300">
              <p>{profile.about.intro}</p>
              <p>{profile.about.body}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {profile.about.focusAreas.map((area) => (
                <div
                  key={area}
                  className="rounded-2xl border border-white/8 bg-white/5 p-4"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-200">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-slate-200">{area}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">Interested in working together?</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  I am open to strong engineering teams, practical products, and meaningful collaborations.
                </p>
              </div>

              <a
                href="#contact"
                className="group inline-flex items-center gap-2 self-start rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default About;
