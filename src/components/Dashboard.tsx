import { useMemo, useState } from 'react';
import {
  LuCircleAlert, LuDownload, LuFolderGit2, LuGitFork, LuGithub, LuLinkedin, LuMail, LuRefreshCw, LuStar, LuUsers, LuCode,
} from 'react-icons/lu';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillCategories, skills } from '../data/skills';
import { languageColors, timeAgo, useGithub, type GithubData } from '../lib/github';
import { Section } from './ui';

export function Dashboard() {
  const [attempt, setAttempt] = useState(0);
  const gh = useGithub(profile.githubUser, attempt);

  return (
    <Section
      id="dashboard"
      title="Developer dashboard"
      intro="Live numbers from my public GitHub profile, alongside a summary of the projects and skills on my resume."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {gh.status === 'loading' && <Skeleton />}
          {gh.status === 'error' && <GithubError message={gh.message} onRetry={() => setAttempt((a) => a + 1)} />}
          {gh.status === 'ready' && <GithubPanels data={gh.data} onRefresh={() => setAttempt((a) => a + 1)} />}
        </div>
        <div className="space-y-5">
          <ResumeStats />
          <QuickLinks />
        </div>
      </div>
    </Section>
  );
}

function Card({ title, children, aside, className = '' }: { title: string; children: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <section className={`glass rounded-2xl p-5 sm:p-6 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {aside}
      </header>
      {children}
    </section>
  );
}

function GithubPanels({ data, onRefresh }: { data: GithubData; onRefresh: () => void }) {
  const { user, repos, events } = data;
  const own = repos.filter((r) => !r.fork);

  const langs = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of own) if (r.language) m.set(r.language, (m.get(r.language) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [own]);
  const maxLang = Math.max(1, ...langs.map(([, n]) => n));

  const days = useMemo(() => {
    const out: { key: string; label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      out.push({ key: d.toDateString(), label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), count: 0 });
    }
    const idx = new Map(out.map((d, i) => [d.key, i]));
    for (const e of events) {
      const i = idx.get(new Date(e.created_at).toDateString());
      if (i !== undefined) out[i].count++;
    }
    return out;
  }, [events]);
  const totalEvents = days.reduce((s, d) => s + d.count, 0);
  const maxDay = Math.max(1, ...days.map((d) => d.count));
  const stars = own.reduce((s, r) => s + r.stargazers_count, 0);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Card
        title="GitHub profile"
        className="sm:col-span-2"
        aside={
          <button type="button" onClick={onRefresh} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted hover:text-ink" aria-label="Refresh GitHub data">
            <LuRefreshCw size={13} aria-hidden="true" /> Updated {timeAgo(new Date(data.fetchedAt).toISOString())}
          </button>
        }
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <img src={user.avatar_url} alt="" width={64} height={64} loading="lazy" className="h-16 w-16 rounded-2xl border border-line" />
            <span>
              <span className="block font-display text-lg font-semibold">{user.name || user.login}</span>
              <span className="block text-sm text-cyan">@{user.login}</span>
              <span className="block text-xs text-faint">On GitHub since {new Date(user.created_at).getFullYear()}</span>
            </span>
          </a>
          <div className="grid flex-1 grid-cols-4 gap-2 sm:ml-auto">
            {[
              { icon: LuFolderGit2, label: 'Public repos', value: user.public_repos },
              { icon: LuStar, label: 'Stars', value: stars },
              { icon: LuUsers, label: 'Followers', value: user.followers },
              { icon: LuUsers, label: 'Following', value: user.following },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line px-2 py-2.5 text-center">
                <p className="font-display text-2xl font-semibold">{s.value}</p>
                <p className="mt-0.5 text-[0.72rem] leading-tight text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Languages across repositories" aside={<span className="text-xs text-faint">primary language, {own.length} repos</span>}>
        {langs.length === 0 ? (
          <p className="text-sm text-muted">No language data reported yet.</p>
        ) : (
          <ul className="space-y-3">
            {langs.slice(0, 6).map(([lang, n], i) => (
              <li key={lang}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{lang}</span>
                  <span className="text-muted">
                    {n} {n === 1 ? 'repo' : 'repos'}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--bg-2)_80%,transparent)]">
                  <div
                    className="bar-grow h-full rounded-full"
                    style={{ width: `${(n / maxLang) * 100}%`, background: languageColors[lang] ?? 'var(--blue)', ['--i' as string]: i }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Public activity, last 30 days" aside={<span className="text-xs text-faint">{totalEvents} events</span>}>
        {totalEvents === 0 ? (
          <p className="text-sm text-muted">No public events in the last 30 days.</p>
        ) : (
          <>
            <svg viewBox="0 0 300 110" className="h-auto w-full" role="img" aria-label={`${totalEvents} public GitHub events in the last 30 days`}>
              {days.map((d, i) => {
                const h = (d.count / maxDay) * 90;
                return (
                  <rect key={d.key} x={i * 10 + 1} y={100 - Math.max(h, 2)} width={7.5} height={Math.max(h, 2)} rx={2} fill={d.count ? 'var(--cyan)' : 'var(--line-strong)'} opacity={d.count ? 0.9 : 0.6} className="col-grow" style={{ ['--i' as string]: i } as React.CSSProperties}>
                    <title>{`${d.label}: ${d.count} ${d.count === 1 ? 'event' : 'events'}`}</title>
                  </rect>
                );
              })}
              <line x1="0" y1="100.5" x2="300" y2="100.5" stroke="var(--line-strong)" />
            </svg>
            <div className="mt-1 flex justify-between text-[0.72rem] text-faint">
              <span>{days[0].label}</span>
              <span>Today</span>
            </div>
          </>
        )}
      </Card>

      <Card title="Recently updated repositories" className="sm:col-span-2">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {own.slice(0, 6).map((r) => (
            <li key={r.name}>
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-xl border border-line px-4 py-3 transition-colors hover:border-[color-mix(in_srgb,var(--cyan)_45%,transparent)]"
              >
                <span className="font-medium text-ink">{r.name}</span>
                {r.description && <span className="mt-0.5 line-clamp-1 text-sm text-muted">{r.description}</span>}
                <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-faint">
                  {r.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: languageColors[r.language] ?? 'var(--blue)' }} />
                      {r.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <LuStar size={12} aria-hidden="true" /> {r.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <LuGitFork size={12} aria-hidden="true" /> {r.forks_count}
                  </span>
                  <span>Updated {timeAgo(r.pushed_at)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2" aria-busy="true" aria-label="Loading GitHub data">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`glass h-48 animate-pulse rounded-2xl ${i === 0 || i === 3 ? 'sm:col-span-2' : ''}`} />
      ))}
    </div>
  );
}

function GithubError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="glass flex h-full flex-col items-start justify-center rounded-2xl p-8">
      <LuCircleAlert size={26} className="text-cyan" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-semibold">GitHub data is unavailable right now</h3>
      <p className="mt-2 max-w-md text-muted">{message} The profile itself is still one click away.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRetry} className="btn btn-ghost">
          <LuRefreshCw size={16} aria-hidden="true" /> Try again
        </button>
        <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <LuGithub size={16} aria-hidden="true" /> Open GitHub profile
        </a>
      </div>
    </div>
  );
}

function ResumeStats() {
  const counts = skillCategories.map((c) => ({ id: c.id, n: skills.filter((s) => s.category === c.id).length }));
  const max = Math.max(...counts.map((c) => c.n));
  return (
    <Card title="From my resume">
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: projects.length, l: 'Projects' },
          { v: skills.length, l: 'Skills' },
          { v: skillCategories.length, l: 'Skill areas' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-line px-2 py-2.5 text-center">
            <p className="font-display text-2xl font-semibold">{s.v}</p>
            <p className="text-[0.72rem] text-muted">{s.l}</p>
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {counts.map((c, i) => (
          <li key={c.id} className="grid grid-cols-[8.75rem_1fr_1.25rem] items-center gap-2 text-[0.8rem]">
            <span className="truncate text-muted">{c.id}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--bg-2)_80%,transparent)]">
              <span className="bar-grow block h-full rounded-full bg-gradient-to-r from-blue to-violet" style={{ width: `${(c.n / max) * 100}%`, ['--i' as string]: i } as React.CSSProperties} />
            </span>
            <span className="text-right text-faint">{c.n}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function QuickLinks() {
  const items = [
    { href: profile.links.github, label: 'GitHub', sub: '@' + profile.githubUser, icon: LuGithub },
    { href: profile.links.linkedin, label: 'LinkedIn', sub: 'vijay-premanand-7a827628b', icon: LuLinkedin },
    { href: profile.links.leetcode, label: 'LeetCode', sub: 'Vijay11__', icon: LuCode },
    { href: profile.links.email, label: 'Email', sub: profile.email, icon: LuMail },
  ];
  return (
    <Card title="Quick access">
      <ul className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              {...(it.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex h-full flex-col gap-1 rounded-xl border border-line px-3 py-3 transition-colors hover:border-[color-mix(in_srgb,var(--cyan)_45%,transparent)]"
            >
              <it.icon size={18} aria-hidden="true" className="text-cyan" />
              <span className="text-sm font-medium">{it.label}</span>
              <span className="truncate text-[0.72rem] text-faint">{it.sub}</span>
            </a>
          </li>
        ))}
        <li className="col-span-2">
          <a href={profile.resumeUrl} download={profile.resumeFileName} className="btn btn-primary w-full justify-center !py-2.5 text-sm">
            <LuDownload size={16} aria-hidden="true" /> Download resume (PDF)
          </a>
        </li>
      </ul>
    </Card>
  );
}
