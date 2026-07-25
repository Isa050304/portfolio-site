document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".site-loader");
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    window.setTimeout(() => loader.remove(), 550);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 700);
  } else {
    window.addEventListener("load", () => window.setTimeout(hideLoader, 700), { once: true });
  }
});
