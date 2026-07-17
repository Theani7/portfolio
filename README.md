# Anil Paneru — Portfolio

A modern, responsive portfolio website for an ML Engineer & AI Developer, built with React, Vite, and Tailwind CSS.

## Overview

This portfolio showcases AI and machine learning projects, featuring a clean material-design-inspired interface with smooth animations, dark mode support, and interactive elements.

## Features

- **Responsive Design** - Mobile-first layout with adaptive GitHub calendar (4-8 months view)
- **Dark Mode** - Toggle with smooth view transition animations
- **Project Gallery** - Dynamic project showcase with markdown-driven content
- **Spotify Integration** - Live "Now Playing" widget with audio preview and progress visualization
- **Command Palette** - Cmd+K fuzzy search (projects, skills, navigation) + inline calculator
- **Snake Game** - 404 page includes a playable Snake game (WASD/arrow keys)
- **PWA Support** - Service worker for offline capabilities
- **Oneko Cursor** - Animated cat cursor follower on desktop
- **Page Transitions** - Framer Motion animations between routes

## Tech Stack

### Frontend
- React 19, Vite 7, TypeScript
- Tailwind CSS 4 with custom theme
- Framer Motion (animations)
- React Router 7 (SPA routing)
- cmdk + Fuse.js (command palette)
- Lucide React (icons)
- React Markdown + remark-gfm
- React GitHub Calendar

### Backend
- Vercel Edge Functions (`api/spotify.ts`)
- Spotify API integration for "Now Playing" widget

## Project Structure

```
portfolio/
├── api/
│   └── spotify.ts          # Spotify API endpoint
├── src/
│   ├── components/
│   │   ├── CommandPalette.tsx
│   │   ├── Container.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Magnetic.tsx
│   │   ├── MobileScrollTop.tsx
│   │   ├── PageWrapper.tsx
│   │   ├── Projects.tsx
│   │   ├── Seo.tsx
│   │   ├── TechBadge.tsx
│   │   └── TiltCard.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   └── ProjectsPage.tsx
│   ├── content/projects/     # Markdown project files
│   ├── constants/
│   │   └── index.ts          # Content, skills, navigation
│   ├── utils/
│   │   └── sound.ts          # Web Audio sound effects
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── images/
│   │   ├── tech-stack/       # Tech icon images
│   │   ├── intelliml.png
│   │   └── violence detection.png
│   ├── sw.js                 # Service worker
│   ├── oneko.js              # Cat cursor follower
│   └── manifest.webmanifest
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
└── .env.example
```

## Getting Started

### Prerequisites
- Bun (recommended) or Node.js 18+

### Installation

```bash
bun install
cp .env.example .env
```

### Development

```bash
bun run dev          # Start dev server (http://localhost:5173)
bun run build        # Production build
bun run preview      # Preview build
bun run lint         # ESLint
bun run typecheck    # TypeScript check
```

### Adding Projects

**Interactive Generator (recommended):**
```bash
bun run new:project    # Prompts for title, description, tags, links
```

**Manual Method:**
Create a markdown file in `src/content/projects/` with frontmatter:

```markdown
---
id: 3
title: "Project Name"
description: "Brief description"
tags:
  - React
  - TypeScript
image: "/images/project.png"
demo: "https://demo-link.com"
github: "https://github.com/user/repo"
---

Detailed project README content in Markdown...
```

Project images go in `public/images/`. Tech icons auto-map from `public/images/tech-stack/`.

## Environment Variables

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

## Deployment

Configured for Vercel with automatic SPA routing and security headers. See `vercel.json`.

## Customization

**Personal Info:** Edit `src/constants/index.ts` for name, bio, social links, skills.

**Theme Colors:** Modify CSS variables in `src/index.css` (light/dark mode colors).

**Favicon:** Replace files in `public/` (favicon.ico, favicon.png, og-image.png).

## License

MIT License