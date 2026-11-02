import { LuAward, LuBadgeCheck, LuGraduationCap, LuTrophy } from 'react-icons/lu';
import { achievements, type Achievement } from '../data/profile';
import { RevealGroup, Section, stagger, trackSpotlight } from './ui';

const look: Record<Achievement['kind'], { icon: typeof LuTrophy; tone: string }> = {
  Hackathon: { icon: LuTrophy, tone: 'var(--cyan)' },
  Competition: { icon: LuAward, tone: 'var(--blue)' },
  Certification: { icon: LuBadgeCheck, tone: 'var(--violet)' },
  Academic: { icon: LuGraduationCap, tone: 'var(--cyan)' },
};

export function Achievements() {
  return (
    <Section id="achievements" title="Achievements and certifications" intro="Recognition from competitions, a certification, and my academic record.">
      <RevealGroup className="grid gap-5 sm:grid-cols-2">
        {achievements.map((a, i) => {
          const { icon: Icon, tone } = look[a.kind];
          return (
            <article
              key={a.title}
              style={stagger(i)}
              onPointerMove={trackSpotlight}
              className="glass spotlight group relative overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1"
            >
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-45"
                style={{ background: tone }}
              />
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line" style={{ color: tone }}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-faint">
                    {a.kind}
                    {a.year ? `, ${a.year}` : ''}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">{a.title}</h3>
                  <p className="text-[0.95rem] text-ink/80">{a.issuer}</p>
                </div>
              </div>
              <p className="mt-4 text-muted">{a.body}</p>
            </article>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
