import { LuLanguages, LuMapPin } from 'react-icons/lu';
import { about, education, profile } from '../data/profile';
import { RevealGroup, Section, stagger } from './ui';

export function About() {
  return (
    <Section id="about" title="About me" intro="A short introduction, my education, and the problems I like working on.">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <RevealGroup className="space-y-5 text-[1.05rem] leading-[1.75] text-muted sm:text-lg">
          {about.paragraphs.map((p, i) => (
            <p key={i} style={stagger(i)} className={i === 0 ? 'text-ink' : ''}>
              {p}
            </p>
          ))}
          <p style={stagger(3)} className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-[0.95rem]">
            <span className="inline-flex items-center gap-2">
              <LuMapPin size={16} aria-hidden="true" className="text-cyan" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <LuLanguages size={16} aria-hidden="true" className="text-cyan" /> {profile.languages.join(', ')}
            </span>
          </p>
        </RevealGroup>

        <RevealGroup className="space-y-5">
          <div style={stagger(0)} className="glass rounded-2xl p-6">
            <p className="font-display text-lg font-semibold">{education.degree}</p>
            <p className="mt-1 text-muted">{education.school}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              {about.facts.map((f) => (
                <div key={f.label} className="rounded-xl border border-line bg-[color-mix(in_srgb,var(--bg-2)_40%,transparent)] px-4 py-3">
                  <dt className="text-[0.8rem] text-muted">{f.label}</dt>
                  <dd className="font-display text-2xl font-semibold tracking-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div style={stagger(1)} className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold">What I like building</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {about.interests.map((t) => (
                <li key={t} className="chip !text-[0.85rem] !text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </RevealGroup>
      </div>
    </Section>
  );
}
