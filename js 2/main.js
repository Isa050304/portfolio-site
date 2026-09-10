document.documentElement.classList.add("js");

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-transitioning");
  if (!window.location.hash) window.scrollTo(0, 0);
});


// Keep the skip link available for keyboard users without letting it appear during normal scrolling.
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") document.documentElement.classList.add("keyboard-navigation");
});

["pointerdown", "touchstart", "mousedown"].forEach((eventName) => {
  document.addEventListener(eventName, () => {
    document.documentElement.classList.remove("keyboard-navigation");
  }, { passive: true });
});


// v14: tint supported mobile browser chrome to match the footer while it is visible.
(() => {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const footer = document.querySelector('.site-footer');
  if (!themeMeta || !footer || !('IntersectionObserver' in window)) return;

  const pageColor = '#fffdfb';
  const footerColor = '#f1d2dd';
  const footerThemeObserver = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting);
    themeMeta.setAttribute('content', visible ? footerColor : pageColor);
  }, { threshold: 0.04 });

  footerThemeObserver.observe(footer);
})();
