// src/services/storiesService.js

const API_BASE_URL = "http://localhost:8080";

function getAuthToken() {
  //  prendi il token dove lo salvi
  // per esempio:
  return localStorage.getItem("token");
}

// Trasforma l'oggetto racconto REST 
function mapStoryFromApi(apiStory) {
  return {
    id: apiStory.idRacconto,
    title: apiStory.titolo,
    content: apiStory.descrizione,
    image: apiStory.immagine,            // può essere null
    createdAt: apiStory.dataPubblicazione,
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
    dataPubblicazione: updatedStory.createdAt, // va mandata ma NON cambiata
    immagine: updatedStory.image || null,
  };
}

export async function fetchStories() {
  const token = getAuthToken();

  const res = await fetch(
    `${API_BASE_URL}/racconto/visualizza?token=${token}`
  );

  if (!res.ok) {
    throw new Error("Errore nel caricamento delle storie");
  }

  const data = await res.json(); // supponiamo array di racconti
  return data.map(mapStoryFromApi);
}

export async function addStory(newStory) {
  const token = getAuthToken();
  const payload = mapNewStoryToApi(newStory);

  const res = await fetch(
    `${API_BASE_URL}/racconto/aggiungi?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // crei il JSON
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
      method: "PUT",
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
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idRacconto: storyId }), 
    }
  );

  if (!res.ok) {
    throw new Error("Errore durante la rimozione del racconto");
  }

  return true;
}
