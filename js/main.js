document.documentElement.classList.add("js");

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-transitioning");
  if (!window.location.hash) window.scrollTo(0, 0);
});
