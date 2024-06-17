<div align="center">
  <br />
  <!-- TODO: change -->
    <a href="https://youtu.be/PuOVqP_cjkE?feature=shared" target="_blank">
      <img src="https://github.com/BensonRaro/Nextjs_SpotifyClone/blob/main/public/SpotifyClonebanner.jpg?raw=true" alt="Project Banner">
    </a>
  <br />
  
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    
  </div>

  <h3 align="center">Full Stack Spotify Clone</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.youtube.com/@BensonRaro/videos" target="_blank"><b>Benson Raro</b></a> YouTube.
    </div>
</div>

## 🚨 Tutorial

## Watch: <a href="https://youtu.be/PuOVqP_cjkE?feature=shared" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/1736fca5-a031-4854-8c09-bc110e3bc16d" /></a>

This repository contains the code corresponding to an in-depth tutorial available on our YouTube channel, <a href="https://www.youtube.com/@BensonRaro/videos" target="_blank"><b>Benson Raro</b></a>.

If you prefer visual learning, this is the perfect resource for you. Follow our tutorial to learn how to build projects like these step-by-step in a beginner-friendly manner!

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- Neon
- Prisma ORM
- Clerk Auth
- Edgestore
- Zustand
- Zod
- TailwindCSS
- Framer Motion
- ShadCN
- Genius API

## <a name="features">🔋 Features</a>

- 🔍🏠Spotify Home and Search Page.
- 🙍‍♂️ Manage user using clerk auth
- 🎶➕🔄Create and update Playlist.
- 🎶+ Add Audio to Playlist
- 🎶🎥 Create Liked Playlist.
- 📄🙍‍♂️🚩 User Page with Banner.
- 🌈 Detect image color.
- 🔊➕🔄🗑️ Create, Update and Delete Audio.
- 🔀 Manage Play Queue (Reorder using Framer Motion)
- ﮩ٨ـﮩﮩ٨ـ♡ﮩ٨ـﮩﮩ٨ـ Fetch Lyrics using Genius API.
- ⏯️ Play Audio using custom Audio Player.
- Beautiful upload progress bar.
- 🔮 Web theme using Next-themes
- 🎨 Beautiful design.
- ⚡ Blazing fast application.
- 📄 SSR (Server-Side Rendering).
- 🗺️ Grouped routes & layouts.
- 🚀 Deployment.

### Prerequisites

**Node version 18.17 or later**

## <a name="quick-start">🤸 Quick Start</a>

### Cloning the repository

```shell
git clone https://github.com/BensonRaro/Nextjs_SpotifyClone
```

### Fill in API keys

### Install packages

```shell
npm i
```

### Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

DATABASE_URL=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

NEXT_PUBLIC_GENIUS_ACCESS_TOKEN=
```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command              | description                              |
| :------------------- | :--------------------------------------- |
| `dev`                | Starts a development instance of the app |
| `npx prisma db push` | Push schema to DB                        |
| `npx prisma studio`  | Opens localhost:5555 prisma studio       |
