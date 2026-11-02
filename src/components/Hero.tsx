import { LuArrowDown, LuDownload, LuGithub, LuMail, LuMapPin, LuTrophy, LuGraduationCap, LuAward } from 'react-icons/lu';
import { profile } from '../data/profile';
import { useTyping } from '../lib/hooks';
import { MeshCanvas } from './MeshCanvas';
import { MagneticLink, stagger } from './ui';

const highlights = [
  { icon: LuTrophy, title: 'Institute Finalist', body: 'Smart India Hackathon 2025' },
  { icon: LuAward, title: 'First Place', body: 'Inter-College Web Development, 2024' },
  { icon: LuGraduationCap, title: 'CGPA 8.57', body: 'B.Tech CSE, VIT Chennai' },
];

export function Hero({ reduced }: { reduced: boolean }) {
  const typed = useTyping(profile.roles, reduced);

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_75%_at_60%_45%,black_40%,transparent_100%)]">
        <MeshCanvas reduced={reduced} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_0.8fr] lg:gap-12">
        <div className="page-enter">
          <p className="chip mb-6 !text-[0.85rem]" style={stagger(0)}>
            <LuMapPin size={14} aria-hidden="true" className="text-cyan" />
            {profile.location}
          </p>

          <h1 id="hero-title" className="font-display text-[clamp(3.2rem,9vw,6.4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            <span className="gradient-text">{profile.name}</span>
          </h1>

          <p className="mt-5 font-display text-[clamp(1.35rem,3.2vw,2rem)] font-medium text-ink" aria-live="off">
            <span className="sr-only">{profile.roles.join(', ')}</span>
            <span aria-hidden="true">
              {typed}
              <span className="caret" />
            </span>
          </p>

          <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-muted sm:text-lg">
            {profile.headline}. {profile.intro}
          </p>

          <div className="mt-9 flex flex-wrap gap-2.5">
            <MagneticLink href="/#projects" variant="primary">
              View my projects
            </MagneticLink>
            <MagneticLink href={profile.resumeUrl} download={profile.resumeFileName} external={false}>
              <LuDownload size={17} aria-hidden="true" /> Download resume
            </MagneticLink>
            <MagneticLink href="/#contact">
              <LuMail size={17} aria-hidden="true" /> Contact me
            </MagneticLink>
            <MagneticLink href={profile.links.github} label="GitHub profile (opens in a new tab)">
              <LuGithub size={17} aria-hidden="true" /> GitHub
            </MagneticLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm page-enter [animation-delay:150ms] lg:max-w-none">
          <div className="glass hairline-top relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7">
            <div className="flex items-center gap-5">
              <Avatar reduced={reduced} />
              <div>
                <p className="font-display text-xl font-semibold">{profile.name}</p>
                <p className="text-sm text-muted">B.Tech Computer Science</p>
                <p className="text-sm text-muted">VIT Chennai, 2023 – 2027</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2.5">
              {highlights.map((h) => (
                <li key={h.title} className="flex items-center gap-3 rounded-xl border border-line bg-[color-mix(in_srgb,var(--bg-2)_45%,transparent)] px-3.5 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--blue)_16%,transparent)] text-cyan">
                    <h.icon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-semibold leading-tight">{h.title}</span>
                    <span className="block text-[0.82rem] text-muted">{h.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <a
        href="/#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('about')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
        }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-sm text-faint transition-colors hover:text-ink md:flex"
      >
        <LuArrowDown size={16} aria-hidden="true" className={reduced ? '' : 'animate-bounce'} /> Scroll
      </a>
    </section>
  );
}

function Avatar({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative h-24 w-24 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="av" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="0.55" stopColor="var(--blue)" />
            <stop offset="1" stopColor="var(--violet)" />
          </linearGradient>
          <radialGradient id="avfill" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="color-mix(in srgb, var(--blue) 45%, var(--bg-2))" />
            <stop offset="1" stopColor="var(--bg-2)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#avfill)" stroke="url(#av)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="var(--line-strong)" strokeDasharray="2 5" />
        <text x="50" y="59" textAnchor="middle" fontFamily="Space Grotesk, Inter, sans-serif" fontWeight="700" fontSize="28" fill="url(#av)" letterSpacing="-1">
          VP
        </text>
        {!reduced && (
          <>
            <circle r="3.2" fill="var(--cyan)" className="packet" style={{ offsetPath: "path('M50 3 a47 47 0 1 1 -0.01 0')" } as React.CSSProperties} />
            <circle r="2.4" fill="var(--violet)" className="packet" style={{ offsetPath: "path('M50 3 a47 47 0 1 1 -0.01 0')", ['--d' as string]: '-1.6s' } as React.CSSProperties} />
          </>
        )}
      </svg>
    </div>
  );
}
