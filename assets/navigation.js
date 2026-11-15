const header = document.querySelector("header");
const navigationLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const navigationSections = navigationLinks.map((link) => ({
  link,
  section: document.getElementById(link.hash.slice(1)),
})).filter(({ section }) => section);

let updatePending = false;

function updateActiveSection() {
  const activationLine = header.getBoundingClientRect().bottom + 40;
  let activeLink = null;

  for (const { link, section } of navigationSections) {
    if (section.getBoundingClientRect().top <= activationLine) {
      activeLink = link;
    }
  }

  // The last section may be too short to reach the activation line.
  const atPageBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2;

  if (atPageBottom && activeLink) {
    activeLink = navigationSections.at(-1).link;
  }

  for (const link of navigationLinks) {
    if (link === activeLink) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  updatePending = false;
}

function scheduleUpdate() {
  if (!updatePending) {
    updatePending = true;
    window.requestAnimationFrame(updateActiveSection);
  }
}

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
window.addEventListener("load", scheduleUpdate);
window.addEventListener("hashchange", scheduleUpdate);

// Recalculate after gallery images load and shift the sections below them.
const layoutObserver = new ResizeObserver(scheduleUpdate);
layoutObserver.observe(document.body);
layoutObserver.observe(header);

updateActiveSection();
