document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.querySelector(".back-to-top");

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 700);
  };

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
