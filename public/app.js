const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();

  formStatus.textContent = `Thanks, ${name}. This sample form is ready to connect to a backend.`;
  contactForm.reset();
});
