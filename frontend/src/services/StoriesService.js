import api from '../utils/api';

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
    authorAvatar: (typeof apiStory.utente === 'object' && apiStory.utente?.immagine) ? apiStory.utente.immagine : null,
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
  const data = await api.get("/racconto/visualizzaTutti");
  const allStories = data.map(mapStoryFromApi);
  return allStories;
}

export async function fetchFilteredStories(email) {
  const payload = { email };
  const data = await api.post("/racconto/visualizza", payload);
  const filteredStories = data.map(mapStoryFromApi);
  return filteredStories;
}

export async function addStory(newStory) {
  const payload = mapNewStoryToApi(newStory);
  const created = await api.post("/racconto/aggiungi", payload);
  return mapStoryFromApi(created);
}

export async function editStory(updatedStory) {
  const payload = mapUpdatedStoryToApi(updatedStory);
  const saved = await api.post("/racconto/modifica", payload);
  return mapStoryFromApi(saved);
}

export async function deleteStory(storyId) {
  await api.post("/racconto/rimuovi", { idRacconto: storyId });
  return true;
}