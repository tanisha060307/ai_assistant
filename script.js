const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
const btn = document.querySelector("#btn");
const statusMessage = document.querySelector("#status");

function setStatus(message) {
  statusMessage.textContent = message;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    console.error("Speech synthesis is not supported by this browser.");
    return null;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
  return utterance;
}

function openSite(url, label) {
  setStatus(`Opening ${label}...`);
  window.location.assign(url);
}

function handleCommand(command) {
  const normalizedCommand = command.toLowerCase().replace(/\s+/g, " ").trim();
  recognition.stop();

  if (normalizedCommand.includes("open youtube") || normalizedCommand.includes("open you tube")) {
    openSite("https://www.youtube.com", "YouTube");
  } else if (normalizedCommand.includes("open whatsapp") || normalizedCommand.includes("open whats app")) {
    openSite("https://web.whatsapp.com", "WhatsApp");
  } else if (normalizedCommand.includes("open facebook")) {
    openSite("https://www.facebook.com", "Facebook");
  } else if (normalizedCommand.includes("open instagram")) {
    openSite("https://www.instagram.com", "Instagram");
  } else if (normalizedCommand === "open google") {
    openSite("https://www.google.com", "Google");
  } else if (normalizedCommand) {
    const searchQuery = command
      .trim()
      .replace(/^(?:search(?: google)?(?: for)?|google search(?: for)?|google)\s+/i, "")
      .trim();
    const query = searchQuery || command.trim();
    openSite(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      "Google search"
    );
  } else {
    setStatus("I didn't hear a command. Press Start Listening and try again.");
  }
}

function resetButton() {
  btn.disabled = false;
  btn.textContent = "🎙️ Start Listening";
  btn.classList.remove("listening");
}

function startRecognition() {
  try {
    recognition.start();
  } catch (error) {
    resetButton();
    setStatus("Could not start listening. Please try again.");
    console.error("Could not start speech recognition:", error);
  }
}

if (recognition) {
  recognition.lang = "en-US";
  recognition.addEventListener("start", () => {
    btn.textContent = "Listening...";
    btn.classList.add("listening");
    setStatus("Listening. Say a command or ask a question.");
  });
  recognition.addEventListener("result", (event) => {
    const result = event.results[event.resultIndex];
    if (result && result.isFinal) {
      handleCommand(result[0].transcript);
    }
  });
  recognition.addEventListener("end", resetButton);
  recognition.addEventListener("error", (event) => {
    resetButton();
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      setStatus("Microphone access was blocked. Allow microphone access and try again.");
    } else {
      setStatus(`Speech recognition error: ${event.error}. Please try again.`);
    }
    console.error("Speech recognition error:", event.error);
  });
}

btn.addEventListener("click", () => {
  if (!recognition) {
    setStatus("Speech recognition is not supported. Try Chrome or Edge.");
    speak("Speech recognition is not supported by this browser.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Starting...";
  setStatus("Starting the assistant...");

  const greeting = speak("Hello, how can I help you?");
  if (greeting) {
    greeting.addEventListener("end", startRecognition, { once: true });
    greeting.addEventListener("error", startRecognition, { once: true });
  } else {
    startRecognition();
  }
});
