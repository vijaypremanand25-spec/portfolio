// Production build: esbuild bundles the TypeScript/React app, Tailwind CSS v4
// compiles the styles from the class names used in src/, and index.html is
// filled in with hashed asset names. Run with `npm run build`; `--watch` and
// `--serve` power `npm run dev`.

import { build, context, transform } from 'esbuild';
import { compile } from 'tailwindcss';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const require = createRequire(import.meta.url);
const twDir = path.dirname(require.resolve('tailwindcss/package.json'));

const args = new Set(process.argv.slice(2));
const dev = args.has('--watch') || args.has('--serve');

const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '');

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

/** Collect every token in the sources that could be a Tailwind class. Tailwind ignores the ones that are not. */
async function candidates() {
  const files = (await walk(src)).filter((f) => /\.(tsx?|html)$/.test(f));
  files.push(path.join(root, 'index.html'));
  const set = new Set();
  for (const f of files) {
    const text = await fs.readFile(f, 'utf8');
    // Split like Tailwind's own extractor: on whitespace, quotes, and JSX/template
    // delimiters, but not on parentheses or commas, which arbitrary values use.
    for (const tok of text.split(/[\s"'`{}<>;]+/)) {
      if (!tok || tok.length > 200) continue;
      set.add(tok);
      // Also try the token with trailing punctuation removed (e.g. "flex," or "flex)").
      const trimmed = tok.replace(/[),.]+$/, '');
      if (trimmed !== tok) set.add(trimmed);
    }
  }
  return [...set];
}

async function buildCss() {
  const entry = path.join(src, 'styles.css');
  const compiler = await compile(await fs.readFile(entry, 'utf8'), {
    base: src,
    loadStylesheet: async (id, base) => {
      const file = id === 'tailwindcss' ? path.join(twDir, 'index.css') : path.resolve(base, id);
      return { path: file, base: path.dirname(file), content: await fs.readFile(file, 'utf8') };
    },
  });
  const css = compiler.build(await candidates());
  const { code } = await transform(css, { loader: 'css', minify: !dev, target: ['chrome110', 'safari16', 'firefox115'] });
  return code;
}

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

async function copyPublic() {
  const pub = path.join(root, 'public');
  await fs.cp(pub, dist, { recursive: true });
}

async function writeHtml(jsName, cssName) {
  let html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  html = html
    .replace('%STYLES%', `<link rel="stylesheet" href="/assets/${cssName}" />`)
    .replace('%SCRIPTS%', `<script type="module" src="/assets/${jsName}"></script>`)
    .replace('%CANONICAL%', siteUrl ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />` : '')
    .replaceAll('%SITE_URL%', siteUrl);
  await fs.writeFile(path.join(dist, 'index.html'), html);
}

const esbuildOptions = {
  entryPoints: [path.join(src, 'main.tsx')],
  bundle: true,
  format: 'esm',
  splitting: false,
  target: ['chrome110', 'safari16', 'firefox115'],
  jsx: 'automatic',
  loader: { '.css': 'empty' },
  define: { 'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production') },
  minify: !dev,
  sourcemap: dev ? 'inline' : false,
  legalComments: 'none',
  logLevel: 'warning',
};

async function buildOnce() {
  const t0 = performance.now();
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(path.join(dist, 'assets'), { recursive: true });
  await copyPublic();

  const result = await build({ ...esbuildOptions, write: false, metafile: true });
  const js = result.outputFiles[0].text;
  const jsName = `app-${hash(js)}.js`;
  await fs.writeFile(path.join(dist, 'assets', jsName), js);

  const css = await buildCss();
  const cssName = `app-${hash(css)}.css`;
  await fs.writeFile(path.join(dist, 'assets', cssName), css);

  await writeHtml(jsName, cssName);
  const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
  console.log(`built in ${Math.round(performance.now() - t0)} ms: ${jsName} ${kb(js.length)}, ${cssName} ${kb(css.length)}${siteUrl ? `, site ${siteUrl}` : ''}`);
}

if (!dev) {
  await buildOnce();
} else {
  // Development: rebuild on change and serve dist/ with SPA fallback.
  await buildOnce();
  const ctx = await context({
    ...esbuildOptions,
    outfile: path.join(dist, 'assets', 'dev.js'),
    plugins: [
      {
        name: 'rebuild-css-html',
        setup(b) {
          b.onEnd(async () => {
            const css = await buildCss();
            await fs.writeFile(path.join(dist, 'assets', 'dev.css'), css);
            await writeHtml('dev.js', 'dev.css');
            console.log('rebuilt', new Date().toLocaleTimeString());
          });
        },
      },
    ],
  });
  await ctx.watch();
  if (args.has('--serve')) {
    const { port } = await ctx.serve({ servedir: dist, port: Number(process.env.PORT) || 5173, fallback: path.join(dist, 'index.html') });
    console.log(`dev server: http://localhost:${port}`);
  }
}
