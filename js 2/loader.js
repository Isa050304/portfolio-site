document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".site-loader");
  const isFirstLoad = document.documentElement.classList.contains("first-load");

  if (!loader || !isFirstLoad) {
    document.body.classList.remove("is-loading");
    return;
  }

  document.body.classList.add("is-loading");

  const hideLoader = () => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    document.documentElement.classList.remove("first-load");
    try { sessionStorage.setItem("portfolioLoaderSeen", "true"); } catch (_) {}
    window.setTimeout(() => loader.remove(), 450);
  };

  window.setTimeout(hideLoader, 820);
});
