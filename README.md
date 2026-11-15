# Bruno Santos · Portfolio

My personal site: experience, projects, courses and contact, in English and Portuguese.

Live at **https://brun0sant0s.github.io/myCV/**

## Stack

React 19, Vite 6, Tailwind CSS 3 and framer-motion. The contact form sends through EmailJS. The site is hosted on GitHub Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Development server at http://localhost:3000/myCV/ |
| `npm run lint` | ESLint over `src/` |
| `npm run format` | Prettier over the source files |
| `npm test` | Builds the site and runs the Playwright checks in `tests/` (uses the installed Chrome) |
| `npm run deploy` | Lint, build and test, then publish `build/` to the `gh-pages` branch |

## Where things are

```
src/
  App.jsx               the page, section by section
  components/
    layout/             tab bar (EditorNav) and the big section titles
    sections/           Hero, About, Experience (+ experience/), Projects, Certifications, Contacts
    ui/                 small shared pieces (tech badges, carousel controls)
  hooks/                autoplay, scroll reveal, media queries
  data/                 content in English: projects, timeline, courses
  i18n/                 interface texts (strings.js) and the Portuguese content (data.js)
  assets/               photos, project logos and screenshots (assets/projects/media)
public/                 favicons, social image, CV and certificate PDFs
tests/                  Playwright checks run before each deploy
```

## Editing content

- **Projects, timeline, courses:** edit the English text in `src/data/*.json`, then the Portuguese one in `src/i18n/data.js`. It uses the same `id`, so a missing translation shows in English, with a warning in the console while developing.
- **Screenshots:** add a `.jpg` to `src/assets/projects/media/` and reference its file name (without the extension) in the project's `media.items`.
- **Interface texts** (buttons, titles, labels): `src/i18n/strings.js`, both languages side by side.
- **CV:** replace `public/documents/CV_BRUNO_EN.pdf` and `CV_BRUNO_PT.pdf`.
