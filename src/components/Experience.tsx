import { useEffect, useRef } from 'react';
import { LuBookOpen, LuGraduationCap, LuTrophy, LuUsers } from 'react-icons/lu';
import { timeline, type TimelineItem } from '../data/profile';
import { RevealGroup, Section, stagger } from './ui';

const icons: Record<TimelineItem['kind'], typeof LuTrophy> = {
  Education: LuGraduationCap,
  'Academic project': LuBookOpen,
  Leadership: LuUsers,
  Competition: LuTrophy,
};

const order = [0, 4, 3, 1, 2];

export function Experience() {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      const bar = fill.current;
      if (!el || !bar) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / r.height));
      bar.style.transform = `scaleY(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <Section
      id="experience"
      title="Education and experience"
      intro="My degree, academic project work, leadership, and competitions. I have not held an internship yet."
    >
      <div ref={wrap} className="relative pl-12 sm:pl-14">
        <div className="timeline-rail" aria-hidden="true">
          <div ref={fill} className="timeline-fill" style={{ transform: 'scaleY(0)' }} />
        </div>
        <RevealGroup as="ol" className="space-y-6">
          {order.map((k, i) => {
            const item = timeline[k];
            const Icon = icons[item.kind];
            return (
              <li key={item.title} style={stagger(i)} className="relative">
                <span className="absolute top-5 -left-12 grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-bg text-cyan sm:-left-14">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div className="glass rounded-2xl p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-semibold sm:text-xl">{item.title}</h3>
                    <span className="text-sm text-cyan">{item.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-faint">{item.org}</p>
                  <p className="mt-3 text-muted">{item.body}</p>
                </div>
              </li>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
