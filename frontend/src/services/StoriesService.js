const API_BASE_URL = "http://localhost:8080";

// Recupera token dalla sessione (o localStorage se ti serve)
/* Se usi localStorage, sostituisci la funzione */
function getAuthToken() {
  return localStorage.getItem("token");
}

// Converte un file immagine in Base64
export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// ====================== MAPPATURE ======================

// JSON → Oggetto UI
function mapStoryFromApi(apiStory) {
  return {
    id: apiStory.idRacconto,
    title: apiStory.titolo,
    content: apiStory.descrizione,
    imageBase64: apiStory.immagine || null,
    createdAt: apiStory.dataPubblicazione,

    authorName: apiStory.autoreNome,  
    authorRole: apiStory.autoreRuolo,
    type: apiStory.immagine ? "photo" : "text",
  };
}

// Oggetto UI → JSON per aggiunta racconto
function mapNewStoryToApi(newStory) {
  return {
    titolo: newStory.title,
    descrizione: newStory.content,
    immagine: newStory.imageBase64 || null, // BASE64
  };
}

// Oggetto UI → JSON per modifica racconto
function mapUpdatedStoryToApi(updatedStory) {
  return {
    idRacconto: updatedStory.id,
    titolo: updatedStory.title,
    descrizione: updatedStory.content,
    dataPubblicazione: updatedStory.createdAt,
    immagine: updatedStory.imageBase64 || null, // BASE64
  };
}

// ====================== API CALLS ======================

// VISUALIZZA RACCONTI
export async function fetchStories() {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/racconto/visualizza?token=${token}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Errore nel caricamento delle storie");

  const data = await res.json();
  return data.map(mapStoryFromApi);
}

// AGGIUNGI RACCONTO CON IMMAGINE BASE64
export async function addStory(newStory) {
  const token = getAuthToken();
  const payload = mapNewStoryToApi(newStory);

  const res = await fetch(`${API_BASE_URL}/racconto/aggiungi?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Errore durante l'aggiunta del racconto");

  const created = await res.json();
  return mapStoryFromApi(created);
}

// MODIFICA RACCONTO CON IMMAGINE BASE64
export async function editStory(updatedStory) {
  const token = getAuthToken();
  const payload = mapUpdatedStoryToApi(updatedStory);

  const res = await fetch(`${API_BASE_URL}/racconto/modifica?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Errore durante la modifica del racconto");

  const saved = await res.json();
  return mapStoryFromApi(saved);
}

// RIMUOVI RACCONTO
export async function deleteStory(storyId) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/racconto/rimuovi?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idRacconto: storyId }),
  });

  if (!res.ok) throw new Error("Errore durante la rimozione del racconto");

  return true;
}