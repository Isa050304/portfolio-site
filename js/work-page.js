document.addEventListener("DOMContentLoaded", () => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const filterRoot = document.querySelector("#project-filters");
  const listRoot = document.querySelector("#project-list");
  if (!filterRoot || !listRoot) return;

  const root = document.body.dataset.root || "";
  const asset = (path) => `${root}${path}`;
  const projectHref = (id) => `/work/${encodeURIComponent(id)}`;

  const categories = [
    { key: "all", label: "All work" },
    ...Array.from(new Map(projects.map((project) => [project.categoryKey, project.category])).entries())
      .map(([key, label]) => ({ key, label }))
  ];

  filterRoot.innerHTML = categories.map((category, index) => `
    <button class="filter-button" type="button" data-filter="${category.key}" aria-pressed="${index === 0 ? "true" : "false"}">
      ${category.label}
    </button>
  `).join("");

  listRoot.innerHTML = projects.map((project) => {
    const cover = asset(project.cover);
    return `
      <article class="work-card reveal" data-category="${project.categoryKey}">
        <a class="work-card-media" href="${projectHref(project.id)}" aria-label="View ${project.title}" style="--cover-image: url('${cover}')">
          <img src="${cover}" alt="${project.title}" loading="lazy" decoding="async">
          <span class="media-number" aria-hidden="true">${project.number}</span>
        </a>
        <div class="work-card-copy">
          <span class="project-counter">Thread ${project.number}</span>
          <h2>${project.title}</h2>
          <ul class="project-tags" aria-label="Project tags">
            ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
          </ul>
          <p>${project.summary}</p>
          <a class="project-link" href="${projectHref(project.id)}">
            View project <span class="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    `;
  }).join("");

  const buttons = filterRoot.querySelectorAll("[data-filter]");
  const cards = listRoot.querySelectorAll("[data-category]");

  const applyFilter = (selected) => {
    const valid = categories.some((category) => category.key === selected) ? selected : "all";
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.filter === valid)));
    cards.forEach((card) => {
      card.hidden = !(valid === "all" || card.dataset.category === valid);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });

  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  if (requestedCategory) applyFilter(requestedCategory);
});
