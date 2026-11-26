const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)
();
recognition.lang = 'en-US';