import api, { getAuthToken } from '../utils/api';

// --- 1. RECUPERA TUTTI GLI EVENTI (Bacheca Generale) ---
export const fetchEvents = async () => {
  try {
    const data = await api.get("/evento/tuttiGliEventi");
    // api.get returns JSON. Original check for 204 or status check is implicitly handled by api.get (throws on !ok).
    return data;
  } catch (error) { return []; }
};

// --- 2. CONTROLLA PARTECIPAZIONE SINGOLA ---
export const checkUserParticipation = async (idEvento) => {
  const token = getAuthToken();
  if (!token) return { isParticipating: false, idPartecipazione: null };
  try {
    // api.get auto-appends token.
    const data = await api.get(`/partecipazione/checkIscrizione/${idEvento}`);
    return data;
  } catch (error) {
    return { isParticipating: false, idPartecipazione: null };
  }
};

// --- 3. ISCRIVITI ---
export const iscrivitiEvento = async (idEvento) => {
  // Original called GET with token and idEvento as query params.
  try {
    const res = await api.get("/partecipazione/aggiungi", { idEvento });
    // api.get returns JSON if content-type is json, else text.
    // Assuming backend returns text or empty body on success?
    // Original: valid response is ok.

    // If res is object (JSON), success.

    // Original checked text for "partecipa già".
    if (typeof res === 'string' && res.toLowerCase().includes("partecipa già")) return { success: true };

    return { success: true };
  } catch (error) {
    // error is Error object. message might be the text from backend if it failed.
    return { success: false, message: error.message || "Errore di connessione" };
  }
};

// --- 4. RIMUOVI ISCRIZIONE ---
export const rimuoviIscrizione = async (idPartecipazione) => {
  try {
    // api.post auto-appends token.
    await api.post("/partecipazione/rimuovi", { idPartecipazione: idPartecipazione });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "Errore connessione" };
  }
};

// --- 5. LISTA PARTECIPANTI (Per Enti) ---
export const fetchPartecipanti = async (idEvento) => {
  const payload = {
    idEvento: parseInt(idEvento),
    maxPartecipanti: 0
  };
  try {
    const lista = await api.post("/partecipazione/visualizzaPartecipazioniEvento", payload);
    if (!Array.isArray(lista)) return [];
    return lista.map(p => p.volontario);
  } catch (error) {
    return [];
  }
};

// --- 6. DATI UTENTE ---
export const fetchDatiUtente = async () => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const data = await api.get("/account/datiUtente");
    return data;
  } catch (error) { return null; }
};

// --- 7. NUOVA FUNZIONE: RECUPERA I MIEI EVENTI (Cronologia Volontario) ---
export const getEventiSvolti = async () => {
  const token = getAuthToken();
  if (!token) return [];
  try {
    const data = await api.get("/partecipazione/visualizzaEventiUtente");
    return data;
  } catch (error) {
    console.error("Errore recupero miei eventi:", error);
    return [];
  }
};