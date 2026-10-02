console.log("Background loaded");

chrome.runtime.onMessage.addListener(async (msg) => {

  if (msg.action === "TOGGLE") {

    if (msg.state === "START") {
      await fetch("http://127.0.0.1:5000/start");
      console.log("Voice assistant started");
    }

    if (msg.state === "STOP") {
      await fetch("http://127.0.0.1:5000/stop");
      console.log("Voice assistant stopped");
    }
  }

});
