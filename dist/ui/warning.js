import { fetchData } from "../utils/dataFetcher.js";
fetchData()
  .then(function (data) {
    if (data.warning.length > 0) {
      showAlert(data.warning);
    } else {
      var warning = document.querySelector(".warning");
      warning.style.display = "none";
    }
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
  });
function showAlert(message) {
  var warning = document.querySelector(".warning");
  var warningTitle = document.querySelector(".warning-title");
  var warningBox = document.querySelector(".warningBox");
  warning.style.display = "inline-block";
  warningTitle.innerHTML = "Warning: Circular Deps";
  warningBox.innerHTML = message
    .map(function (pair) {
      var result = pair.circular;
      return '<div class="list">'.concat(result.join(" ⇄ "), "</span>");
    })
    .join("");
}
