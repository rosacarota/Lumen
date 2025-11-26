const API_BASE_URL = "http://localhost:8080";

function getAuthToken() {
  return localStorage.getItem("token");
}

// Trasforma l'oggetto racconto REST 
function mapStoryFromApi(apiStory) {
  return {
    id: apiStory.idRacconto, 
    title: apiStory.titolo,
    content: apiStory.descrizione,
    image: apiStory.immagine,
    createdAt: apiStory.dataPubblicazione,
   
    // nel JSON di risposta del backend e dovrebbero essere aggiunti se necessari.
    authorName: apiStory.autoreNome || "Anonimo", 
    authorRole: apiStory.autoreRuolo || "utente",
    type: apiStory.immagine ? "photo" : "text",
  };
}

// Trasforma i dati del frontend in JSON per /aggiungi
function mapNewStoryToApi(newStory) {
  return {
    titolo: newStory.title,
    descrizione: newStory.content,
    immagine: newStory.image || null,
  };
}

// Trasforma i dati in JSON per /modifica
function mapUpdatedStoryToApi(updatedStory) {
  return {
    idRacconto: updatedStory.id,
    titolo: updatedStory.title,
    descrizione: updatedStory.content,
    dataPubblicazione: updatedStory.createdAt, 
    immagine: updatedStory.image || null,
  };
}

// === METODI AGGIORNATI PER USARE ESCLUSIVAMENTE POST ===

export async function fetchStories() {
  const token = getAuthToken();

  const res = await fetch(
    `${API_BASE_URL}/racconto/visualizza?token=${token}`,
    { 
      method: "GET" 
    } 
  );

  if (!res.ok) {
    throw new Error("Errore nel caricamento delle storie");
  }

  const data = await res.json(); 
  return data.map(mapStoryFromApi);
}

export async function addStory(newStory) {
  const token = getAuthToken();
  const payload = mapNewStoryToApi(newStory);

  const res = await fetch(
    `${API_BASE_URL}/racconto/aggiungi?token=${token}`,
    {
      method: "POST", // Corretto
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Errore durante l'aggiunta del racconto");
  }

  const created = await res.json();
  return mapStoryFromApi(created);
}

export async function editStory(updatedStory) {
  const token = getAuthToken();
  const payload = mapUpdatedStoryToApi(updatedStory);

  const res = await fetch(
    `${API_BASE_URL}/racconto/modifica?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Errore durante la modifica del racconto");
  }

  const saved = await res.json();
  return mapStoryFromApi(saved);
}

export async function deleteStory(storyId) {
  const token = getAuthToken();

  const res = await fetch(
    `${API_BASE_URL}/racconto/rimuovi?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // corpo per inviare l'ID, come previsto dal backend
      body: JSON.stringify({ idRacconto: storyId }), 
    }
  );

  if (!res.ok) {
    throw new Error("Errore durante la rimozione del racconto");
  }

  return true;
}
