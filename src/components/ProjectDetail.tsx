import { useEffect } from 'react';
import { LuArrowLeft, LuArrowRight, LuCircleCheck, LuGithub } from 'react-icons/lu';
import { projects, type Project } from '../data/projects';
import { onInternalLinkClick } from '../lib/router';
import { ProjectIllustration } from './Illustrations';
import { RevealGroup, stagger } from './ui';

export function ProjectDetail({ project: p }: { project: Project }) {
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  useEffect(() => {
    document.title = `${p.shortName} | Vijay P`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', p.tagline);
  }, [p]);

  return (
    <article className="page-enter mx-auto w-full max-w-5xl px-5 pt-28 pb-20 sm:px-8 md:pt-32">
      <a href="/#projects" onClick={onInternalLinkClick} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink" data-cursor="hover">
        <LuArrowLeft size={16} aria-hidden="true" /> All projects
      </a>

      <header className="mt-6">
        <p className="text-sm text-faint">{p.context}</p>
        <h1 className="mt-3 text-[clamp(2.2rem,5.5vw,3.6rem)] font-bold tracking-[-0.035em]">{p.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{p.tagline}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-cursor="hover">
            <LuGithub size={17} aria-hidden="true" /> View source on GitHub
          </a>
        </div>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {p.metrics.map((m, i) => (
          <div key={m.label} className="glass page-enter rounded-2xl px-4 py-4" style={{ animationDelay: `${120 + i * 70}ms` }}>
            <dt className="sr-only">{m.label}</dt>
            <dd>
              <span className="block font-display text-[1.7rem] font-semibold tracking-tight" style={{ color: p.accent }}>
                {m.value}
              </span>
              <span className="mt-1 block text-[0.85rem] leading-snug text-muted">{m.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <figure className="glass mt-8 overflow-hidden rounded-[1.4rem] p-4 sm:p-8">
        <ProjectIllustration kind={p.illustration} />
        <figcaption className="mt-3 text-center text-sm text-faint">Architecture sketch drawn from the repository’s structure.</figcaption>
      </figure>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_17rem]">
        <div className="space-y-12">
          <Block title="Overview">
            <p>{p.overview}</p>
          </Block>
          <Block title="The problem">
            <p>{p.problem}</p>
          </Block>
          <Block title="The solution">
            <p>{p.solution}</p>
          </Block>
          <Block title="Key features">
            <RevealGroup as="ul" className="space-y-3">
              {p.features.map((f, i) => (
                <li key={f} style={stagger(i)} className="flex gap-3">
                  <LuCircleCheck size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-cyan" />
                  <span>{f}</span>
                </li>
              ))}
            </RevealGroup>
          </Block>
          <Block title="My contributions">
            <RevealGroup as="ol" className="space-y-4">
              {p.contributions.map((c, i) => (
                <li key={c} style={stagger(i)} className="glass flex gap-4 rounded-xl px-4 py-3.5">
                  <span className="font-display text-lg font-semibold text-violet">{i + 1}</span>
                  <span>{c}</span>
                </li>
              ))}
            </RevealGroup>
          </Block>
          {p.image && (
            <Block title="From the results">
              <figure className="overflow-hidden rounded-2xl border border-line bg-white p-3">
                <img src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} loading="lazy" decoding="async" className="mx-auto max-h-[42rem] w-auto" />
              </figure>
              <p className="mt-3 text-sm text-faint">{p.image.caption}</p>
            </Block>
          )}
        </div>

        <aside className="space-y-6 md:sticky md:top-28 md:self-start">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-base font-semibold">Tech stack</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <h2 className="text-base font-semibold">Area</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.categories.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <h2 className="text-base font-semibold">Links</h2>
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 break-all text-sm text-cyan hover:underline">
              <LuGithub size={16} aria-hidden="true" className="shrink-0" /> {p.repo.replace('https://', '')}
            </a>
          </div>
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
        <a href={`/projects/${prev.slug}`} onClick={onInternalLinkClick} className="glass group rounded-2xl p-5 transition-colors hover:border-line-strong" data-cursor="hover">
          <span className="flex items-center gap-2 text-sm text-muted">
            <LuArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" /> Previous
          </span>
          <span className="mt-1 block font-display text-lg font-semibold">{prev.shortName}</span>
        </a>
        <a href={`/projects/${next.slug}`} onClick={onInternalLinkClick} className="glass group rounded-2xl p-5 text-right transition-colors hover:border-line-strong" data-cursor="hover">
          <span className="flex items-center justify-end gap-2 text-sm text-muted">
            Next <LuArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-1 block font-display text-lg font-semibold">{next.shortName}</span>
        </a>
      </nav>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="space-y-4 text-[1.05rem] leading-[1.75] text-muted [&_li]:text-ink/85">{children}</div>
    </section>
  );
}
