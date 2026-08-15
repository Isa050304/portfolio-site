V12 adjustments

- Staff Portal screenshots now keep their own proportions but never exceed the available browser viewport width. A small side margin is preserved.
- Large Staff Portal screenshots were resized to a retina-friendly maximum width to reduce decode/render cost without changing the visible layout.
- Large full-page Numode and Transylvanian website captures were resized to a practical desktop width while preserving their full vertical content.
- Project slides after the first now use lazy loading and low fetch priority.
- Comparison images use native lazy loading.
- Work cards below the viewport use content-visibility to reduce initial rendering work.
- Trackpad navigation can move between portal slides when the current screenshot has no remaining horizontal pan space.
