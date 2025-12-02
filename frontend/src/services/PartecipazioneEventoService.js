const API_BASE_URL = "http://localhost:8080"; 

const getToken = () => localStorage.getItem("token") || "";
const getUserEmail = () => localStorage.getItem("userEmail") || "";

// --- 1. RECUPERA EVENTI (GET) ---
export const fetchEvents = async () => {
  const url = new URL(`${API_BASE_URL}/evento/tuttiGliEventi`);
  try {
    const response = await fetch(url.toString(), { 
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.status === 204 || !response.ok) return [];
    return await response.json();
  } catch (error) { return []; }
};

// --- 2. CONTROLLA PARTECIPAZIONE (GET - Nuovo Endpoint Sicuro) ---
export const checkUserParticipation = async (idEvento) => {
  const token = getToken();
  if (!token) return { isParticipating: false, idPartecipazione: null };

  try {
    // Usiamo la GET che è più sicura e non richiede body
    const response = await fetch(`${API_BASE_URL}/partecipazione/checkIscrizione/${idEvento}?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) return { isParticipating: false, idPartecipazione: null };

    return await response.json();

  } catch (error) {
    return { isParticipating: false, idPartecipazione: null };
  }
};

// --- 3. ISCRIVITI (GET) ---
export const iscrivitiEvento = async (idEvento) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/aggiungi?token=${encodeURIComponent(token)}&idEvento=${idEvento}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) return { success: true };
    
    const text = await response.text();
    if (text.toLowerCase().includes("partecipa già")) return { success: true };
    return { success: false, message: text };
  } catch (error) {
    return { success: false, message: "Errore di connessione" };
  }
};

// --- 4. RIMUOVI (POST) ---
export const rimuoviIscrizione = async (idPartecipazione) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/rimuovi?token=${encodeURIComponent(token)}`, {
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

// --- 5. LISTA PARTECIPANTI (POST - FIX BUG JAVA INT) ---
export const fetchPartecipanti = async (idEvento) => {
  const token = getToken();
  
  // FIX CRITICO: Il backend Java si aspetta un oggetto Evento completo.
  // Se 'maxPartecipanti' è un int primitivo in Java, non può essere null.
  // Mandiamo '0' o un valore dummy per evitare l'errore 400.
  const payload = {
      idEvento: parseInt(idEvento),
      maxPartecipanti: 0 // <--- QUESTO RISOLVE L'ERRORE "Cannot map null into type int"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/visualizzaPartecipazioniEvento?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error("Errore fetch partecipanti:", response.status);
        return [];
    }

    const lista = await response.json();
    return lista.map(p => p.volontario);
  } catch (error) { 
    return []; 
  }
};

// --- 6. DATI UTENTE (GET) ---
export const fetchDatiUtente = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/datiUtente?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return null;
    return await response.json(); 
  } catch (error) { return null; }
};