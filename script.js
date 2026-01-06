const URL = "https://<username>.github.io/<repo-name>/my_model/";
let model;

async function init() {
  // Microfoon check
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microfoon OK");
  } catch (err) {
    alert("Geef microfoon toegang!");
    return;
  }

  // Model laden
  model = await tmSpeech.load(URL + "model.json", URL + "metadata.json");
  console.log("Model geladen");

  // Knipperende ogen starten
  blinkEyes();

  // Stemherkenning starten
  model.listen(
    (predictions) => {
      const highest = predictions.reduce((prev, curr) =>
        curr.probability > prev.probability ? curr : prev
      );

      console.log("Herkenning:", highest.className, highest.probability);

      // Detecteer "Volgende"
      if (
        highest.className.trim().toLowerCase() === "volgende" &&
        highest.probability > 0.3
      ) {
        console.log("Volgende herkend! Naar volgende.html");
        window.location.href = "volgende.html";
      }
    },
    { probabilityThreshold: 0.3 }
  ); // laag voor testen
}

// Knipperende ogen functie
function blinkEyes() {
  const eyes = [
    document.getElementById("left-eye"),
    document.getElementById("right-eye"),
  ];

  setInterval(() => {
    eyes.forEach((eye) => eye.classList.add("blink"));
    setTimeout(() => eyes.forEach((eye) => eye.classList.remove("blink")), 200);
  }, 3000);
}

// Start alles
init();
