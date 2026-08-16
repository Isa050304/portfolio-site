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

  if (!slides.length) {
    gallerySection?.setAttribute("hidden", "");
  }

  if (track && dots && slides.length) {
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
  const comparisonPageShell = comparisonSection?.querySelector(".page-shell");
  const comparisons = Array.isArray(project.comparisons) && project.comparisons.length
    ? project.comparisons
    : (project.comparison?.before && project.comparison?.after ? [project.comparison] : []);

  const setUpComparison = (comparisonRoot, comparisonRange) => {
    if (!comparisonRoot) return;

    const divider = comparisonRoot.querySelector(".comparison-divider");
    const isPhoneLayout = () => window.matchMedia("(max-width: 620px)").matches;

    const applySplit = (value) => {
      const numericValue = Number(value);
      const split = Math.max(0, Math.min(100, Number.isFinite(numericValue) ? numericValue : 50));
      comparisonRoot.style.setProperty("--compare-split", `${split}%`);
      if (comparisonRange && String(comparisonRange.value) !== String(split)) {
        comparisonRange.value = String(split);
      }
    };

    const splitFromX = (clientX) => {
      const rect = comparisonRoot.getBoundingClientRect();
      if (!rect.width) return;
      applySplit(((clientX - rect.left) / rect.width) * 100);
    };

    // The native range is intentionally kept as a mobile-safe control. Safari
    // reliably sends input events from a range even when custom touch dragging
    // is interrupted by page scrolling. The range is transparent and sits only
    // across the centre handle area, so the rest of the comparison still allows
    // normal vertical page scrolling.
    if (comparisonRange) {
      const syncFromRange = () => applySplit(comparisonRange.value);
      comparisonRange.addEventListener("input", syncFromRange);
      comparisonRange.addEventListener("change", syncFromRange);
    }

    let activePointerId = null;
    let pointerSurface = null;

    const beginPointerDrag = (event, surface) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      activePointerId = event.pointerId;
      pointerSurface = surface;
      surface.classList.add("is-dragging");
      try { surface.setPointerCapture?.(event.pointerId); } catch (_) {}
      event.preventDefault();
      splitFromX(event.clientX);
    };

    const movePointerDrag = (event) => {
      if (activePointerId === null || event.pointerId !== activePointerId) return;
      event.preventDefault();
      splitFromX(event.clientX);
    };

    const endPointerDrag = (event) => {
      if (activePointerId === null) return;
      if (event?.pointerId != null && event.pointerId !== activePointerId) return;
      try { pointerSurface?.releasePointerCapture?.(activePointerId); } catch (_) {}
      pointerSurface?.classList.remove("is-dragging");
      activePointerId = null;
      pointerSurface = null;
    };

    // Pointer Events work on current iOS Safari, Android, pen and desktop.
    // Unlike the previous implementation, touch pointers are NOT ignored.
    if (divider && window.PointerEvent) {
      divider.addEventListener("pointerdown", (event) => beginPointerDrag(event, divider), { passive: false });
      divider.addEventListener("pointermove", movePointerDrag, { passive: false });
      divider.addEventListener("pointerup", endPointerDrag);
      divider.addEventListener("pointercancel", endPointerDrag);
      divider.addEventListener("lostpointercapture", endPointerDrag);
    }

    // Older touch engines get a small fallback. Indexed TouchList access avoids
    // Safari versions where TouchList is not iterable with for...of.
    if (divider && !window.PointerEvent) {
      let touchIdentifier = null;

      const findTouch = (list) => {
        if (!list || !list.length) return null;
        if (touchIdentifier === null) return list[0];
        for (let index = 0; index < list.length; index += 1) {
          if (list[index].identifier === touchIdentifier) return list[index];
        }
        return null;
      };

      divider.addEventListener("touchstart", (event) => {
        if (!event.changedTouches.length) return;
        const touch = event.changedTouches[0];
        touchIdentifier = touch.identifier;
        divider.classList.add("is-dragging");
        event.preventDefault();
        splitFromX(touch.clientX);
      }, { passive: false });

      divider.addEventListener("touchmove", (event) => {
        if (touchIdentifier === null) return;
        const touch = findTouch(event.touches) || findTouch(event.changedTouches);
        if (!touch) return;
        event.preventDefault();
        splitFromX(touch.clientX);
      }, { passive: false });

      const finishTouch = () => {
        divider.classList.remove("is-dragging");
        touchIdentifier = null;
      };
      divider.addEventListener("touchend", finishTouch, { passive: true });
      divider.addEventListener("touchcancel", finishTouch, { passive: true });
    }

    // Desktop keeps the convenient ability to click/drag anywhere on the image.
    // On phones only the visible thread/handle (plus its native range hit area)
    // is interactive, leaving the rest of the image free for vertical scrolling.
    comparisonRoot.addEventListener("pointerdown", (event) => {
      if (isPhoneLayout()) return;
      if (event.target.closest(".comparison-label, .comparison-divider, .comparison-range")) return;
      beginPointerDrag(event, comparisonRoot);
    }, { passive: false });
    comparisonRoot.addEventListener("pointermove", movePointerDrag, { passive: false });
    comparisonRoot.addEventListener("pointerup", endPointerDrag);
    comparisonRoot.addEventListener("pointercancel", endPointerDrag);
    comparisonRoot.addEventListener("lostpointercapture", endPointerDrag);

    applySplit(comparisonRange?.value || 50);
  };

  if (comparisonSection && comparisonPageShell && comparisons.length) {
    const comparisonHeading = comparisons.length > 1
      ? `<div class="project-comparison-heading"><div><p class="section-label">Before / After</p><h2 class="section-title">Pull the thread through each correction.</h2></div></div>`
      : `<div class="project-comparison-heading"><div><p class="section-label">Before / After</p><h2 class="section-title">Pull the thread to reveal the change.</h2></div>${comparisons[0].note ? `<p class="body-large">${esc(comparisons[0].note)}</p>` : ""}</div>`;

    const comparisonMarkup = comparisons.map((item, index) => {
      const before = item.before || {};
      const after = item.after || {};
      const websiteClass = project.galleryMode === "website" ? " before-after-comparison--website" : "";
      const compactClass = project.compactWebsite ? " before-after-comparison--compact" : "";
      const showStudyNote = comparisons.length > 1 && item.note;
      return `
        <article class="comparison-study reveal" data-delay="${Math.min(index, 3)}">
          ${item.title ? `<h3 class="comparison-study-title">${esc(item.title)}</h3>` : ""}
          ${showStudyNote ? `<p class="comparison-study-note">${esc(item.note)}</p>` : ""}
          <div class="before-after-comparison${websiteClass}${compactClass}" style="--compare-split: 50%;">
            <div class="comparison-panel comparison-panel--before">
              <span class="comparison-label">${esc(before.label || "Before")}</span>
              <img src="${asset(before.src || "")}" alt="${esc(before.alt || "Before")}" loading="lazy" decoding="async">
            </div>
            <div class="comparison-panel comparison-panel--after">
              <span class="comparison-label">${esc(after.label || "After")}</span>
              <img src="${asset(after.src || "")}" alt="${esc(after.alt || "After")}" loading="lazy" decoding="async">
            </div>
            <div class="comparison-divider" aria-hidden="true"><span class="comparison-grip"></span></div>
            <input class="comparison-range" type="range" min="0" max="100" value="50" aria-label="Adjust before and after comparison">
          </div>
        </article>`;
    }).join("");

    comparisonPageShell.innerHTML = `${comparisonHeading}<div class="comparison-stack">${comparisonMarkup}</div>`;
    comparisonPageShell.querySelectorAll(".before-after-comparison").forEach((root) => {
      setUpComparison(root, root.querySelector(".comparison-range"));
    });
    comparisonSection.hidden = false;
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
        ${esc(link.label)} <span class="css-arrow css-arrow--right" aria-hidden="true"></span>
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
    if (!nextLink.querySelector(".next-project-arrow")) {
      nextLink.insertAdjacentHTML("beforeend", '<span class="next-project-arrow" aria-hidden="true"><span class="css-arrow css-arrow--right"></span></span>');
    }
  }
});
