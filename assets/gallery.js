document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    document.querySelectorAll("[data-category]").forEach((item) => {
      item.hidden =
        button.dataset.filter !== "Alle Arbeiten" &&
        item.dataset.category !== button.dataset.filter;
    });
  });
});
