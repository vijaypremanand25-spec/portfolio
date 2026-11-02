import { useMemo, useState } from 'react';
import { LuArrowUpRight, LuGithub, LuFilterX } from 'react-icons/lu';
import { projectCategories, projects, type Project, type ProjectCategory } from '../data/projects';
import { onInternalLinkClick } from '../lib/router';
import { ProjectIllustration } from './Illustrations';
import { Section, trackSpotlight } from './ui';

export function Projects() {
  const [category, setCategory] = useState<ProjectCategory | 'All'>('All');
  const [tech, setTech] = useState('All');

  const techs = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.stack))).sort((a, b) => a.localeCompare(b)), []);
  const shown = projects.filter(
    (p) => (category === 'All' || p.categories.includes(category)) && (tech === 'All' || p.stack.includes(tech)),
  );

  return (
    <Section
      id="projects"
      title="Featured projects"
      intro="Four systems I have built, each with its own case study covering the problem, the approach, and what was measured. Filter by area or by technology."
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="toolbar" aria-label="Filter projects by area" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(['All', ...projectCategories] as const).map((c) => {
            const on = category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                data-cursor="hover"
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                  on ? 'border-transparent bg-gradient-to-r from-blue to-violet text-white' : 'border-line text-muted hover:text-ink'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2.5 text-sm text-muted">
          Technology
          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="rounded-xl border border-line bg-panel-strong px-3 py-2 text-sm text-ink outline-none focus-visible:border-cyan"
          >
            <option value="All">All technologies</option>
            {techs.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} of {projects.length} projects
      </p>

      {shown.length === 0 ? (
        <div className="glass grid place-items-center rounded-2xl px-6 py-16 text-center">
          <p className="text-lg">No project matches both filters.</p>
          <button
            type="button"
            onClick={() => {
              setCategory('All');
              setTech('All');
            }}
            className="btn btn-ghost mt-5"
          >
            <LuFilterX size={16} aria-hidden="true" /> Clear filters
          </button>
        </div>
      ) : (
        <div key={`${category}-${tech}`} className="grid gap-6 md:grid-cols-2">
          {shown.map((p, i) => (
            <ProjectCard key={p.slug} project={p} featured={i === 0 && shown.length > 1 && shown.length % 2 === 1} index={i} />
          ))}
        </div>
      )}
    </Section>
  );
}

function ProjectCard({ project: p, featured, index }: { project: Project; featured: boolean; index: number }) {
  return (
    <article
      onPointerMove={trackSpotlight}
      style={{ animationDelay: `${index * 90}ms` }}
      className={`glass spotlight page-enter group flex flex-col overflow-hidden rounded-[1.4rem] transition-transform duration-500 hover:-translate-y-1 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-[1.1fr_1fr]' : ''
      }`}
    >
      <div className={`relative border-b border-line bg-[color-mix(in_srgb,var(--bg-2)_55%,transparent)] p-4 ${featured ? 'md:border-r md:border-b-0 md:p-6' : ''}`}>
        <div className="transition-transform duration-700 group-hover:scale-[1.02]">
          <ProjectIllustration kind={p.illustration} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-faint">{p.context}</p>
        <h3 className="mt-2 text-2xl font-semibold">
          <a href={`/projects/${p.slug}`} onClick={onInternalLinkClick} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none" data-cursor="hover">
            {p.shortName}
          </a>
        </h3>
        <p className="mt-2 text-muted">{p.tagline}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3">
          {p.metrics.slice(0, 2).map((m) => (
            <div key={m.label} className="rounded-xl border border-line px-3.5 py-2.5">
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="block font-display text-xl font-semibold tracking-tight" style={{ color: p.accent }}>
                  {m.value}
                </span>
                <span className="block text-[0.78rem] leading-snug text-muted">{m.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.stack.slice(0, 6).map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
          {p.stack.length > 6 && <li className="chip">+{p.stack.length - 6} more</li>}
        </ul>

        <div className="relative z-10 mt-auto flex flex-wrap gap-2.5 pt-6">
          <a href={`/projects/${p.slug}`} onClick={onInternalLinkClick} className="btn btn-primary !py-2.5 text-sm" data-cursor="hover">
            Read the case study <LuArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost !py-2.5 text-sm"
            aria-label={`${p.shortName} source code on GitHub (opens in a new tab)`}
            data-cursor="hover"
          >
            <LuGithub size={16} aria-hidden="true" /> Source code
          </a>
        </div>
      </div>
    </article>
  );
}
