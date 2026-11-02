import { useEffect, useLayoutEffect, useRef } from 'react';
import { About } from './components/About';
import { Achievements } from './components/Achievements';
import { BackToTop, Cursor, Footer, Loader, NotFound } from './components/Chrome';
import { Contact, Links } from './components/Contact';
import { Dashboard } from './components/Dashboard';
import { Experience } from './components/Experience';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { ProjectDetail } from './components/ProjectDetail';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { projects } from './data/projects';
import { usePrefersReducedMotion, useTheme } from './lib/hooks';
import { scrollToHash, useRoute } from './lib/router';

const HOME_TITLE = 'Vijay P | Full-stack & AI/ML Developer';
const HOME_DESC =
  'Portfolio of Vijay P, a Computer Science undergraduate at VIT Chennai building secure, intelligent systems: decentralized V2X, explainable ML, blockchain identity, and IoT-attested messaging.';

export default function App() {
  const route = useRoute();
  const reduced = usePrefersReducedMotion();
  const [theme, toggleTheme] = useTheme();
  const routeKey = route.name === 'project' ? `p-${route.slug}` : route.name;
  const prevKey = useRef(routeKey);

  useLayoutEffect(() => {
    const changedPage = prevKey.current !== routeKey;
    prevKey.current = routeKey;
    if (route.name === 'home') {
      document.title = HOME_TITLE;
      document.querySelector('meta[name="description"]')?.setAttribute('content', HOME_DESC);
      if (route.hash) {
        // Wait a frame so the sections exist before scrolling to one.
        requestAnimationFrame(() => scrollToHash(route.hash, changedPage || reduced ? 'auto' : 'smooth'));
      } else if (changedPage) {
        window.scrollTo(0, 0);
      }
    } else if (changedPage) {
      window.scrollTo(0, 0);
    }
  }, [routeKey, route, reduced]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  const project = route.name === 'project' ? projects.find((p) => p.slug === route.slug) : undefined;

  return (
    <>
      <Loader />
      <div className="ambient" aria-hidden="true" />
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="orb orb-c" aria-hidden="true" />
      <Cursor />
      <a href="#main" className="sr-only z-[60] rounded-lg bg-panel-strong px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Nav onHome={route.name === 'home'} theme={theme} toggleTheme={toggleTheme} />
      <main id="main" key={routeKey} className={route.name === 'home' ? '' : 'min-h-[80svh]'}>
        {route.name === 'home' && (
          <>
            <Hero reduced={reduced} />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <Dashboard />
            <Links />
            <Contact />
          </>
        )}
        {route.name === 'project' && (project ? <ProjectDetail project={project} /> : <NotFound path={`/projects/${route.slug}`} />)}
        {route.name === 'notFound' && <NotFound path={route.path} />}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
