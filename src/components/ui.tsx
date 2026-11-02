import type { ReactNode, CSSProperties } from 'react';
import { useMagnetic, useReveal } from '../lib/hooks';
import { onInternalLinkClick } from '../lib/router';

export function Section({
  id,
  title,
  intro,
  children,
  className = '',
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>(0.2);
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div ref={ref} className="reveal mb-10 max-w-2xl md:mb-14">
        <h2 id={`${id}-title`} className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
        {intro && <p className="mt-4 text-base text-muted sm:text-lg">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

/** A group whose direct children fade in one after another when scrolled into view. */
export function RevealGroup({
  children,
  className = '',
  as: Tag = 'div',
  threshold = 0.1,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
  threshold?: number;
}) {
  const ref = useReveal<HTMLDivElement>(threshold);
  const El = Tag as 'div';
  return (
    <El ref={ref} className={`reveal-group ${className}`}>
      {children}
    </El>
  );
}

export const stagger = (i: number): CSSProperties => ({ ['--i' as string]: i });

export function ExternalLink({
  href,
  children,
  className = '',
  label,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const isMail = href.startsWith('mailto:') || href.startsWith('tel:');
  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      {...(isMail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {children}
    </a>
  );
}

/** Button-styled link with a subtle magnetic pull. Internal hrefs navigate client-side. */
export function MagneticLink({
  href,
  children,
  variant = 'ghost',
  external,
  download,
  className = '',
  label,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  external?: boolean;
  download?: string;
  className?: string;
  label?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>();
  const ext = external ?? /^https?:/.test(href);
  return (
    <a
      ref={ref}
      href={href}
      aria-label={label}
      data-cursor="hover"
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} ${className}`}
      onClick={!ext && !download ? onInternalLinkClick : undefined}
      download={download}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

/** Updates --mx/--my so `.spotlight` cards light up under the pointer. */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
