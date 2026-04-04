import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { projects } from '../data/portfolio';
import { useCursor } from '../context/CursorContext.jsx';

const featuredProject =
  projects.find((project) => project.id === 'collabnest') ?? projects[0];
const remainingProjects = projects.filter(
  (project) => project.id !== featuredProject.id
);

const ActionLink = ({ href, children, variant = 'ghost' }) => {
  if (!href) {
    return null;
  }

  const baseClassName =
    'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950';

  const variantClassName =
    variant === 'primary'
      ? 'bg-cyan-400 text-slate-950 hover:-translate-y-0.5 hover:bg-cyan-300'
      : 'border border-white/12 bg-white/5 text-slate-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-100';

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${baseClassName} ${variantClassName}`}
    >
      {children}
    </a>
  );
};

const ProjectChipList = ({ tech }) => (
  <div className="flex flex-wrap gap-2">
    {tech.slice(0, 3).map((item) => (
      <span
        key={item}
        className="rounded-full border border-white/10 bg-slate-950/65 px-3 py-1.5 text-xs text-slate-200"
      >
        {item}
      </span>
    ))}
  </div>
);

const Projects = () => {
  const { setCursorType } = useCursor();

  return (
    <section id="projects" className="border-t border-white/10 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/85">
            Selected Work
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Projects that show how I build, ship, and improve software.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              A mix of real-time systems, applied AI products, and backend-heavy builds
              where performance, delivery, and usability all matter.
            </p>
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(4,10,20,0.34)] backdrop-blur-xl"
        >
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setCursorType('project')}
              onMouseLeave={() => setCursorType('default')}
            >
              <img
                src={featuredProject.image}
                alt={featuredProject.title}
                className="h-full min-h-[320px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/85">
                  Featured Project
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {featuredProject.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  {featuredProject.description}
                </p>

                <div className="mt-6">
                  <ProjectChipList tech={featuredProject.tech} />
                </div>

                <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                  {featuredProject.points.slice(0, 2).map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink href={featuredProject.links.github} variant="ghost">
                  <Github className="h-4 w-4" />
                  Code
                </ActionLink>
                <ActionLink href={featuredProject.links.demo} variant="primary">
                  Live
                  <ArrowUpRight className="h-4 w-4" />
                </ActionLink>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {remainingProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/65 shadow-[0_18px_50px_rgba(4,10,20,0.28)] backdrop-blur-xl"
            >
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => setCursorType('project')}
                onMouseLeave={() => setCursorType('default')}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/12 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold leading-tight text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {project.description}
                </p>

                <div className="mt-5">
                  <ProjectChipList tech={project.tech} />
                </div>

                <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-300">
                  {project.points.slice(0, 2).map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ActionLink href={project.links.github} variant="ghost">
                    <Github className="h-4 w-4" />
                    Code
                  </ActionLink>
                  <ActionLink href={project.links.demo} variant="primary">
                    Live
                    <ArrowUpRight className="h-4 w-4" />
                  </ActionLink>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
