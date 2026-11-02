import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LuDownload, LuMenu, LuMoon, LuSun, LuX } from 'react-icons/lu';
import { profile } from '../data/profile';
import { useActiveSection, useScrolledPast, type Theme } from '../lib/hooks';
import { navigate } from '../lib/router';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'contact', label: 'Contact' },
] as const;

const IDS = NAV_ITEMS.map((n) => n.id);

export function Monogram({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--cyan)" />
          <stop offset="0.5" stopColor="var(--blue)" />
          <stop offset="1" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="none" stroke="url(#mg)" strokeWidth="1.6" />
      <path d="M9 12 L15.5 28 L22 12" fill="none" stroke="url(#mg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.5 28 V12 H28.5 a4.6 4.6 0 0 1 0 9.2 H24.5" fill="none" stroke="url(#mg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Nav({ onHome, theme, toggleTheme }: { onHome: boolean; theme: Theme; toggleTheme: () => void }) {
  const active = useActiveSection(IDS, onHome);
  const scrolled = useScrolledPast(12);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (!onHome) return setPill(null);
      const li = listRef.current?.querySelector<HTMLAnchorElement>(`a[data-id="${active}"]`)?.parentElement;
      if (li) setPill({ left: li.offsetLeft, width: li.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const to = id === 'home' ? '/#home' : `/#${id}`;
    if (open) {
      // Release the menu's scroll lock before scrolling to the section.
      setOpen(false);
      document.body.style.overflow = '';
      requestAnimationFrame(() => navigate(to));
    } else {
      navigate(to);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || !onHome ? 'py-2.5' : 'py-4'}`}
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-all duration-300 sm:mx-5 lg:mx-auto ${
          scrolled || !onHome ? 'glass' : 'border border-transparent'
        }`}
      >
        <a href="/#home" onClick={(e) => go(e, 'home')} className="flex items-center gap-2.5 rounded-lg pr-2" data-cursor="hover">
          <Monogram />
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">{profile.name}</span>
        </a>

        <ul ref={listRef} className="relative hidden items-center lg:flex">
          {pill && (
            <li
              aria-hidden="true"
              className="absolute top-0 bottom-0 -z-0 rounded-lg bg-[color-mix(in_srgb,var(--blue)_16%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--blue)_35%,transparent)] transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ left: pill.left, width: pill.width }}
            />
          )}
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="relative">
              <a
                href={`/#${item.id}`}
                data-id={item.id}
                onClick={(e) => go(e, item.id)}
                aria-current={onHome && active === item.id ? 'true' : undefined}
                className={`relative block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  onHome && active === item.id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-ink"
            data-cursor="hover"
          >
            {theme === 'dark' ? <LuSun size={17} /> : <LuMoon size={17} />}
          </button>
          <a
            href={profile.resumeUrl}
            download={profile.resumeFileName}
            className="btn btn-primary hidden !px-3.5 !py-2 text-sm sm:inline-flex"
            data-cursor="hover"
          >
            <LuDownload size={16} aria-hidden="true" /> Resume
          </a>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <LuX size={18} /> : <LuMenu size={18} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-x-3 top-[4.6rem] origin-top rounded-2xl glass !bg-panel-strong p-3 transition-all duration-300 lg:hidden ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
      >
        <ul className="grid grid-cols-2 gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`/#${item.id}`}
                onClick={(e) => go(e, item.id)}
                tabIndex={open ? 0 : -1}
                className={`block rounded-xl px-3 py-2.5 text-[0.95rem] ${
                  onHome && active === item.id ? 'bg-[color-mix(in_srgb,var(--blue)_16%,transparent)] text-ink' : 'text-muted'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeUrl}
          download={profile.resumeFileName}
          tabIndex={open ? 0 : -1}
          className="btn btn-primary mt-3 w-full justify-center sm:hidden"
        >
          <LuDownload size={16} aria-hidden="true" /> Download resume
        </a>
      </div>
    </header>
  );
}
