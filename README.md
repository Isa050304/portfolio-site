# Isabel Contreras Portfolio

A lightweight static portfolio built with HTML, CSS and vanilla JavaScript. No build step or framework is required.

## Local preview

Open this folder in VS Code and use **Live Server**, or run any simple local web server from the project root.

## Structure

- `index.html` — expanded intro home page with the red-thread concept and a short three-step process section; projects remain off the home page.
- `work/index.html` — filterable project index.
- `work/project/index.html?id=PROJECT_ID` — reusable project case-study page.
- `js/project-data.js` — the single place to add/edit portfolio projects.
- `assets/projects/web/` — web-optimized project images used by the site.
- `assets/projects/` — original large project files kept untouched.

## Add a new project

1. Add a web-sized image to `assets/projects/web/`.
2. Open `js/project-data.js`.
3. Copy one project object and change its `id`, title, category, tags, copy, image paths and process steps.
4. Save. The Work page automatically creates the card and category filter, and the project automatically works with the shared case-study page.

Example project URL:

`work/project/index.html?id=football-connects`

## Replace placeholder process images

Each current project has two slides. The second slide is a crop/detail created from the same artwork as a temporary placeholder. Replace the `slides` image paths in `js/project-data.js` when you have real sketches, process photos, spreads or mockups.

## Resume + portrait

The original ZIP referenced files that were not included:

- `assets/artwork/about-portrait.jpg`
- `assets/resume/isabel-contreras-resume.pdf`

The About page currently uses `identity-artwork.png` instead of a broken portrait image and does not expose a broken PDF button. Add the real files later and update `about/index.html` when ready.

## Motion system

Motion is intentionally restrained: a continuous red thread draws with scroll, project cards reveal into view, and internal navigation uses one short thread transition. The yarn loader appears only on the first Home visit in a browser session, so internal navigation never stacks two loading animations. `prefers-reduced-motion` is respected.

## GitHub Pages

All links remain relative, so the project works when deployed inside a GitHub Pages project subfolder.

## August 2026 layout pass

This version reduces oversized vertical spacing across Work, project case studies, About and Contact. It also adds layered blush/pink backgrounds, bordered content panels and stronger visual section changes so pages do not read as one long white canvas. Project titles and gallery heights are smaller, and artwork appears earlier in the first viewport.


## August 2026 V3 composition pass

- Portrait artwork no longer floats inside large empty horizontal boxes. Work cards and case-study slides use the artwork as a soft full-bleed backdrop while preserving the complete poster/booklet in the foreground.
- The case-study gallery is narrower and more compact, with less unused space around vertical pieces.
- Home now includes the red-thread rationale and a short Pull / Knot / Resolve process introduction without showing project thumbnails.
- Internal project navigation resets to the top instead of preserving a previous case-study scroll position.
- Only one page-change transition is shown during internal navigation.

## August 2026 V4 structural fix

- Removed the oversized in-flow SVG that was accidentally creating a huge blank scroll area before Work and project content.
- Work now uses a responsive 3/2/1-column card grid with portrait-first project artwork.
- Case-study slides use a portrait-first 4:5 frame instead of forcing vertical posters into a 16:9 presentation.
- Home is expanded into five responsive content sections while keeping projects exclusively on Work.
- Process and discipline cards use consistent heights and responsive grid rules.
- Home now includes the same site footer pattern used by Work, Project, About and Contact.
- Page navigation uses one simple wipe transition; the moving yarn-ball transition was removed and the transition state is cleared on browser history restores to avoid visual glitches.

## V5 notes

- The page transition uses one rolling yarn ball and one continuous pink sweep.
- Every main page has a visible Back to top button once the visitor scrolls down.
- Public placeholder/developer notes were removed and project rationale/process copy is now written in first person.
- To activate the resume button, place your PDF at `assets/resume/isabel-contreras-resume.pdf`. There is also an HTML comment beside the button in `about/index.html`.

## Latest polish

- Project numbering is hidden from the Work grid and project galleries.
- Placeholder reminders such as `PONER FOTO AQUI` are code comments only and are not shown on the live site.
- Logo case studies separate comparison/rebrand, logo elements, colour palette and mockups.
- Willow Beauty compares the previous Nail Salon Willowbrook Mall identity with the Willow Beauty rebrand and includes Problems / Solutions.
- Cinemax compares against Cineplex and includes Problems / Solutions.
- Process-card headlines are aligned consistently across rows, including Home.
- The About illustration now uses `assets/illustrations/yarn-butterfly.svg`.
- Numode Delivery includes a live-site button pointing to `https://numode.ca`.
