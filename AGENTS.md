# Portfolio — agent instructions

## Commands
- `pnpm dev` — dev server at localhost:4321
- `pnpm build` — builds to `dist/`
- `pnpm preview` — preview production build
- `pnpm astro` — astro CLI
- No test/lint/typecheck scripts exist. `astro check` is available for type checking.

## Architecture
- **Astro 6** + **Tailwind CSS v4** (Vite plugin, not PostCSS). Theme vars via `@theme` directive in component stylesheets.
- **pnpm** (v11.5.0), Node >= 22.12.0. Single-package repo (workspace yaml only allows esbuild/sharp).
- **Theme-based layout**: `src/themes/minimalist/` contains pages, components, assets, styles. Swap by pointing `src/pages/index.astro` to a different theme.
- **Path alias**: `@/*` maps to `./src/*` (configured in tsconfig.json, used via `import.meta.env.BASE_URL` for asset paths).
- **Deploy**: GitHub Pages, base URL `/portfolio` (set in `astro.config.mjs`). CI workflow at `.github/workflows/deploy.yml` (push to main).
- **Content**: `astro:content` with Zod schema in `src/content.config.ts`. Projects loaded from `src/content/projects/` markdown files.
- **Analytics**: Firebase Analytics via `firebase` npm package. Config from `PUBLIC_FIREBASE_*` env vars (copy `.env.example` to `.env`). Lazy-init module at `src/lib/firebase.ts`.

## Component structure
- `src/pages/index.astro` — entry, wraps theme page in shared Layout
- `src/layouts/Layout.astro` — HTML shell (`<slot />` for content)
- `src/themes/minimalist/pages/index.astro` — page shell (nav + Hero + AboutMe + Projects + Contact + footer)
- Hero — typed.js animation, desktop (screen mockup) / mobile (phone mockup) variants
- AboutMe — `data-reveal` IntersectionObserver stagger animation (opacity + translateY). Reads `src/content/about.md`.
- Projects — contains `TaraProject` component. Currently hardcoded single entry.
- TaraProject — native `<dialog>` modal opened via `commandfor`/`command="show-modal"` (Chromium-only declarative show-modal API, requires Chrome 133+). Card is a `<button>` wrapping `<Image>`. Close button uses `command="close"`.
- Contact — three `<a>` tags (email, LinkedIn, GitHub) with `data-contact` attributes. No form.

## Analytics events
All events fire via `import { logEvent } from "@/lib/firebase"` in each component's `<script>`:
- `session_start` — Layout on DOMContentLoaded (first page entry)
- `view_about_section` — AboutMe, when IntersectionObserver triggers (once)
- `view_projects_section` — Projects, when IntersectionObserver triggers (once)
- `open_project_modal` — TaraProject button click
- `view_contact_section` — Contact, when IntersectionObserver triggers (once)
- `click_contact` — Contact link click, with `type` param (email/linkedin/github)

## Style conventions
- Prettier with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`. Astro files use `parser: "astro"`.
- CSS: Tailwind utility classes + scoped `<style>` blocks. No separate CSS modules.
- `@theme` blocks in component files define `--color-accent-*` and `--font-*` custom properties.
- Fonts: "Readex Pro" (headings), "Elms Sans" (body), "Roboto Mono" (code). Loaded via Google Fonts import in theme stylesheet.

## Gotchas
- The `commandfor`/`command` attribute on dialog buttons is non-standard (Chromium-only). If behavior needs to work in Firefox/Safari, switch to `showModal()` / `close()` in a `<script>`.
- Firebase Analytics config comes from `PUBLIC_FIREBASE_*` env vars (required at build time for client-side access). Without them, `logEvent` silently no-ops.
- `src/styles/global.css` only imports Tailwind + typography plugin. Theme-specific styles go in the theme's stylesheet.
