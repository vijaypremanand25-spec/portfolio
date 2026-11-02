import { useState } from 'react';
import { LuArrowUpRight, LuCheck, LuCode, LuCopy, LuGithub, LuLinkedin, LuMail, LuMapPin, LuSend } from 'react-icons/lu';
import { profile } from '../data/profile';
import { RevealGroup, Section, stagger, trackSpotlight } from './ui';

const linkCards = [
  { label: 'GitHub', handle: 'vijaypremanand25-spec', href: profile.links.github, icon: LuGithub, body: 'Source for every project on this site.' },
  { label: 'LinkedIn', handle: 'vijay-premanand-7a827628b', href: profile.links.linkedin, icon: LuLinkedin, body: 'Background, updates, and connections.' },
  { label: 'LeetCode', handle: 'Vijay11__', href: profile.links.leetcode, icon: LuCode, body: 'Data structures and algorithms practice.' },
  { label: 'Email', handle: profile.email, href: profile.links.email, icon: LuMail, body: 'The quickest way to reach me.' },
];

export function Links() {
  return (
    <Section id="links" title="Find me online" intro="Every profile I keep, in one place.">
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {linkCards.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            style={stagger(i)}
            onPointerMove={trackSpotlight}
            {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={`${l.label}: ${l.handle}${l.href.startsWith('http') ? ' (opens in a new tab)' : ''}`}
            data-cursor="hover"
            className="glass spotlight group flex flex-col rounded-2xl p-5 transition-transform duration-500 hover:-translate-y-1"
          >
            <span className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line text-cyan transition-colors group-hover:border-[color-mix(in_srgb,var(--cyan)_50%,transparent)]">
                <l.icon size={21} aria-hidden="true" />
              </span>
              <LuArrowUpRight size={18} aria-hidden="true" className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
            </span>
            <span className="mt-5 font-display text-lg font-semibold">{l.label}</span>
            <span className="truncate text-sm text-cyan">{l.handle}</span>
            <span className="mt-2 text-sm text-muted">{l.body}</span>
          </a>
        ))}
      </RevealGroup>
    </Section>
  );
}

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

function validate(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter an email address like name@example.com.';
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.';
  return e;
}

export function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    const subject = values.subject.trim() || `Hello from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section id="contact" title="Get in touch" intro="Hiring for a software or AI/ML role, or want to talk about one of these projects? Send me a message.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass flex flex-col rounded-2xl p-6 sm:p-7">
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-cyan">
                <LuMail size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-muted">Email</span>
                <a href={profile.links.email} className="block break-all font-medium hover:text-cyan">
                  {profile.email}
                </a>
                <button type="button" onClick={copy} className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
                  {copied ? <LuCheck size={13} aria-hidden="true" /> : <LuCopy size={13} aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy address'}
                </button>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-cyan">
                <LuMapPin size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-muted">Based in</span>
                <span className="font-medium">{profile.location}</span>
              </span>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
            <a href={profile.links.email} className="btn btn-primary">
              <LuMail size={17} aria-hidden="true" /> Email me
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <LuLinkedin size={17} aria-hidden="true" /> LinkedIn
            </a>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <LuGithub size={17} aria-hidden="true" /> GitHub
            </a>
          </div>
        </div>

        <form noValidate onSubmit={submit} className="glass rounded-2xl p-6 sm:p-7" aria-describedby="cf-note">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Your name" error={errors.name}>
              <input id="cf-name" name="name" autoComplete="name" value={values.name} onChange={update('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} className={inputCls(!!errors.name)} />
            </Field>
            <Field id="email" label="Your email" error={errors.email}>
              <input id="cf-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} className={inputCls(!!errors.email)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field id="subject" label="Subject (optional)">
              <input id="cf-subject" name="subject" value={values.subject} onChange={update('subject')} className={inputCls(false)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field id="message" label="Message" error={errors.message}>
              <textarea id="cf-message" name="message" rows={5} value={values.message} onChange={update('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} className={`${inputCls(!!errors.message)} resize-y`} />
            </Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-primary" data-cursor="hover">
              <LuSend size={16} aria-hidden="true" /> Send message
            </button>
            <p id="cf-note" className="text-sm text-faint" aria-live="polite">
              {sent ? 'Your email app should now be open with the message filled in. Press send there to deliver it.' : 'Opens your email app with the message filled in.'}
            </p>
          </div>
        </form>
      </div>
    </Section>
  );
}

const inputCls = (bad: boolean) =>
  `w-full rounded-xl border bg-[color-mix(in_srgb,var(--bg-2)_55%,transparent)] px-4 py-3 text-ink placeholder:text-faint outline-none transition-colors focus:border-cyan ${
    bad ? 'border-red-400/70' : 'border-line'
  }`;

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`cf-${id}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`cf-${id}-err`} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
