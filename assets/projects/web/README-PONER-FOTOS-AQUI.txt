PROJECT IMAGES — WHERE TO REPLACE THEM

All project images live in:
assets/projects/web/

IMPORTANT: COVER IMAGES ARE NOW SEPARATE FROM CASE-STUDY IMAGES.
That means you can make a dedicated mockup/cover for the Work page without changing the images inside the project.

COVERS / WORK PAGE
Replace these files with the cover or mockup you want to show on the Work page:
- football-cover.webp
- nexa-cover.webp
- movie-cover.webp
- numode-cover.webp
- transylvanian-cover.webp
- kokoro-cover.webp
- class-menu-cover.webp
- vase-rose-cover.webp
- chair-cover.webp
- neutrogena-cover.webp
- cinemax-cover.webp
- kronos-cover.webp
- willow-cover.webp

WEB DESIGN — NUMODE DELIVERY
- numode-old-site-01.webp       = BEFORE / old homepage
- numode-old-site-02.webp       = BEFORE / old responsive, contrast or consistency problems
- numode-new-site-01.webp       = AFTER / redesigned homepage
- numode-new-site-02.webp       = AFTER / another new-site or responsive view

WEB DESIGN — TRANSYLVANIAN TRADITIONS
- transylvanian-before.webp     = BEFORE / original site
- transylvanian-after.webp      = AFTER / redesigned site

MENU DESIGN — KOKORO MAZESOBA
- kokoro-old-menu.webp          = BEFORE / old menu
- kokoro-new-menu.webp          = AFTER / new menu
- kokoro-mockup.webp            = final menu mockup

MENU DESIGN — RESTAURANT MENU
- class-menu-layout.webp        = final menu layout
- class-menu-mockup-01.webp     = mockup 01
- class-menu-mockup-02.webp     = mockup 02

ILLUSTRATOR VECTORIZATION
- vase-rose-raster.webp         = raster reference
- vase-rose-vector.webp         = vector result
- chair-raster.webp             = raster reference
- chair-vector.webp             = vector result
- neutrogena-raster.webp        = raster reference
- neutrogena-vector.webp        = vector result

LOGO DESIGN — CINEMAX
- cinemax-logo-main.webp        = main logo
- cinemax-logo-elements-01.webp = elements + meaning
- cinemax-logo-elements-02.webp = colors / application

LOGO DESIGN — KRONOS
- kronos-logo-main.webp         = main logo
- kronos-logo-elements-01.webp  = elements + meaning
- kronos-logo-elements-02.webp  = colors / mockup

LOGO DESIGN — WILLOW BEAUTY
- willow-logo-main.webp         = main logo
- willow-logo-elements-01.webp  = comparison + elements
- willow-logo-elements-02.webp  = mockups + color direction

TRANSYLVANIAN PROJECT LINK
Open:
js/project-data.js
Search for:
transylvanian-traditions
Then replace the temporary GitHub URL inside the links array.

TRANSYLVANIAN HTML / CSS PREVIEW
Open:
js/project-data.js
Search for:
codeSamples
Replace the HTML and CSS strings with your real project code.

PLACEHOLDER BADGES
Any image that still shows "PONER FOTO AQUI" is still marked as a placeholder in js/project-data.js.
Once the real image is in place, change that image object's:
placeholder: true
into:
placeholder: false

For a Work-page cover, change:
coverPlaceholder: true
into:
coverPlaceholder: false
