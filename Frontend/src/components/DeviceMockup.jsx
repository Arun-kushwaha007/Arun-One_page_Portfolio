import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { projects } from '../data/portfolio';

const featuredProject =
  projects.find((project) => project.id === 'collabnest') ?? projects[0];

const DeviceMockup = () => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.94, 1, 0.96]);
  const y = useTransform(scrollYProgress, [0, 1], [28, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.45, 1, 0.8]);

  const rotateX = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.8 });
  const rotateY = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.8 });

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(((event.clientX - centerX) / rect.width) * 10);
    mouseY.set(((centerY - event.clientY) / rect.height) * 10);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, y, opacity }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="relative w-full max-w-[560px]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/18 via-transparent to-blue-500/14 blur-3xl" />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1600,
          transformStyle: 'preserve-3d',
        }}
        className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/70 p-4 shadow-[0_30px_90px_rgba(6,12,24,0.6)] backdrop-blur-2xl sm:p-5"
      >
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
              Featured build
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {featuredProject.title}
            </h3>
          </div>
          <a
            href={featuredProject.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-200 transition-colors duration-300 hover:border-cyan-300/40 hover:text-cyan-200"
            aria-label={`View code for ${featuredProject.title}`}
          >
            <Github className="h-4 w-4" />
          </a>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={featuredProject.image}
              alt={featuredProject.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="max-w-md text-sm leading-6 text-slate-200">
                {featuredProject.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Why it stands out
            </p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-200">
              {featuredProject.points.slice(0, 2).map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Stack snapshot
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {featuredProject.tech.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>

            {featuredProject.links.demo && (
              <a
                href={featuredProject.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition-colors duration-300 hover:text-cyan-100"
              >
                Live preview
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeviceMockup;
