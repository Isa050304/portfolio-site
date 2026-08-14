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
