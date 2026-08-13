# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm test           # Jest in watch mode
npm test -- --watchAll=false  # Run tests once (non-interactive)
npm run build      # Production build to build/
npm run deploy     # Build + publish to GitHub Pages (henrywasserman.github.io/katmai-bear-cams)
```

## Architecture

Single-component React app (`src/App.js`) — no routing, no state management library, no backend.

The `bearCams` array at the top of `App.js` is the sole data source: each entry holds a name and a YouTube embed URL with `autoplay=1&mute=1`. Adding or removing cameras means editing this array.

**Click-to-focus behavior:** clicking a card sets `focusedId` in state and triggers the browser Fullscreen API on the card element. The `.focused` CSS class uses `position: fixed; inset: 0` as a CSS-level fallback for when fullscreen is unavailable. Clicking the focused card again (or pressing Escape) clears focus and calls `document.exitFullscreen()`. When a cam is focused, its iframe `src` is updated to append `&vq=hd1080` for higher resolution.

Layout is a CSS grid (`3 columns × 2 rows`) defined entirely in `App.css`, sized to fill the viewport.

Deployment uses `gh-pages`; the `homepage` field in `package.json` controls the published URL.
