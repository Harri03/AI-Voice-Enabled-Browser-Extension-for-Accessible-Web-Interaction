const button = document.getElementById("toggleBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

chrome.storage.local.get("listening", (result) => {
  updateUI(result.listening);
});

button.addEventListener("click", async () => {

  chrome.storage.local.get("listening", async (result) => {

    const newState = !result.listening;

    if (newState) {
      await fetch("http://127.0.0.1:5000/start");
      chrome.storage.local.set({ listening: true });
    } else {
      await fetch("http://127.0.0.1:5000/stop");
      chrome.storage.local.set({ listening: false });
    }

    updateUI(newState);
  });

});

function updateUI(isListening) {

  if (isListening) {
    button.textContent = "Stop Listening";
    statusText.textContent = "Listening";
    statusDot.classList.remove("red");
    statusDot.classList.add("green");
  } else {
    button.textContent = "Start Listening";
    statusText.textContent = "Stopped";
    statusDot.classList.remove("green");
    statusDot.classList.add("red");
  }

}
