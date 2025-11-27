const API_BASE_URL = "http://localhost:8080"; 
const getToken = () => localStorage.getItem("token") || "";

export const fetchEvents = async (stato = "") => {
  //const token = getToken(); 
  const url = new URL(`${API_BASE_URL}/evento/tuttiGliEventi`);
  try {
    const response = await fetch(url.toString(), { 
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 204) return [];
    if (!response.ok) return [];

    return await response.json();
  } catch (error) { 
    return []; 
  }
};

export const checkUserParticipation = async (idEvento) => {
  const token = getToken();
  if (!token) return { isParticipating: false, idPartecipazione: null };

  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/checkIscrizione/${idEvento}?token=${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) return { isParticipating: false, idPartecipazione: null };

    return await response.json();
  } catch (error) {
    return { isParticipating: false, idPartecipazione: null };
  }
};

export const iscrivitiEvento = async (idEvento) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/aggiungi?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento: { idEvento: idEvento } })
    });

    if (response.ok) return { success: true };
    return { success: false, message: await response.text() };
  } catch (error) {
    return { success: false, message: "Errore connessione" };
  }
};

export const rimuoviIscrizione = async (idPartecipazione) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/rimuovi?token=${token}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idPartecipazione: idPartecipazione })
    });

    if (response.ok) return { success: true };
    return { success: false, message: await response.text() };
  } catch (error) {
    return { success: false, message: "Errore connessione" };
  }
};