console.log("Content script active on:", window.location.href);



function speak(text) {

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);

}

let intervalId = null;



function startPolling() {

  if (intervalId) return;

  console.log("🚀 Polling started");

  intervalId = setInterval(async () => {

    try {

      const res = await fetch("http://127.0.0.1:5000/get");
      const data = await res.json();

      console.log("Backend data:", data);

      if (data.command && data.command.trim() !== "") {
        executeCommand(data.command.toLowerCase());
      }

    } catch (err) {

      console.error("Polling error:", err);

    }

  }, 6000);
}

function stopPolling() {

  clearInterval(intervalId);
  intervalId = null;

  console.log("🛑 Polling stopped");

}



chrome.storage.local.get("listening", (result) => {

  if (result.listening) {
    startPolling();
  }

});

chrome.storage.onChanged.addListener((changes) => {

  if (changes.listening) {

    if (changes.listening.newValue) {
      startPolling();
    } else {
      stopPolling();
    }

  }

});



function executeCommand(text) {
  /* ---------- STOP READING ---------- */

if (text.includes("stop reading") || text.includes("stop voice")) {

  window.speechSynthesis.cancel();

  console.log("🛑 Speech stopped");

  return;
}

  console.log("Executing:", text);


  if (text.includes("read page")) {

  const content = document.body.innerText.slice(0, 800);

  speak("Reading page content");

  setTimeout(() => {
    speak(content);
  }, 1500);

  return;
}


  

  if (text.startsWith("search")) {

    const query = text.replace("search", "").trim();

    if (query.length > 0) {

      speak("Searching for " + query);

      window.location.href =
        "https://www.google.com/search?q=" +
        encodeURIComponent(query);

    }

    return;
  }

  

  if (text.startsWith("open")) {

    const site = text.replace("open", "").trim();

    if (site.length > 0) {

      speak("Opening " + site);

      window.location.href =
        "https://www." + site + ".com";

    }

    return;
  }

 

  if (text.includes("scroll down")) {

    speak("Scrolling down");

    window.scrollBy({ top: 600, behavior: "smooth" });

    return;
  }

  if (text.includes("scroll up")) {

    speak("Scrolling up");

    window.scrollBy({ top: -600, behavior: "smooth" });

    return;
  }



  if (text.startsWith("type")) {

    const content = text.replace("type", "").trim();

    const active = document.activeElement;

    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
    ) {

      speak("Typing text");

      active.value += content;

      active.dispatchEvent(new Event("input", { bubbles: true }));

    }

    return;
  }

  

  if (text.startsWith("click")) {

    const target = text.replace("click", "").trim();

    speak("Clicking " + target);

    const elements = document.querySelectorAll("button, a");

    const match = target.match(/\d+/);

    if (match) {

      const index = parseInt(match[0], 10) - 1;

      if (elements[index]) {

        elements[index].click();
        return;

      }

    }

    elements.forEach(el => {

      if (
        el.innerText &&
        el.innerText.toLowerCase().includes(target)
      ) {

        el.click();

      }

    });

    return;
  }

  

  if (text.startsWith("select")) {

    const value = text.replace("select", "").trim();

    const selects = document.querySelectorAll("select");

    selects.forEach(select => {

      Array.from(select.options).forEach(option => {

        if (option.text.toLowerCase().includes(value)) {

          speak("Selecting " + option.text);

          select.value = option.value;

          select.dispatchEvent(new Event("change", { bubbles: true }));

        }

      });

    });

    return;
  }

}
