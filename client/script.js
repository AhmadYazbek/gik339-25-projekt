// URL till vårt backend-API
const API_URL = "http://localhost:3000/filmer";

// Referenser till formulär och lista i DOM
const form = document.getElementById("filmForm");
const filmList = document.getElementById("filmList");

// ===== MODAL FÖR FEEDBACK =====
// Visas när en film skapas, uppdateras eller tas bort
const feedbackModal = new bootstrap.Modal(
  document.getElementById("feedbackModal")
);
const modalMessage = document.getElementById("modalMessage");

// Funktion för att visa text i feedback-modalen
function showMessage(text) {
  modalMessage.textContent = text;
  feedbackModal.show();
}

// ===== MODAL FÖR BEKRÄFTELSE VID BORTTAGNING =====
let deleteId = null; // Sparar id på filmen som ska tas bort

const deleteModal = new bootstrap.Modal(
  document.getElementById("deleteConfirmModal")
);
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// ===== REDIGERING =====
let editId = null; // Håller koll på vilken film som redigeras

// ===== GRAFISK ASPEKT (KRAV) =====
// Färgar kort beroende på betyg
function getCardClass(betyg) {
  if (betyg >= 8) return "border-success"; // Bra film
  if (betyg >= 5) return "border-warning"; // Okej film
  return "border-danger"; // Dålig film
}

// ===== HÄMTA OCH VISA ALLA FILMER =====
async function loadFilms() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Töm listan innan ny data visas
  filmList.innerHTML = "";

  data.forEach((film) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    // Skapar kort för varje film
    col.innerHTML = `
      <div class="card h-100 ${getCardClass(film.betyg)}">
        <div class="card-body">
          <h5 class="card-title">${film.titel}</h5>
          <p><strong>Genre:</strong> ${film.genre}</p>
          <p><strong>År:</strong> ${film.ar}</p>
          <p><strong>Betyg:</strong> ${film.betyg}</p>

          <button
            class="btn btn-sm btn-warning me-2"
            onclick="editFilm(${film.id})"
          >
            Ändra
          </button>
          <button
            class="btn btn-sm btn-danger"
            onclick="deleteFilm(${film.id})"
          >
            Ta bort
          </button>
        </div>
      </div>
    `;

    filmList.appendChild(col);
  });
}

// ===== SKAPA ELLER UPPDATERA FILM =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Hämtar värden från formuläret
  const film = {
    titel: document.getElementById("titelInput").value,
    genre: document.getElementById("genreInput").value,
    ar: Number(document.getElementById("arInput").value),
    betyg: Number(document.getElementById("betygInput").value),
  };

  // Om editId finns uppdateras befintlig film
  if (editId !== null) {
    film.id = editId;
  }

  // Skickar POST eller PUT beroende på om vi skapar eller uppdaterar
  await fetch(API_URL, {
    method: editId ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  });

  // Visar feedback till användaren
  showMessage(editId ? "Filmen uppdaterades!" : "Filmen lades till!");

  // Återställer formuläret och laddar om listan
  form.reset();
  editId = null;
  loadFilms();
});

// ===== FYLL FORMULÄR VID REDIGERING =====
async function editFilm(id) {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Hittar rätt film baserat på id
  const film = data.find((f) => f.id === id);

  // Fyller formuläret med befintlig data
  document.getElementById("titelInput").value = film.titel;
  document.getElementById("genreInput").value = film.genre;
  document.getElementById("arInput").value = film.ar;
  document.getElementById("betygInput").value = film.betyg;

  editId = id;
}

// ===== BEKRÄFTA OCH TA BORT FILM =====
function deleteFilm(id) {
  // Sparar id och visar bekräftelse-modal
  deleteId = id;
  deleteModal.show();
}

// Körs när användaren bekräftar borttagning
confirmDeleteBtn.addEventListener("click", async () => {
  if (deleteId === null) return;

  await fetch(`${API_URL}/${deleteId}`, {
    method: "DELETE",
  });

  deleteId = null;
  deleteModal.hide();

  // Visar feedback och uppdaterar listan
  showMessage("Filmen togs bort!");
  loadFilms();
});

// ===== START =====
// Hämtar filmer när sidan laddas
loadFilms();
