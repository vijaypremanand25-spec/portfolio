# Vijay P — Developer Portfolio

Personal portfolio of **Vijay P**, B.Tech Computer Science and Engineering student at VIT Chennai (2023 – 2027).

It presents my projects, skills, education, achievements, a live GitHub dashboard, and a contact form, with a downloadable resume.

## Projects featured

| Project | What it is | Repository |
| --- | --- | --- |
| Decentralized V2X Ecosystem | Peer-to-peer vehicle hazard sharing, roadside edge inference, federated learning, digital twin | [Decentralized_V2X](https://github.com/vijaypremanand25-spec/Decentralized_V2X) |
| Diabetes 30-Day Readmission Prediction | LightGBM + SHAP risk model served through FastAPI and Streamlit | [HDA](https://github.com/vijaypremanand25-spec/HDA) |
| TourSecure | Tourist safety platform with geofencing, SOS, and an ERC-721 digital ID | [Tour_Secure_1](https://github.com/vijaypremanand25-spec/Tour_Secure_1) |
| PhysiLock | IoT-attested secure messaging with risk-based authentication | [PhysiLock](https://github.com/vijaypremanand25-spec/PhysiLock) |

## Tech stack

- **React 19** with **TypeScript**
- **Tailwind CSS v4** for styling, with custom design tokens for dark and light themes
- **esbuild** for bundling (see `scripts/build.mjs`)
- **react-icons** (Lucide and Simple Icons sets)
- Hand-written animation: a canvas peer-to-peer mesh in the hero, scroll reveals, a typing effect, magnetic buttons, a custom cursor, and SVG architecture diagrams with moving packets
- Public **GitHub REST API** for the dashboard, with a fallback state when it is unavailable

All animation respects `prefers-reduced-motion`.

## Running locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173 with rebuild on save
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
npm run typecheck  # TypeScript type check
```

## Editing content

Everything shown on the site comes from three data files:

- `src/data/profile.ts`: name, contact links, about text, timeline, achievements
- `src/data/projects.ts`: project case studies (overview, problem, solution, features, metrics)
- `src/data/skills.ts`: skills and their categories

To update the resume download, replace `public/Vijay_P_Resume.pdf`.

## Structure

```
src/
  components/   page sections (Hero, About, Skills, Projects, Dashboard, ...)
  data/         content from the resume and project repositories
  lib/          router, hooks, GitHub API client
  styles.css    Tailwind entry and design tokens
public/         resume PDF, images, favicon, social preview image
scripts/        build and dev server
```

## Deployment

Deployed on Vercel. `vercel.json` sets the build command, the `dist` output folder, and a rewrite so project pages such as `/projects/physilock` and the custom 404 page work on direct visits.
