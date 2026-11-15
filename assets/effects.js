(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const viewport = document.querySelector(".gallery-viewport");
  const track = document.querySelector(".photo-gallery");
  const slider = document.querySelector(".gallery-slider");
  const group = document.createElement("div");
  group.className = "gallery-group";
  group.append(...track.children);
  track.append(group);

  // Identical groups on both sides keep the loop seamless in either direction.
  for (const side of ["before", "after"]) {
    const copy = group.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.inert = true;
    if (side === "before") track.prepend(copy);
    else track.append(copy);
  }

  let cycleWidth = 0;
  let position = 0;
  let lastWrittenPosition = 0;
  let pendingShift = 0;
  let lastTime = null;
  let paused = reducedMotion.matches;
  let interacting = false;

  function measure() {
    const previousWidth = cycleWidth;
    cycleWidth = group.getBoundingClientRect().width + 24;
    if (cycleWidth > 0) {
      const offset = previousWidth ? viewport.scrollLeft % previousWidth : 0;
      position = cycleWidth + offset;
      viewport.scrollLeft = position;
      lastWrittenPosition = viewport.scrollLeft;
    }
  }

  function move(direction) {
    const step = group.firstElementChild.getBoundingClientRect().width + 24;
    pendingShift += direction * step;
  }

  slider.querySelector('[data-slide="previous"]').addEventListener("click", () => move(-1));
  slider.querySelector('[data-slide="next"]').addEventListener("click", () => move(1));

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });

  viewport.addEventListener("pointerdown", () => { interacting = true; });
  window.addEventListener("pointerup", () => { interacting = false; });
  window.addEventListener("pointercancel", () => { interacting = false; });

  function animate(time) {
    const elapsed = lastTime === null ? 0 : Math.min(time - lastTime, 50);
    lastTime = time;
    if (cycleWidth > 0 && !document.hidden && !interacting) {
      if (Math.abs(viewport.scrollLeft - lastWrittenPosition) > 1) {
        position = viewport.scrollLeft;
      }
      const focused = viewport.contains(document.activeElement);
      const automatic = !paused && !focused ? elapsed * 0.022 : 0;
      const manual = reducedMotion.matches
        ? pendingShift
        : pendingShift * (1 - Math.exp(-elapsed / 140));
      pendingShift -= manual;
      if (Math.abs(pendingShift) < 0.1) pendingShift = 0;
      if (automatic || manual) {
        const offset = position + automatic + manual;
        position = cycleWidth + ((offset % cycleWidth) + cycleWidth) % cycleWidth;
        viewport.scrollLeft = position;
        lastWrittenPosition = viewport.scrollLeft;
      }
    }
    window.requestAnimationFrame(animate);
  }

  new ResizeObserver(measure).observe(group);
  reducedMotion.addEventListener("change", () => {
    paused = reducedMotion.matches;
  });
  measure();
  window.requestAnimationFrame(animate);

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const targets = document.querySelectorAll(
      ".page-section > .intro, .page-section > .eyebrow, .page-section > .section-title, .gallery-slider, .contact-layout > *, .page-section > .content, .prices-layout > *",
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.05 });

    targets.forEach((target) => {
      target.classList.add("reveal-pending");
      observer.observe(target);
    });
  }
})();
