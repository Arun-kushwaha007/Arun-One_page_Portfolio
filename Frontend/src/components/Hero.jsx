import { useRef } from 'react';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import DeviceMockup from './DeviceMockup';
import { profile } from '../data/portfolio';
import { useCursor } from '../context/CursorContext.jsx';

const socials = [
  { icon: Github, href: profile.social.github, label: 'GitHub' },
  { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
];

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const { setCursorType } = useCursor();

  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.18]);
  const panelY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[14%] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-72 w-72 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute bottom-[10%] left-[28%] h-40 w-40 rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <div className="z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-16">
        <div
          className="order-2 relative z-20 lg:order-1"
          onMouseEnter={() => setCursorType('text')}
          onMouseLeave={() => setCursorType('default')}
        >
          <Motion.div
            style={{ y: yText, opacity: heroOpacity }}
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200/90 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.7)]" />
              {profile.hero.eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-white/92">{profile.name}</span>
              <span className="mt-3 block bg-gradient-to-r from-white via-cyan-100 to-slate-400 bg-clip-text text-transparent">
                {profile.hero.headline.replace(`${profile.name} `, '')}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {profile.hero.summary}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {profile.hero.stats.map((stat) => (
                <span
                  key={stat}
                  className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 backdrop-blur-md"
                >
                  {stat}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={profile.hero.primaryCta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {profile.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href={profile.hero.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-2xl border border-white/14 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {profile.hero.secondaryCta.label}
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Connect
              </span>
              <div className="h-px w-14 bg-white/10" />
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/65 text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Motion.div>
        </div>

        <Motion.div
          style={{ y: panelY, opacity: heroOpacity }}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.08 }}
          className="order-1 flex min-h-[360px] items-center justify-center lg:order-2 lg:min-h-[540px]"
        >
          <DeviceMockup />
        </Motion.div>
      </div>

      <Motion.a
        href="#about"
        style={{ opacity: heroOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md transition-colors duration-300 hover:text-white"
      >
        Scroll
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </Motion.a>
    </section>
  );
};

export default Hero;
