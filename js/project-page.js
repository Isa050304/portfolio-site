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

  const splitRationale = (value = "") => {
    const explicit = String(value).split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    if (explicit.length > 1) return explicit;

    const sentences = String(value)
      .match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || [];

    if (sentences.length <= 2) return [String(value).trim()].filter(Boolean);

    const paragraphs = [];
    for (let index = 0; index < sentences.length; index += 2) {
      paragraphs.push(sentences.slice(index, index + 2).join(" "));
    }
    return paragraphs;
  };

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
  if (rationale) {
    rationale.innerHTML = splitRationale(project.rationale)
      .map((paragraph) => `<p>${esc(paragraph)}</p>`)
      .join("");
  }

  if (project.galleryMode === "website") {
    gallerySection?.classList.add("project-gallery-section--website");
  }
  if (project.galleryMode === "portal") {
    gallerySection?.classList.add("project-gallery-section--website", "project-gallery-section--portal");
  }
  if (project.compactWebsite) {
    gallerySection?.classList.add("project-gallery-section--numode");
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
    track.innerHTML = slides.map((slide, slideIndex) => {
      const src = asset(slide.src);
      if (slide.scrollable) {
        const scrollClass = slide.scrollBoth ? " website-screenshot-scroll--both" : "";
        const frameClass = project.galleryMode === "portal" ? " website-browser-frame--portal" : "";
        const browserLabel = slide.browserLabel || slide.caption || "Desktop website capture";
        return `
          <figure class="project-slide project-slide--website">
            <div class="website-browser-frame${frameClass}">
              <div class="website-browser-bar" aria-hidden="true">
                <span></span><span></span><span></span>
                <strong>${esc(browserLabel)}</strong>
              </div>
              <div class="website-screenshot-scroll${scrollClass}" tabindex="0" aria-label="Scrollable screen: ${esc(slide.caption)}">
                <img src="${src}" alt="${esc(slide.alt)}" loading="${slideIndex === 0 ? "eager" : "lazy"}" fetchpriority="${slideIndex === 0 ? "high" : "low"}" decoding="async" draggable="false">
              </div>
            </div>
          </figure>
        `;
      }

      return `
        <figure class="project-slide" data-fit="${slide.fit || "contain"}">
          <div class="slide-stage">
            <img src="${src}" alt="${esc(slide.alt)}" loading="${slideIndex === 0 ? "eager" : "lazy"}" fetchpriority="${slideIndex === 0 ? "high" : "low"}" decoding="async" draggable="false">
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
    if (event.target.closest(".website-screenshot-scroll")) return;
    if (event.key === "ArrowLeft") updateSlider(activeIndex - 1);
    if (event.key === "ArrowRight") updateSlider(activeIndex + 1);
  });

  // Swipe between slides on touch devices. Gestures that begin inside a scrollable
  // website/portal viewport are reserved for panning that viewport in both axes.
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStarted = false;
  slider?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    if (event.target.closest(".website-screenshot-scroll")) {
      touchStarted = false;
      return;
    }
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

  // Two-finger trackpad gestures must never fight with a scrollable website or
  // Staff Portal viewport. When the active slide contains a scrollable screen,
  // the browser owns both horizontal and vertical wheel movement completely.
  // Non-scrollable artwork can still use a deliberate horizontal trackpad swipe
  // to move between slides, with a high threshold to avoid accidental changes
  // while the visitor is scrolling the portfolio page diagonally.
  let wheelLocked = false;
  slider?.addEventListener("wheel", (event) => {
    if (event.target.closest(".website-screenshot-scroll")) return;
    if (slides[activeIndex]?.scrollable) return;
    if (event.ctrlKey || wheelLocked) return;

    const horizontal = Math.abs(event.deltaX);
    const vertical = Math.abs(event.deltaY);
    if (horizontal < 56 || horizontal <= vertical * 2.2) return;

    event.preventDefault();
    wheelLocked = true;
    updateSlider(activeIndex + (event.deltaX > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLocked = false; }, 460);
  }, { passive: false });

  // Staff portal screenshots are intentionally wider than their browser frame.
  // Start each one centred so the page does not look shifted to one side, while
  // keeping full two-axis scrolling with a trackpad, mouse wheel or touch.
  const centrePortalViewport = (scroller) => {
    if (!scroller) return;
    const centre = () => {
      scroller.scrollLeft = Math.max(0, (scroller.scrollWidth - scroller.clientWidth) / 2);
      scroller.scrollTop = 0;
    };
    const image = scroller.querySelector("img");
    if (image?.complete) centre();
    else image?.addEventListener("load", centre, { once: true });
  };
  track?.querySelectorAll(".website-screenshot-scroll--both").forEach(centrePortalViewport);

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
    comparisonRoot.classList.toggle("before-after-comparison--compact", Boolean(project.compactWebsite));
    comparisonSection.hidden = false;

    const applySplit = (value) => {
      const split = Math.max(0, Math.min(100, Number(value)));
      comparisonRoot.style.setProperty("--compare-split", `${split}%`);
      if (comparisonRange) comparisonRange.value = String(split);
    };

    comparisonRange?.addEventListener("input", () => applySplit(comparisonRange.value));

    let comparisonDragging = false;
    const updateFromPointer = (event) => {
      const rect = comparisonRoot.getBoundingClientRect();
      const isVertical = window.matchMedia("(max-width: 620px)").matches;
      const raw = isVertical
        ? ((event.clientY - rect.top) / rect.height) * 100
        : ((event.clientX - rect.left) / rect.width) * 100;
      applySplit(raw);
    };

    comparisonRoot.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".comparison-label")) return;
      comparisonDragging = true;
      comparisonRoot.setPointerCapture?.(event.pointerId);
      updateFromPointer(event);
    });
    comparisonRoot.addEventListener("pointermove", (event) => {
      if (!comparisonDragging) return;
      updateFromPointer(event);
    });
    const stopComparisonDrag = (event) => {
      comparisonDragging = false;
      if (comparisonRoot.hasPointerCapture?.(event.pointerId)) {
        comparisonRoot.releasePointerCapture(event.pointerId);
      }
    };
    comparisonRoot.addEventListener("pointerup", stopComparisonDrag);
    comparisonRoot.addEventListener("pointercancel", stopComparisonDrag);

    applySplit(comparisonRange?.value || 50);
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
        <button class="code-tab-button" type="button" data-code-tab="${esc(key)}" aria-pressed="${index === 0 ? "true" : "false"}">
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
