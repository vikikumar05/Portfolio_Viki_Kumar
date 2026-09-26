# Viki Kumar - Portfolio (React + Vite / Node + Express / MongoDB)

## Run locally
Requires Node 18+ and MongoDB.

**Backend**
```
cd backend
npm install
cp .env.example .env    # Windows: copy .env.example .env
npm run dev
```
**Frontend** (second terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 (the Vite dev server proxies `/api` to port 5000).

## MongoDB setup
- Local: install MongoDB Community, start it, and keep `MONGO_URI=mongodb://127.0.0.1:27017/viki-portfolio`.
- Atlas: create a free cluster, add a database user, allow your IP, and paste the connection string into `MONGO_URI`.
Messages are stored in the `messages` collection (view with MongoDB Compass).

## Environment (`backend/.env`, template: `backend/.env.example`)
- `MONGO_URI` (required for the contact form), `PORT` (5000), `CLIENT_ORIGIN` (http://localhost:5173)
- `GITHUB_USERNAME` (vikikumar05), `GITHUB_TOKEN` (optional, raises rate limit; never commit it)

## Edit your content
`frontend/src/data/`: `profile.js` (bio, stats, skills, status), `projects.js`, `socials.js`.
Put your real resume at `frontend/public/resume.pdf`. None is included.

## API
`POST /api/contact`, `GET /api/github`, `GET /api/health`. Responses use `{success, message, data}`.

## Build
`cd frontend && npm run build`

## Profile photo
Your real photo is included at `frontend/public/images/profile.jpg`. Replace that file any time to update it; the hover effect (RGB split, scan line, tilt) and the fallback state (if the file is ever missing) both point at that same path.

## Touch/tablet water ripple
`frontend/src/components/TouchWaterEffect.jsx` distorts the *actual live page* on touch devices using `backdrop-filter: url(#svgFilter)` with an SVG `feTurbulence` + `feDisplacementMap` filter, instead of drawing any circles/rings. A soft radial CSS mask feathers each disturbance so only the underlying content bends - nothing is rendered as a shape.

- Feature-detected: only mounts if the device is touch-capable (`pointer: coarse` / `navigator.maxTouchPoints`) **and** the browser supports `backdrop-filter` + SVG filters (`CSS.supports` check) **and** `prefers-reduced-motion` is off. On desktop, or on a browser without that support, it renders nothing.
- Tap and drag each spawn a small pooled "blob" element (max 5 concurrent) positioned exactly at the touch point via `transform`, whose displacement amplitude ramps up fast and decays slowly (soft attack, eased release) - no permanent distortion.
- Scrolling drives a separate full-viewport ambient layer whose amplitude follows scroll velocity/direction and decays back to zero (capped low so text stays readable); it fully detaches (`backdrop-filter: none`) at rest so it costs nothing when idle.
- All animation runs via refs and direct DOM/attribute writes in a self-pausing `requestAnimationFrame` loop - no React state per frame, no `preventDefault()`, native scrolling is untouched.

This relies on `backdrop-filter` + SVG-filter browser support (solid in current Chrome/Edge/Firefox and Safari 16+); please test on your actual target phones/tablets, since that combination can't be verified without a real device.


## Mobile identity marquee fix
The "DEVELOPER / PROBLEM SOLVER / FULL STACK / AI EXPLORER" row used a desktop scroll-linked layout with `white-space: nowrap`, a large minimum clamp font-size, and no clipping container - on narrow screens its real width was far wider than the viewport (only "fixable" by zooming out). Mobile/tablet (<=1024px) now gets a separate, purpose-built element: a duplicated-track CSS marquee (`.words-mobile` / `.mtrack`) clipped with `overflow:hidden`, sized with viewport-safe `clamp()`, looping seamlessly via a `translateX(-50%)` keyframe (exact because spacing is baked into each item's own margin rather than a shared `gap`, so both halves of the duplicated track are pixel-identical). The original desktop element and its scroll-driven parallax are untouched and simply hidden at <=1024px via `display:none` in a new, additive media-query block; nothing above that block in the stylesheet was modified. `html,#root{overflow-x:hidden;max-width:100%}` was added as a safety net against any other stray horizontal overflow, and the same "large min-clamp on a fluid heading" pattern was tightened (mobile-only override, desktop clamp untouched) for the other big display headings that shared the same risk.

## Content migration from the old portfolio (portfolio-Vikikumar05)
- **Projects:** 6 projects found in the old static site, 0 duplicates with the 4 already in the new site (themes overlap in places - e.g. the old "Healthcare Website" vs the new "One-Health Hospital Management" - but they're different repos with different tech stacks, so both are kept as separate entries). Final count: **10 projects** (4 original + 6 migrated). All migrated projects use their real GitHub URLs from the old site; none had a live demo link, so no demo button renders for them (per the "no fake links" rule).
- **Resume:** the old site's `General CV.pdf` is now `frontend/public/resume.pdf` - the Resume button/link across the site is now functional with a real file.
- **Contact info:** added `frontend/src/data/contact.js` (phone, email, WhatsApp, GitHub, LinkedIn) migrated from the old site's Contact section, and wired into the Contact section as clickable `tel:` / `mailto:` / WhatsApp links, shown above the existing (unchanged) backend-connected contact form.
- **Images:** none of the old site's 6 project images were migrated. On inspection they're stock photography and generic stock illustrations, not real screenshots (one - `healthcare.jpg` - even carries a visible depositphotos.com watermark). Reusing them would misrepresent the projects and carries copyright risk, so the migrated projects instead use the existing numbered/gradient card design that the site already applies to its other projects - no image assets needed at all.
- **Profile photo:** left unchanged. The old site's `profile.png` (983x1222) is lower resolution than the real photo you already uploaded and approved for the new site, so it was not appropriate to replace it.
- Desktop layout, animations, cursor, background, and the mobile water/touch system were not touched by this migration.
