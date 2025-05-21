const text = document.getElementById("textToConvert");
const convertBtn = document.getElementById("convertBtn");
const error = document.querySelector('.error-para');

let femaleVoice = null;
const speechSynth = window.speechSynthesis;

// Function to load voices and select a female voice
function loadVoices() {
    return new Promise((resolve) => {
        let voices = speechSynth.getVoices();
        if (voices.length) {
            resolve(voices);
        } else {
            speechSynth.onvoiceschanged = () => {
                voices = speechSynth.getVoices();
                resolve(voices);
            };
        }
    });
}

loadVoices().then((voices) => {
    // Try to find a female voice by checking voice name or voice gender if available
    femaleVoice = voices.find(voice => {
        // Common female voice names or check for 'female' in voice name (case insensitive)
        return /female|woman|zira|susan|karen|victoria|amelie|alice|samantha/i.test(voice.name);
    }) || voices[0]; // fallback to first voice if no female voice found
});

convertBtn.addEventListener('click', function () {
    const enteredText = text.value;

    if (!speechSynth) {
        error.textContent = "Speech Synthesis not supported in this browser.";
        return;
    }

    if (speechSynth.speaking) {
        error.textContent = "Speech is already playing.";
        return;
    }

    if (!enteredText.trim().length) {
        error.textContent = `Nothing to Convert! Enter text in the text area.`;
        return;
    }

    error.textContent = "";

    const newUtter = new SpeechSynthesisUtterance(enteredText);

    if (femaleVoice) {
        newUtter.voice = femaleVoice;
    }

    newUtter.onstart = () => {
        convertBtn.textContent = "Sound is Playing...";
    };

    newUtter.onend = () => {
        convertBtn.textContent = "Play Converted Sound";
    };

    newUtter.onerror = (event) => {
        error.textContent = "An error occurred during speech synthesis: " + event.error;
        convertBtn.textContent = "Play Converted Sound";
    };

    speechSynth.speak(newUtter);
});
