const contactForm = document.querySelector(".contact-form");
const contactChoices = contactForm.querySelectorAll('input[name="Kontaktweg"]');
const emailField = document.getElementById("email-field");
const phoneField = document.getElementById("phone-field");
const emailInput = document.getElementById("contact-email");
const phoneInput = document.getElementById("contact-phone");
const formStatus = contactForm.querySelector(".form-status");

function updateContactMethod() {
  const usePhone = contactForm.querySelector(
    'input[name="Kontaktweg"]:checked',
  ).value === "Telefon";

  emailField.hidden = usePhone;
  emailInput.disabled = usePhone;
  emailInput.required = !usePhone;

  phoneField.hidden = !usePhone;
  phoneInput.disabled = !usePhone;
  phoneInput.required = usePhone;
  formStatus.textContent = "";
}

contactChoices.forEach((choice) => {
  choice.addEventListener("change", updateContactMethod);
});

contactForm.addEventListener("reset", () => {
  window.requestAnimationFrame(updateContactMethod);
});

contactForm.addEventListener("submit", (event) => {
  if (window.location.protocol === "file:") {
    event.preventDefault();
    formStatus.textContent =
      "Zum Absenden öffne die Website bitte über einen Webserver oder ihre veröffentlichte Adresse.";
    return;
  }

  formStatus.textContent = "Du wirst zum Versanddienst weitergeleitet …";
});

updateContactMethod();
