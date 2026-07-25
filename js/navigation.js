document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".main-navigation");
  const links = document.querySelectorAll(".nav-links a");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!toggle || !navigation) return;

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
    if (navigation.classList.contains("is-open") && !header.contains(event.target)) {
      closeNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeNavigation();
  });
});
