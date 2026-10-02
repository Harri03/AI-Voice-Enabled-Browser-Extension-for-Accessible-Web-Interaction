const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript;
  chrome.runtime.sendMessage({ spokenText: text });
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg === "START_VOICE") {
    recognition.start();
  }
});
