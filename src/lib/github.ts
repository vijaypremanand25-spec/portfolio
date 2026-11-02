import { useEffect, useState } from 'react';

// Live data from the public GitHub REST API (no token, 60 requests/hour per
// visitor). Responses are cached in sessionStorage for 10 minutes. If the API is
// unreachable or rate-limited, the dashboard shows an explicit fallback instead
// of made-up numbers.

export type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

export type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  size: number;
};

export type GhEvent = { type: string; created_at: string; repo: { name: string } };

export type GithubData = { user: GhUser; repos: GhRepo[]; events: GhEvent[]; fetchedAt: number };

export type GithubState =
  | { status: 'loading' }
  | { status: 'ready'; data: GithubData }
  | { status: 'error'; message: string };

const TTL = 10 * 60 * 1000;

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (res.status === 403 || res.status === 429) throw new Error('GitHub’s hourly limit for unsigned requests has been reached. Try again later.');
  if (res.status === 404) throw new Error('That GitHub profile could not be found.');
  if (!res.ok) throw new Error(`GitHub returned an error (${res.status}).`);
  return res.json() as Promise<T>;
}

export function useGithub(username: string, attempt: number): GithubState {
  const [state, setState] = useState<GithubState>({ status: 'loading' });

  useEffect(() => {
    const key = `gh:${username}`;
    if (attempt === 0) {
      try {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const data = JSON.parse(cached) as GithubData;
          if (Date.now() - data.fetchedAt < TTL) {
            setState({ status: 'ready', data });
            return;
          }
        }
      } catch {
        /* ignore bad cache */
      }
    }

    const ctrl = new AbortController();
    setState({ status: 'loading' });
    const base = `https://api.github.com/users/${encodeURIComponent(username)}`;
    Promise.all([
      getJson<GhUser>(base, ctrl.signal),
      getJson<GhRepo[]>(`${base}/repos?per_page=100&sort=pushed`, ctrl.signal),
      getJson<GhEvent[]>(`${base}/events/public?per_page=100`, ctrl.signal).catch(() => [] as GhEvent[]),
    ])
      .then(([user, repos, events]) => {
        const data: GithubData = { user, repos, events, fetchedAt: Date.now() };
        try {
          sessionStorage.setItem(key, JSON.stringify(data));
        } catch {
          /* storage full or unavailable */
        }
        setState({ status: 'ready', data });
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        const message =
          err instanceof Error && !(err instanceof TypeError) ? err.message : 'GitHub could not be reached from this network.';
        setState({ status: 'error', message });
      });
    return () => ctrl.abort();
  }, [username, attempt]);

  return state;
}

export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Solidity: '#AA6746',
  HTML: '#e34c26',
  CSS: '#663399',
  'Jupyter Notebook': '#DA5B0B',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
};

export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [30, 'day'],
    [12, 'month'],
    [Infinity, 'year'],
  ];
  let v = s;
  for (const [n, unit] of units) {
    if (Math.abs(v) < n) return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.round(v), unit);
    v /= n;
  }
  return '';
}
