# Adhikari Hari Charan Portfolio

A cinematic personal portfolio built with Vue 3, Vite, and Tailwind CSS. The site includes an animated intro, interactive single-page sections, a floating Bee AI assistant, a compact profile view, project showcases, experience timeline, certificates carousel, and a contact form.

## Features

- Animated intro flow with a Spline-powered hero
- Single-page portfolio with smooth section navigation
- Floating `Bee AI` assistant with draggable and resizable chat window
- Project cards, experience timeline, certificates carousel, and UI gallery
- Compact profile modal with skills, education, and links
- Contact form powered by Web3Forms

## Tech Stack

- Vue 3
- Vite
- Tailwind CSS
- Lucide Vue
- LangChain
- Google Gemini API

## Project Structure

```text
.
├── public/                     # Static images, audio, and resume files
├── src/
│   ├── assets/tailwind.css
│   ├── components/
│   │   ├── BeeAssistant.vue    # Floating Bee AI chat UI
│   │   ├── HeroHUD.vue         # Main portfolio page and section content
│   │   ├── IntroSequence.vue   # Intro animation sequence
│   │   ├── IntroStart.vue      # Intro start screen
│   │   └── Profile.vue         # Profile modal
│   ├── data/
│   │   └── portfolio.ts        # Portfolio content and metadata
│   ├── lib/
│   │   └── beeAgent.ts         # Bee AI LangChain + Gemini logic
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.mjs
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Create env file

Create a `.env` file in the project root:

```env
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### Start development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Customization

Most portfolio data lives in:

- `src/data/portfolio.ts` for personal info, skills, experience, projects, certificates, and links
- `src/components/HeroHUD.vue` for section layout and contact flow
- `src/components/BeeAssistant.vue` and `src/lib/beeAgent.ts` for Bee AI behavior

Static media such as project images, logos, and resume files live in `public/`.

## Bee AI Notes

Bee AI uses LangChain with the Google Gemini API from the client. For local development, set `VITE_GOOGLE_API_KEY` in `.env`.

If you plan to deploy Bee AI publicly, moving Gemini calls behind a backend or serverless function is safer than exposing a browser-side API key.

## Contact Form

The contact form is currently integrated with Web3Forms from `src/components/HeroHUD.vue`.

If you want to change the mail provider later, update the contact submission logic there.

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```
