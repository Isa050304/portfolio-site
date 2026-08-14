document.addEventListener("DOMContentLoaded", () => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const params = new URLSearchParams(window.location.search);
  const requestedId = document.body.dataset.projectId || params.get("id");
  const project = projects.find((item) => item.id === requestedId) || projects[0];
  if (!project) return;

  const root = document.body.dataset.root || "";
  const asset = (path) => `${root}${path}`;
  const projectHref = (id) => `/work/${encodeURIComponent(id)}`;

  document.title = `${project.title} | Isabel Contreras`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", project.summary);

  const category = document.querySelector("#project-category");
  const title = document.querySelector("#project-title");
  const summary = document.querySelector("#project-summary");
  const meta = document.querySelector("#project-meta");
  const rationale = document.querySelector("#project-rationale");
  const processList = document.querySelector("#process-list");
  const track = document.querySelector("#slider-track");
  const dots = document.querySelector("#slider-dots");
  const caption = document.querySelector("#slider-caption");

  if (category) category.textContent = project.category;
  if (title) title.textContent = project.title;
  if (summary) summary.textContent = project.summary;
  if (rationale) rationale.textContent = project.rationale;

  if (meta) {
    const metaItems = [
      `<li><strong>Year</strong><span>${project.year}</span></li>`,
      `<li><strong>Role</strong><span>${project.role}</span></li>`,
      `<li><strong>Format</strong><span>${project.format}</span></li>`
    ];

    if (project.note) {
      metaItems.push(`<li><strong>Note</strong><span>${project.note}</span></li>`);
    }

    meta.innerHTML = metaItems.join("");
  }

  if (processList) {
    processList.innerHTML = project.process.map((step, index) => `
      <article class="process-step reveal" data-step="0${index + 1}" data-delay="${Math.min(index + 1, 3)}">
        <h2>${step.title}</h2>
        <p>${step.body}</p>
      </article>
    `).join("");
  }

  let activeIndex = 0;
  if (track && dots) {
    track.innerHTML = project.slides.map((slide, index) => {
      const src = asset(slide.src);
      return `
        <figure class="project-slide" data-fit="${slide.fit || "contain"}" style="--slide-image: url('${src}')">
          <div class="slide-stage">
            <img src="${src}" alt="${slide.alt}" loading="eager" decoding="async">
          </div>
          ${slide.placeholder ? '<span class="photo-placeholder-note photo-placeholder-note--slide">PONER FOTO AQUI</span>' : ''}
          <span class="slide-label" aria-hidden="true">Frame 0${index + 1}</span>
        </figure>
      `;
    }).join("");

    dots.innerHTML = project.slides.map((slide, index) => `
      <button class="slider-dot" type="button" data-slide="${index}" aria-label="Show slide ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>
    `).join("");
  }

  const updateSlider = (nextIndex) => {
    const count = project.slides.length;
    activeIndex = (nextIndex + count) % count;
    if (track) track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots?.querySelectorAll("[data-slide]").forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === activeIndex));
    });
    if (caption) caption.textContent = `${activeIndex + 1} / ${count} · ${project.slides[activeIndex].caption}`;
  };

  document.querySelector("[data-prev]")?.addEventListener("click", () => updateSlider(activeIndex - 1));
  document.querySelector("[data-next]")?.addEventListener("click", () => updateSlider(activeIndex + 1));
  dots?.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-slide]");
    if (!dot) return;
    updateSlider(Number(dot.dataset.slide));
  });

  document.querySelector("[data-slider]")?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") updateSlider(activeIndex - 1);
    if (event.key === "ArrowRight") updateSlider(activeIndex + 1);
  });

  updateSlider(0);

  const linksSection = document.querySelector("#project-links-section");
  const linksList = document.querySelector("#project-links-list");
  const linksNote = document.querySelector("#project-links-note");
  if (linksSection && linksList) {
    if (Array.isArray(project.links) && project.links.length) {
      linksList.innerHTML = project.links.map((link) => `
        <a class="project-resource-link ${link.style === "secondary" ? "project-resource-link--secondary" : ""}" href="${link.url}" target="_blank" rel="noopener">
          ${link.label}
        </a>
      `).join("");
      if (linksNote) linksNote.textContent = project.linksNote || "";
      linksSection.hidden = false;
    } else {
      linksSection.hidden = true;
    }
  }

  const codeSection = document.querySelector("#project-code-section");
  const codeTabs = document.querySelector("#project-code-tabs");
  const codeContent = document.querySelector("#project-code-content");
  const codeLabel = document.querySelector("#project-code-label");
  const codeNote = document.querySelector("#project-code-note");

  if (codeSection && codeTabs && codeContent && codeLabel) {
    const entries = project.codeSamples ? Object.entries(project.codeSamples) : [];
    if (entries.length) {
      codeSection.hidden = false;
      let activeCodeKey = entries[0][0];

      const renderCode = (key) => {
        const sample = project.codeSamples[key] || "";
        activeCodeKey = key;
        codeContent.textContent = sample;
        codeLabel.textContent = key.toUpperCase();
        codeTabs.querySelectorAll("[data-code-tab]").forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.codeTab === key));
        });
      };

      codeTabs.innerHTML = entries.map(([key], index) => `
        <button class="code-tab-button" type="button" data-code-tab="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
          ${key.toUpperCase()}
        </button>
      `).join("");

      codeTabs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-code-tab]");
        if (!button) return;
        renderCode(button.dataset.codeTab);
      });

      if (codeNote) codeNote.textContent = project.codeNote || "";
      renderCode(activeCodeKey);
    } else {
      codeSection.hidden = true;
    }
  }

  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const nextLink = document.querySelector("#next-project-link");
  const nextTitle = document.querySelector("#next-project-title");

  if (nextProject && nextLink && nextTitle) {
    nextLink.href = projectHref(nextProject.id);
    nextTitle.textContent = nextProject.title;
  }
});
