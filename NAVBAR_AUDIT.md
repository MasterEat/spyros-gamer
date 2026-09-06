# Navbar and routing audit

## Scope and revert status

This document records a read-only audit of the header/navigation implementation. No
navbar markup, styling, routing, page content, or application logic is changed by
this audit.

The requested navbar revert is already present at the branch baseline. Commit
`94cabcb` reverts `4e188d1` (`Fix GitHub Pages hash navigation`), and the current
baseline merge commit, `013a20c`, incorporates that revert. Reverting either commit
again would reintroduce the broken change rather than restore an earlier state.

## Where the navbar is implemented

This is a static multi-page site, not a React application. There is no shared
navbar component or client-side router. Instead, equivalent header markup is
copied into each served HTML document:

- `index.html`
- `gaming/index.html` and the legacy alias `gamingzone.html`
- `roblox/index.html`
- `basketball/index.html` and the legacy alias `basketball.html`
- `fun-zone/index.html` and the legacy alias `funzone.html`
- `blog/index.html` and the legacy alias `blog.html`
- `about/index.html` and the legacy alias `about.html`

Shared presentation is in `assets/site.css`, while active-item state and the
mobile-menu interactions are in `assets/site.js`. Every page loads the shared
script and identifies itself with a `data-page` attribute on `<body>`.

## Current menu structure

Desktop and mobile navigation contain the same items, in the same order:

| Label | Literal `href` | Page identity |
| --- | --- | --- |
| HOME | `/` | `home` |
| GAMING | `/gaming` | `gaming` |
| ROBLOX | `/roblox` | `roblox` |
| BASKETBALL | `/basketball` | `basketball` |
| FUN ZONE | `/fun-zone` | `fun-zone` |
| BLOG | `/blog` | `blog` |
| ABOUT | `/about` | `about` |

These are ordinary root-relative anchor links. They are neither hash links nor
React Router routes. `assets/site.js` does not intercept navigation; it only uses
`data-page-link` and the current document's `body[data-page]` value to apply
`aria-current="page"`.

## Existing pages and route validity

The repository contains an `index.html` target for every clean path used by the
menu:

- `/` -> `index.html`
- `/gaming` -> `gaming/index.html`
- `/roblox` -> `roblox/index.html`
- `/basketball` -> `basketball/index.html`
- `/fun-zone` -> `fun-zone/index.html`
- `/blog` -> `blog/index.html`
- `/about` -> `about/index.html`

Therefore, **no individual navbar item points to a missing repository page** when
the site is hosted at the origin root by a server that resolves directory indexes.
The older top-level aliases also exist, but the navbar does not link to them:
`gamingzone.html`, `basketball.html`, `funzone.html`, `blog.html`, and `about.html`.

There is, however, a deployment-level issue: all menu links, the logo link, and
the shared asset URLs begin with `/`. On a project site hosted below a prefix
(for example, GitHub Pages at `/spyros-gamer/`), those URLs resolve against the
domain root rather than the repository prefix. In that environment all seven
navbar destinations can leave the project site or return 404, even though their
HTML targets exist in this repository. Which links fail depends on the deployment
base URL and what happens to exist at the domain root.

## Desktop and mobile behavior

- At widths above `900px`, `.desktop-nav` is a flex row and the menu button and
  `.mobile-nav` are hidden.
- At `900px` and below, CSS hides `.desktop-nav` and displays the menu button.
- Activating the button toggles `.mobile-nav.is-open`, synchronizes
  `aria-expanded`, and changes the Material Symbol text between `menu` and
  `close`.
- Selecting a mobile link closes the menu. Pressing Escape also closes it and
  moves focus back to the toggle.
- The active desktop and mobile entries are both marked from the page's
  `body[data-page]` value.

## Issues for a follow-up PR

1. Decide and document the actual deployment base (origin root versus a project
   subpath) before changing link format. Test the chosen solution in that exact
   hosting model.
2. Root-relative navigation and asset URLs are unsafe for subpath deployments;
   address them together so navigation and page styling/scripts use one coherent
   base-path strategy.
3. Header markup and both menu lists are duplicated across twelve HTML files.
   This makes link changes prone to drift. A later refactor could introduce a
   static-site include/build step or another single source of truth, but that is
   intentionally outside this revert-and-audit PR.
4. The clean routes depend on directory-index behavior. If the production host
   does not provide it, explicit `.html` URLs, redirects, or host rewrites will be
   required.
5. A follow-up accessibility pass should decide whether Escape should refocus the
   toggle only while the mobile menu is open; the current handler focuses it after
   every Escape press, including in desktop layout where the control is hidden.

No redesign or implementation fix is included here.
