fetch("http://localhost:5001/track")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
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
  const warningBox = document.querySelector(".warningBox");

  warning.style.display = "inline-block";
  warningBox.innerHTML = message.map((pair) => pair.join(" ⇄ ")).join("<br>");
}
