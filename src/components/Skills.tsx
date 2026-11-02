import { useMemo, useState } from 'react';
import { skillCategories, skills, type SkillCategory } from '../data/skills';
import { Section, trackSpotlight } from './ui';

type Filter = 'All' | SkillCategory;

export function Skills() {
  const [filter, setFilter] = useState<Filter>('All');
  const counts = useMemo(() => {
    const m = new Map<SkillCategory, number>();
    for (const s of skills) m.set(s.category, (m.get(s.category) ?? 0) + 1);
    return m;
  }, []);
  const groups = skillCategories.filter((c) => filter === 'All' || c.id === filter);

  return (
    <Section
      id="skills"
      title="Technical skills"
      intro={`${skills.length} tools and technologies from my resume, grouped by where they sit in a system. Pick a category to focus on it.`}
    >
      <div role="toolbar" aria-label="Filter skills by category" className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(['All', ...skillCategories.map((c) => c.id)] as Filter[]).map((f) => {
          const on = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f)}
              data-cursor="hover"
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                on
                  ? 'border-transparent bg-gradient-to-r from-blue to-violet text-white shadow-[0_8px_24px_-10px_var(--blue)]'
                  : 'border-line text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              {f}
              <span className={`ml-1.5 text-xs ${on ? 'text-white/80' : 'text-faint'}`}>
                {f === 'All' ? skills.length : counts.get(f as SkillCategory)}
              </span>
            </button>
          );
        })}
      </div>

      <div key={filter} className="grid gap-5 page-enter md:grid-cols-2">
        {groups.map((cat) => (
          <article
            key={cat.id}
            onPointerMove={trackSpotlight}
            className={`glass spotlight rounded-2xl p-5 sm:p-6 ${filter !== 'All' ? 'md:col-span-2' : ''}`}
          >
            <header className="mb-4 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">{cat.id}</h3>
              <p className="text-sm text-faint">{cat.blurb}</p>
            </header>
            <ul className={`grid gap-2.5 ${filter !== 'All' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {skills
                .filter((s) => s.category === cat.id)
                .map((s) => (
                  <li
                    key={s.name}
                    className="group flex items-center gap-2.5 rounded-xl border border-line bg-[color-mix(in_srgb,var(--bg-2)_40%,transparent)] px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--cyan)_45%,transparent)]"
                  >
                    <s.icon
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-colors duration-300 group-hover:text-cyan"
                    />
                    <span className="text-[0.9rem] leading-tight">{s.name}</span>
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
