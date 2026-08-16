V25 MOBILE BEFORE/AFTER FIX

This version replaces the previous mobile-only comparison gesture implementation.

Mobile comparison now has two synchronized controls:
1. Pointer Events on the visible vertical comparison thread.
2. A transparent native input[type=range] across the centre handle area as an iOS Safari fallback.

The page keeps normal vertical scrolling above and below the handle band.
The comparison remains a left/right reveal on mobile and desktop.

CSS/JS cache version: v25.
