document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.querySelector(".back-to-top");
  const threadPaths = document.querySelectorAll(".scroll-thread path");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  threadPaths.forEach((path) => {
    path.style.strokeDasharray = "100";
    path.style.strokeDashoffset = reducedMotion ? "0" : "100";
  });

  let ticking = false;
  const update = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    if (!reducedMotion) {
      threadPaths.forEach((path) => {
        path.style.strokeDashoffset = String(100 - progress * 100);
      });
    }

    if (backToTop) {
      backToTop.classList.toggle("is-visible", window.scrollY > 420);
    }
    ticking = false;
  };

  update();
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
});
