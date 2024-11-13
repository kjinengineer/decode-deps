import { fetchData } from "../utils/dataFetcher";

fetchData()
  .then((data) => {
    if (data.warning.length > 0) {
      showAlert(data.warning);
    } else {
      const warning = document.querySelector(".warning") as HTMLElement;
      warning.style.display = "none";
    }
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
  });
function showAlert(message) {
  const warning = document.querySelector(".warning") as HTMLElement;
  const warningTitle = document.querySelector(".warning-title") as HTMLElement;
  const warningBox = document.querySelector(".warningBox") as HTMLElement;

  warning.style.display = "inline-block";
  warningTitle.innerHTML = "Warning: Circular Deps";
  warningBox.innerHTML = message
    .map((pair) => {
      const result = pair.circular;
      return `<div class="list">${result.join(" ⇄ ")}</span>`;
    })
    .join("");
}
