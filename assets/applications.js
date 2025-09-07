import { BASE_URL } from "./config.js";

async function fetchApplications() {
  const response = await fetch(BASE_URL);
  const data = await response.json();

  const table = document.getElementById("applicationsTable");

  data.data.map((application) => {
    const row = document.createElement("tr");

    const columns = [
      "First Name",
      "Last Name",
      "Email",
      "Age",
      "Education Level",
      "City",
      "Availability",
      "Domain of interest",
    ];

    columns.forEach((column) => {
      const cell = document.createElement("td");
      cell.classList.add("p-3", "border-r", "border-b", "border-gray-300");
      cell.textContent = application[column];
      row.appendChild(cell);
    });

    table.append(row);
  });
}

fetchApplications();

// Age
// Availability
// City
// Domain of interest
// Education Level
// Email
// First Name
// Last Name
// Timestamp
