document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".main-navigation");
  const links = document.querySelectorAll(".nav-links a");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clearTransition = () => document.body.classList.remove("is-transitioning");
  clearTransition();
  window.addEventListener("pageshow", clearTransition);

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (toggle && navigation) {
    const closeNavigation = () => {
      navigation.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };

    toggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    links.forEach((link) => link.addEventListener("click", closeNavigation));
    document.addEventListener("click", (event) => {
      if (navigation.classList.contains("is-open") && !header.contains(event.target)) closeNavigation();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNavigation();
    });
  }

  if (reducedMotion) return;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;

    event.preventDefault();
    document.body.classList.add("is-transitioning");
    window.setTimeout(() => window.location.assign(link.href), 720);
  });
});
