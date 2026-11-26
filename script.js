const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
const btn = document.querySelector("#btn");

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function handleCommands(command) {
    const normalizedCommand = command.toLowerCase();

    if (normalizedCommand.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com", "_blank");
    } else if (normalizedCommand.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://www.facebook.com", "_blank");
    } else if (normalizedCommand.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://www.instagram.com", "_blank");
    } else {
        speak("Search on YouTube.");
    }
}

if (recognition) {
    recognition.lang = "en-US";
    recognition.addEventListener("result", (event) => {
        handleCommands(event.results[0][0].transcript);
    });
}

btn.addEventListener("click", () => {
    speak("Hello, how can I help you?");

    if (recognition) {
        recognition.start();
    } else {
        console.error("Speech recognition is not supported by this browser.");
    }
});