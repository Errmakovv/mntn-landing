# MNTN — Hiking Guide Landing Page

A pixel-careful implementation of the **MNTN** landing page design from Figma, built without a UI framework:
semantic HTML, SCSS and a small amount of TypeScript.

> Design: [MNTN – Landing Page](https://www.figma.com/community/file/788675347108478517/mntn-landing-page)
> by **Kryston Schwarze**, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
> The code in this repository is my own implementation of that design.

## Stack

| Tool           | Why                                                                     |
| -------------- | ----------------------------------------------------------------------- |
| **Vite**       | dev server with HMR, production build, asset hashing                    |
| **SCSS**       | design tokens, `fluid()` helper, breakpoint mixins, BEM partials        |
| **TypeScript** | parallax, scroll reveal, section slider, mobile menu (~160 lines, strict) |

No React/Next: a single static page with no routing or app state doesn't need them.

## Features

- **Layered parallax hero.** The Figma file has three separate image layers (sky, mountains, foreground hill). The
  headline sits *between* the layers, like in the design, and each layer moves at its own speed on scroll.
- **Proportional hero "stage".** The layer positions come straight from the 1920px artboard (`top: 464/1920` etc.),
  so the composition keeps its proportions at any width. On phones the stage is wider than the screen and anchored
  to the bottom of the hero.
- **Fluid typography and spacing.** `fluid($min, $max)` returns `clamp()` that equals the Figma value at 1920px
  and scales down smoothly.
- **Section slider** (Start / 01 / 02 / 03) tracks the section in view with `IntersectionObserver` and works as
  navigation.
- **Scroll reveal** for text and a clip-path reveal for photos.
- **Accessibility.** Skip link, semantic landmarks, real links and buttons, `aria-expanded` burger, Esc closes the
  menu, visible focus styles, meaningful `alt` text, and every animation respects `prefers-reduced-motion`.
- **Performance.** WebP images (hero layers about 400 KB total instead of 5.7 MB of PNG/JPG), `srcset` for photos,
  lazy loading below the fold, a `requestAnimationFrame`-throttled scroll handler, and only `transform`/`opacity`
  animated.
- **Responsive**: 1920 → 1440 → tablet → 360px phones.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Project structure

```
mntn/
├── index.html
├── public/
│   ├── favicon.svg
│   └── images/            # WebP exports from the Figma file
├── src/
│   ├── main.ts            # menu, parallax, reveal, section slider
│   └── styles/
│       ├── main.scss
│       ├── _tokens.scss   # colors, fonts, breakpoints, fluid()
│       ├── _base.scss     # reset + shared pieces (tagline, "read more")
│       ├── _header.scss
│       ├── _side-ui.scss  # "Follow us" + section slider
│       ├── _hero.scss
│       ├── _articles.scss
│       └── _footer.scss
├── tsconfig.json
└── vite.config.ts
```

## Notes on fidelity

- The design uses **Chronicle Display** and **Gilroy**, which are commercial fonts. They are replaced with the
  closest free Google Fonts: **Playfair Display** and **Urbanist**. Playfair runs wider, so the hero headline box
  is 1080px instead of 950px to keep the two-line break.
- Colors, sizes, spacing, letter-spacing and layer positions are taken from the Figma file's inspect data.

## Deploy

`vite.config.ts` uses `base: './'`, so the `dist/` folder works on GitHub Pages, Netlify or Vercel as-is.
