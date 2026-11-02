import { useEffect, useState } from 'react';

// A tiny path router: "/" is the home page, "/projects/:slug" is a project
// page, and anything else renders the 404 view. Vercel rewrites every path to
// index.html so deep links work.

export type Route =
  | { name: 'home'; hash: string }
  | { name: 'project'; slug: string }
  | { name: 'notFound'; path: string };

export function parseRoute(pathname: string, hash: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path === '/index.html') return { name: 'home', hash };
  const m = path.match(/^\/projects\/([a-z0-9-]+)$/);
  if (m) return { name: 'project', slug: m[1] };
  return { name: 'notFound', path };
}

const listeners = new Set<() => void>();

export function navigate(to: string) {
  const url = new URL(to, window.location.origin);
  const samePage = url.pathname === window.location.pathname;
  if (samePage && url.hash) {
    scrollToHash(url.hash);
    history.replaceState(null, '', url.pathname + url.hash);
    return;
  }
  history.pushState(null, '', url.pathname + url.hash);
  listeners.forEach((l) => l());
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = 'smooth') {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: 'start' });
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname, window.location.hash));
  useEffect(() => {
    const update = () => setRoute(parseRoute(window.location.pathname, window.location.hash));
    listeners.add(update);
    window.addEventListener('popstate', update);
    return () => {
      listeners.delete(update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return route;
}

/** Intercept same-origin link clicks so internal navigation stays client-side. */
export function onInternalLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const a = e.currentTarget;
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target && a.target !== '_self') return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  e.preventDefault();
  navigate(href);
}
