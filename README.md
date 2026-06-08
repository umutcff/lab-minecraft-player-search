# Lab: Minecraft Player Search

<img src="./public/main.png" width=500 />

## Introduction

This time you are not fixing someone else's mess. You are building something from
scratch. You will create a small **Minecraft player searcher**: type a username, hit
the public Minecraft API, and show that player's profile and skin.

The app is a Next.js (App Router) project. Only **one page exists right now**: the home
page that greets the user and offers a button to go searching. Everything else: the
navigation bar, the search page, and an about page is yours to build.

This lab is about a skill you will use constantly with Next.js: **navigation**. Moving
between pages, keeping a menu present on every screen, and, the part that really
matters, deciding _where_ your data fetching happens.

## The situation

Your product owner sketched the idea on a napkin:

> "Landing page is done. I want a top bar that's always there so people can jump
> between Home, Search, and About from anywhere. The Search page takes a Minecraft
> name and shows me who that is. Make it work. Oh, and decide for yourself whether the
> search runs on the server or in the browser. I want you to understand the difference,
> not just copy a snippet."

That last sentence is the heart of this lab.

## The API

You will use the free, no-key-required API at **https://mc-api.io**.

- **Profile by name:** `GET https://mc-api.io/profile/{name}/{edition}`
  where `{edition}` is `java` or `bedrock`.
  Example: `https://mc-api.io/profile/ByteException_/java`
  Returns JSON shaped like:

  ```json
  {
    "name": "ByteException_",
    "uuid": "bef1d0a8-e281-4f69-9200-64e07c235c96",
    "decodedTexture": {
      "textures": {
        "SKIN": { "url": "http://textures.minecraft.net/texture/b6ae..." },
        "CAPE": { "url": "http://textures.minecraft.net/texture/cd9d..." }
      }
    }
  }
  ```

  The `SKIN.url` is a real PNG you can drop straight into an `<img>`.

- **UUID only:** `GET https://mc-api.io/uuid/{name}/{edition}` → `{ "uuid": "..." }`

No API key. ~500 requests/day for free. **A player that doesn't exist returns a
non-200 response.** Your search needs to handle that gracefully.

Open one of those URLs in your browser before you write any code, so you know exactly
what shape of data you are dealing with.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. You should see the home page. Click the button. It goes
to `/search`, which **does not exist yet**. Building that page is your first real task.

## Your job

There are three pieces. Build them in this order.

### 1. An always-present app bar (navigation)

Create a `Navbar` component and render it so it appears on **every
page**. It needs links to:

- Home → `/`
- Search → `/search`
- About → `/about`

Find a way to add this links so it doesn't reload the page 🤨

### 2. The search page (`app/search`)

An input where the user types a Minecraft username, and a result area that shows the
matched player's **name, UUID, and skin image** (from `SKIN.url`). When the name
doesn't match a real player, show a friendly "not found" message instead of crashing.

**This is where you make the key decision.** You can build this page two ways:

- **As a Client Component** (`'use client'`, `useState`, and `fetch` triggered from an
  input/button). The page never reloads. Results appear and update live as the user
  interacts, and state stays in memory. This is the "instant, hot-reloading" feel.

- **As a Server Component** (an `async` page that reads `searchParams`, with a `<form>`
  that puts the query in the URL and navigates). Every search is a fresh server
  round-trip / navigation. There is no live updating as you type, but the result is
  rendered on the server and the URL is shareable (`/search?name=Notch`).

Neither is "wrong." Pick one on purpose. If you have time, try
the other approach too and compare.

> 💡 Think about it: a Client Component re-renders **in place** as state changes, so your
> results "hot reload" without leaving the page. A Server Component produces its result
> once, on the server, per request, so to get a new result you have to ask the server
> again (a navigation). That trade-off is the whole point of this lab.

### 3. The about page (`app/about/page.js`)

A simple static page. Explain what the app does and credit `mc-api.io`. This one can
absolutely be a plain Server Component, since it has no interactivity. Use it to confirm your
navbar really reaches every route.

## How to work through this

1. Read the lesson in the portal.
2. Open the API URL in your browser and study the JSON.
3. Build the navbar first and confirm it shows on the (currently 404) `/search` and
   `/about` routes as you create them.
4. Build the search page. Make the smallest thing that fetches and renders one player.
5. Handle the "player not found" case.
6. Build the about page.

## Styling

Use tailwind for styling. 

## Checklist before you call it done

- The navbar is visible on Home, Search, and About, and every link works.
- The home page button takes you to the search page.
- Searching a real username (try `Notch`, `chosenarchitect`, `jeb_`) shows their name,
  UUID, and skin image.
- A made-up username shows a friendly message, not a crash or a blank screen.
- The about page is reachable from the navbar.
- There are no errors in the browser console.

## If you finish early

- Add a loading state while the request is in flight.
- Let the user switch between `java` and `bedrock` editions.
- Remember recent searches.
- Highlight the active link in the navbar using `usePathname`.
- If you built it as a Client Component, build a Server Component version too (or vice
  versa).

## Key concepts to review

- `<Link>` and client-side transitions: why the layout survives navigation.
- Server Components vs Client Components: what each can and cannot do.
- Where data fetching happens, and what that means for the user experience.
- Reading a query from the URL (`searchParams`) versus holding it in `useState`.
