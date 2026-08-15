document.addEventListener("DOMContentLoaded", () => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const params = new URLSearchParams(window.location.search);
  const requestedId = document.body.dataset.projectId || params.get("id");
  const project = projects.find((item) => item.id === requestedId) || projects[0];
  if (!project) return;

  const root = document.body.dataset.root || "";
  const asset = (path) => `${root}${path}`;
  const projectHref = (id) => `/work/${encodeURIComponent(id)}`;
  const esc = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

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
  const gallerySection = document.querySelector(".project-gallery-section");
  const slider = document.querySelector("[data-slider]");

  if (category) category.textContent = project.category;
  if (title) title.textContent = project.title;
  if (summary) summary.textContent = project.summary;
  if (rationale) rationale.textContent = project.rationale;

  if (project.galleryMode === "website") {
    gallerySection?.classList.add("project-gallery-section--website");
  }

  if (meta) {
    const items = [
      `<li><strong>Year</strong><span>${esc(project.year)}</span></li>`,
      `<li><strong>Role</strong><span>${esc(project.role)}</span></li>`,
      `<li><strong>Format</strong><span>${esc(project.format)}</span></li>`
    ];
    if (project.note) items.push(`<li><strong>Note</strong><span>${esc(project.note)}</span></li>`);
    meta.innerHTML = items.join("");
  }

  if (processList) {
    processList.innerHTML = (project.process || []).map((step, index) => `
      <article class="process-step reveal" data-step="0${index + 1}" data-delay="${Math.min(index + 1, 3)}">
        <h2>${esc(step.title)}</h2>
        <p>${esc(step.body)}</p>
      </article>
    `).join("");
  }

  let activeIndex = 0;
  const slides = project.slides || [];

  if (track && dots) {
    track.innerHTML = slides.map((slide) => {
      const src = asset(slide.src);
      if (slide.scrollable) {
        return `
          <figure class="project-slide project-slide--website">
            <div class="website-browser-frame">
              <div class="website-browser-bar" aria-hidden="true">
                <span></span><span></span><span></span>
                <strong>Desktop website capture</strong>
              </div>
              <div class="website-screenshot-scroll" tabindex="0" aria-label="Scrollable desktop screenshot: ${esc(slide.caption)}">
                <img src="${src}" alt="${esc(slide.alt)}" loading="eager" decoding="async">
              </div>
            </div>
          </figure>
        `;
      }

      return `
        <figure class="project-slide" data-fit="${slide.fit || "contain"}">
          <div class="slide-stage">
            <img src="${src}" alt="${esc(slide.alt)}" loading="eager" decoding="async">
          </div>
        </figure>
      `;
    }).join("");

    dots.innerHTML = slides.map((slide, index) => `
      <button class="slider-dot" type="button" data-slide="${index}" aria-label="Show ${esc(slide.caption || `slide ${index + 1}`)}" aria-current="${index === 0 ? "true" : "false"}"></button>
    `).join("");
  }

  const updateSlider = (nextIndex) => {
    if (!slides.length) return;
    activeIndex = (nextIndex + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots?.querySelectorAll("[data-slide]").forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === activeIndex));
    });
    if (caption) caption.textContent = slides[activeIndex].caption || "";
  };

  document.querySelector("[data-prev]")?.addEventListener("click", () => updateSlider(activeIndex - 1));
  document.querySelector("[data-next]")?.addEventListener("click", () => updateSlider(activeIndex + 1));
  dots?.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-slide]");
    if (dot) updateSlider(Number(dot.dataset.slide));
  });

  slider?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") updateSlider(activeIndex - 1);
    if (event.key === "ArrowRight") updateSlider(activeIndex + 1);
  });

  // Touch swipe for phones and tablets. Vertical gestures keep normal page/screenshot scrolling.
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStarted = false;
  slider?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchStarted = true;
  }, { passive: true });

  slider?.addEventListener("touchend", (event) => {
    if (!touchStarted || !event.changedTouches.length) return;
    touchStarted = false;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
    updateSlider(activeIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  updateSlider(0);

  const comparisonSection = document.querySelector("#project-comparison-section");
  const comparisonRoot = document.querySelector("#before-after-comparison");
  const comparisonRange = document.querySelector("#comparison-range");
  const comparisonBeforeImage = document.querySelector("#comparison-before-image");
  const comparisonAfterImage = document.querySelector("#comparison-after-image");
  const comparisonBeforeLabel = document.querySelector("#comparison-before-label");
  const comparisonAfterLabel = document.querySelector("#comparison-after-label");
  const comparisonNote = document.querySelector("#comparison-note");

  if (comparisonSection && comparisonRoot && project.comparison?.before && project.comparison?.after) {
    const before = project.comparison.before;
    const after = project.comparison.after;
    comparisonBeforeImage.src = asset(before.src);
    comparisonBeforeImage.alt = before.alt || "Before";
    comparisonAfterImage.src = asset(after.src);
    comparisonAfterImage.alt = after.alt || "After";
    comparisonBeforeLabel.textContent = before.label || "Before";
    comparisonAfterLabel.textContent = after.label || "After";
    if (comparisonNote) comparisonNote.textContent = project.comparison.note || "";
    comparisonRoot.classList.toggle("before-after-comparison--website", project.galleryMode === "website");
    comparisonSection.hidden = false;

    const updateComparison = () => {
      comparisonRoot.style.setProperty("--compare-split", `${Number(comparisonRange?.value || 50)}%`);
    };
    comparisonRange?.addEventListener("input", updateComparison);
    updateComparison();
  } else if (comparisonSection) {
    comparisonSection.hidden = true;
  }

  const problemSolutionSection = document.querySelector("#problem-solution-section");
  const problemSolutionIntro = document.querySelector("#problem-solution-intro");
  const problemsList = document.querySelector("#problems-list");
  const solutionsList = document.querySelector("#solutions-list");

  if (problemSolutionSection && problemsList && solutionsList && project.problemSolution) {
    if (problemSolutionIntro) problemSolutionIntro.textContent = project.problemSolution.intro || "";
    problemsList.innerHTML = (project.problemSolution.problems || []).map((item) => `<li>${esc(item)}</li>`).join("");
    solutionsList.innerHTML = (project.problemSolution.solutions || []).map((item) => `<li>${esc(item)}</li>`).join("");
    problemSolutionSection.hidden = false;
  } else if (problemSolutionSection) {
    problemSolutionSection.hidden = true;
  }

  const linksSection = document.querySelector("#project-links-section");
  const linksList = document.querySelector("#project-links-list");
  const linksNote = document.querySelector("#project-links-note");
  if (linksSection && linksList && Array.isArray(project.links) && project.links.length) {
    linksList.innerHTML = project.links.map((link) => `
      <a class="project-resource-link ${link.style === "secondary" ? "project-resource-link--secondary" : ""}" href="${esc(link.url)}" target="_blank" rel="noopener">
        ${esc(link.label)} <span class="css-arrow css-arrow--up-right" aria-hidden="true"></span>
      </a>
    `).join("");
    if (linksNote) linksNote.textContent = project.linksNote || "";
    linksSection.hidden = false;
  } else if (linksSection) {
    linksSection.hidden = true;
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
      const renderCode = (key) => {
        codeContent.textContent = project.codeSamples[key] || "";
        codeLabel.textContent = project.codeSampleLabels?.[key] || key.toUpperCase();
        codeTabs.querySelectorAll("[data-code-tab]").forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.codeTab === key));
        });
      };
      codeTabs.innerHTML = entries.map(([key], index) => `
        <button class="code-tab-button" type="button" data-code-tab="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
          ${esc(project.codeSampleLabels?.[key] || key.toUpperCase())}
        </button>
      `).join("");
      codeTabs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-code-tab]");
        if (button) renderCode(button.dataset.codeTab);
      });
      if (codeNote) codeNote.textContent = project.codeNote || "";
      renderCode(entries[0][0]);
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
