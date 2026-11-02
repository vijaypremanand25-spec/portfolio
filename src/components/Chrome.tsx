import { useEffect, useRef, useState } from 'react';
import { LuArrowLeft, LuArrowUp, LuGithub, LuLinkedin, LuMail, LuCode } from 'react-icons/lu';
import { profile } from '../data/profile';
import { useScrolledPast } from '../lib/hooks';
import { onInternalLinkClick } from '../lib/router';
import { Monogram, NAV_ITEMS } from './Nav';

export function Footer() {
  const socials = [
    { href: profile.links.github, label: 'GitHub', icon: LuGithub },
    { href: profile.links.linkedin, label: 'LinkedIn', icon: LuLinkedin },
    { href: profile.links.leetcode, label: 'LeetCode', icon: LuCode },
    { href: profile.links.email, label: 'Email', icon: LuMail },
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram size={30} />
          <div>
            <p className="font-display font-semibold">{profile.name}</p>
            <p className="text-sm text-faint">
              © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {NAV_ITEMS.slice(1).map((n) => (
            <a key={n.id} href={`/#${n.id}`} onClick={onInternalLinkClick} className="hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
        <ul className="flex gap-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.href.startsWith('http') ? `${s.label} (opens in a new tab)` : s.label}
                {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <s.icon size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export function BackToTop() {
  const show = useScrolledPast(700);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      tabIndex={show ? 0 : -1}
      data-cursor="hover"
      className={`glass fixed right-5 bottom-5 z-40 grid h-12 w-12 place-items-center rounded-2xl text-ink transition-all duration-500 hover:-translate-y-1 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <LuArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

export function Loader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minDelay = new Promise((r) => setTimeout(r, reduced ? 0 : 750));
    const fonts = (document.fonts?.ready ?? Promise.resolve()).catch(() => undefined);
    const cap = new Promise((r) => setTimeout(r, 2200));
    Promise.race([Promise.all([minDelay, fonts]), cap]).then(() => {
      setDone(true);
      setTimeout(() => setGone(true), 600);
    });
  }, []);
  if (gone) return null;
  return (
    <div className="loader" data-done={done} aria-hidden="true">
      <svg className="loader-mark" width="72" height="72" viewBox="0 0 40 40">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="0.5" stopColor="var(--blue)" />
            <stop offset="1" stopColor="var(--violet)" />
          </linearGradient>
        </defs>
        <path d="M9 12 L15.5 28 L22 12" fill="none" stroke="url(#lg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24.5 28 V12 H28.5 a4.6 4.6 0 0 1 0 9.2 H24.5" fill="none" stroke="url(#lg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** A soft ring that trails the pointer on desktop and grows over interactive elements. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    const root = document.documentElement;
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.classList.add('cursor-on');
      const t = e.target as Element | null;
      const interactive = t?.closest('a, button, select, [data-cursor="hover"], input, textarea, label');
      root.classList.toggle('cursor-hover', !!interactive);
    };
    const leave = () => root.classList.remove('cursor-on');
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      root.classList.remove('cursor-on', 'cursor-hover');
    };
  }, []);
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

export function NotFound({ path }: { path: string }) {
  useEffect(() => {
    document.title = 'Page not found | Vijay P';
  }, []);
  return (
    <section className="page-enter mx-auto grid min-h-[80svh] max-w-3xl place-items-center px-5 pt-24 text-center">
      <div>
        <p className="font-display text-[clamp(6rem,22vw,11rem)] font-bold leading-none tracking-[-0.06em]">
          <span className="gradient-text">404</span>
        </p>
        <h1 className="mt-4 text-3xl font-semibold">This page isn’t on the network</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Nothing lives at <code className="rounded-md bg-panel px-1.5 py-0.5 text-ink">{path}</code>. Head back to the home page or jump straight to the projects.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/" onClick={onInternalLinkClick} className="btn btn-primary">
            <LuArrowLeft size={16} aria-hidden="true" /> Back to home
          </a>
          <a href="/#projects" onClick={onInternalLinkClick} className="btn btn-ghost">
            See projects
          </a>
        </div>
      </div>
    </section>
  );
}
