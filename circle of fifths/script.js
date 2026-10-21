
const circle = document.getElementById("circle-of-fifths");
const keyTitle = document.getElementById("key-title");
const keySignature = document.getElementById("key-signature");
const scaleNotes = document.getElementById("scale-notes");
const pianoKeyboard = document.getElementById("piano-keyboard");
const keyChords = document.getElementById("key-chords");

let keys = [];

const chordDegrees = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];

const keyboardImageKeys = {
  "F♯": "Gb",
  "C♯": "Db",
  "G♯": "Ab",
  "D♯": "Eb",
  "A♯": "Bb",
  "D♭": "Db",
  "A♭": "Ab",
  "E♭": "Eb",
  "B♭": "Bb"
};

async function loadKeys() {
  try {
    const response = await fetch("keys.json");

    if (!response.ok) {
      throw new Error("Could not load keys.json");
    }

    keys = await response.json();

    drawCircle();
    drawKey(keys.find(key => key.key === "C"));
  } catch (error) {
    console.error(error);
    circle.innerHTML = '<p class="loading-text">Could not load keys. Open this project with Live Server.</p>';
  }
}

function drawCircle() {
  circle.innerHTML = '<div class="circle-of-fifths"></div>';

  const wheel = circle.querySelector(".circle-of-fifths");

  keys.forEach((key, index) => {
    const angle = (index * 30 - 90) * Math.PI / 180;
    const radius = 40;

    const button = document.createElement("button");
    button.className = "key-button btn p-0";
    button.dataset.key = key.key;

    button.style.left = `${50 + radius * Math.cos(angle)}%`;
    button.style.top = `${50 + radius * Math.sin(angle)}%`;

    button.innerHTML = `
      <strong>${key.key}</strong>
      <small>${key.signature}</small>
    `;

    button.addEventListener("click", () => {
      drawKey(key);
    });

    wheel.appendChild(button);
  });
}

function drawKey(key) {
  if (!key) return;

  keyTitle.textContent = key.name;
  keySignature.textContent = key.signature;

  document.querySelectorAll(".key-button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === key.key);
  });

  scaleNotes.innerHTML = "";

  key.notes.forEach(note => {
    const element = document.createElement("span");
    element.className = "note";
    element.textContent = note;
    scaleNotes.appendChild(element);
  });

  const imageKey = keyboardImageKeys[key.key] || key.key;
  pianoKeyboard.src = `imgs/${imageKey}.png`;
  pianoKeyboard.alt = `${key.name} piano keyboard`;
  drawChords(key);
}

function drawChords(key) {
  keyChords.innerHTML = "";

  key.chords.forEach((chord, index) => {
    const column = document.createElement("div");
    column.className = "col-6 col-md-3";

    column.innerHTML = `
      <div class="chord-card p-3 border">
        <span class="chord-degree">${chordDegrees[index]}</span>
        <strong class="d-block mb-2">${chord.name}</strong>
        <span class="chord-quality">${chord.quality}</span>
        <p class="chord-notes mb-0 mt-2">${chord.notes.join(" · ")}</p>
      </div>
    `;

    keyChords.appendChild(column);
  });
}

loadKeys();
