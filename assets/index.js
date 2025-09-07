import { getDomainsOfInterest } from "./utils.js";
import { BASE_URL, SECRET_KEY } from "./config.js";

const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const submitAnotherApplication = document.getElementById(
  "submitAnotherApplication"
);

document.forms.applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const originalButtonText = event.target.querySelector(
    'button[type="submit"]'
  ).textContent;

  event.target.querySelector('button[type="submit"]').textContent =
    "Submitting...";
  event.target.querySelector('button[type="submit"]').disabled = true;

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  data.domainsOfInterest = getDomainsOfInterest();
  data.secretKey = SECRET_KEY;

  await fetch(BASE_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // clear form
  event.target.reset();

  event.target.classList.add("hidden");
  successMessage.classList.remove("hidden");

  event.target.querySelector('button[type="submit"]').textContent =
    originalButtonText;
  event.target.querySelector('button[type="submit"]').disabled = false;

  console.log("Form data:", data);
});

submitAnotherApplication.addEventListener("click", (event) => {
  successMessage.classList.add("hidden");
  document.forms.applicationForm.classList.remove("hidden");
});
