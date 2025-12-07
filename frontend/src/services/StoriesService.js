const API_BASE_URL = "http://localhost:8080";

function getAuthToken() {
  return localStorage.getItem("token");
}

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function mapStoryFromApi(apiStory) {
  let authorEmail = "";
  let authorName = "Utente";

  if (apiStory.utente) {
    if (typeof apiStory.utente === 'object') {
      authorEmail = apiStory.utente.email || "";
      authorName = apiStory.utente.nome || apiStory.autoreNome || "Utente";
    } else {
      authorEmail = String(apiStory.utente);
      authorName = apiStory.autoreNome || "Utente";
    }
  }

  if (!authorEmail && apiStory.autoreEmail) {
    authorEmail = apiStory.autoreEmail;
  }

  return {
    id: apiStory.idRacconto,
    title: apiStory.titolo,
    content: apiStory.descrizione,
    imageBase64: apiStory.immagine || null,
    createdAt: apiStory.dataPubblicazione,
    authorEmail: authorEmail.trim().toLowerCase(),
    authorName: authorName,
    authorRole: apiStory.autoreRuolo,
    type: apiStory.immagine ? "photo" : "text",
    utente: apiStory.utente, // Preserva l'oggetto utente completo con ruolo, immagine, etc.
  };
}

function mapNewStoryToApi(newStory) {
  return {
    titolo: newStory.title,
    descrizione: newStory.content,
    immagine: newStory.imageBase64 || null,
  };
}

function mapUpdatedStoryToApi(updatedStory) {
  return {
    idRacconto: updatedStory.id,
    titolo: updatedStory.title,
    descrizione: updatedStory.content,
    dataPubblicazione: updatedStory.createdAt,
    immagine: updatedStory.imageBase64 || null,
  };
}

export async function fetchStories(targetEmail = null) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/racconto/visualizzaTutti?token=${token}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Errore nel caricamento delle storie");

  const data = await res.json();

  const allStories = data.map(mapStoryFromApi);

  if (targetEmail) {
    const safeTarget = targetEmail.trim().toLowerCase();

    /*const filtered = allStories.filter(story => {
        const match = story.authorEmail === safeTarget;
        return match;
    });
    
    return filtered;*/
  }

  return allStories;
}

export async function fetchFilteredStories(targetEmail = null) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/racconto/visualizza?token=${token}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Errore nel caricamento delle storie filtrate");

  const data = await res.json();

  const filteredStories = data.map(mapStoryFromApi);

  return filteredStories;

}

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