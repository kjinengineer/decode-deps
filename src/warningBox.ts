fetch("http://localhost:5001/track")
  .then((response) => response.json())
  .then((data) => {
    if (data.warning.length > 0) {
      // showAlert(data.warning);
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// function showAlert(message) {
//   const warningBox = document.querySelector(".warningBox");
//   warningBox.innerText = message;
//   warningBox.style.fontSize = "12px";
//   warningBox.style.width = "200px";
// }
