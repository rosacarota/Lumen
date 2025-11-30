const API_BASE_URL = "http://localhost:8080"; 

const getToken = () => localStorage.getItem("token") || "";
const getUserEmail = () => localStorage.getItem("userEmail") || "";

// --- 1. RECUPERA EVENTI ---
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

// --- 2. CONTROLLA PARTECIPAZIONE (USIAMO IL TUO NUOVO ENDPOINT!) ---
// Chiama: @GetMapping("/checkIscrizione/{idEvento}")
export const checkUserParticipation = async (idEvento) => {
  const token = getToken();
  if (!token) return { isParticipating: false, idPartecipazione: null };

  try {
    // Chiamata diretta all'endpoint specifico che hai creato
    const response = await fetch(`${API_BASE_URL}/partecipazione/checkIscrizione/${idEvento}?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) return { isParticipating: false, idPartecipazione: null };

    /* 
       Il tuo backend Java restituisce esattamente questo:
       {
         "isParticipating": true,
         "idPartecipazione": 123
       }
       Quindi possiamo restituire direttamente il JSON!
    */
    return await response.json();

  } catch (error) {
    console.error("Errore check:", error);
    return { isParticipating: false, idPartecipazione: null };
  }
};

// --- 3. ISCRIVITI (CORRETTO PER IL TUO JAVA) ---
// Chiama: @GetMapping("/aggiungi")
export const iscrivitiEvento = async (idEvento) => {
  const token = getToken();
  try {
    // Java usa @RequestParam, quindi i dati vanno nell'URL
    const response = await fetch(`${API_BASE_URL}/partecipazione/aggiungi?token=${encodeURIComponent(token)}&idEvento=${idEvento}`, {
      method: 'GET', // <--- IMPORTANTE: Java usa @GetMapping
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok || response.status === 201) {
        return { success: true };
    }
    
    const text = await response.text();
    // Se dice "partecipa già", è comunque un successo per la UI
    if (text.toLowerCase().includes("partecipa già")) {
        return { success: true };
    }

    return { success: false, message: text };
  } catch (error) {
    return { success: false, message: "Errore di connessione" };
  }
};

// --- 4. RIMUOVI ISCRIZIONE (CORRETTO PER IL TUO JAVA) ---
// Chiama: @PostMapping("/rimuovi")
export const rimuoviIscrizione = async (idPartecipazione) => {
  const token = getToken();
  try {
    // Java usa @PostMapping e @RequestBody Partecipazione
    // Quindi dobbiamo mandare un JSON con dentro l'ID
    const response = await fetch(`${API_BASE_URL}/partecipazione/rimuovi?token=${encodeURIComponent(token)}`, {
      method: 'POST', // <--- IMPORTANTE: Java usa @PostMapping
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          idPartecipazione: idPartecipazione 
      })
    });

    if (response.ok) return { success: true };
    
    return { success: false, message: await response.text() };
  } catch (error) {
    return { success: false, message: "Errore connessione" };
  }
};

// --- 5. LISTA PARTECIPANTI ---
// Chiama: @PostMapping("/visualizzaPartecipazioniEvento")
export const fetchPartecipanti = async (idEvento) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/visualizzaPartecipazioniEvento?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idEvento: idEvento })
    });
    if (!response.ok) return [];
    const lista = await response.json();
    return lista.map(p => p.volontario);
  } catch (error) { return []; }
};

// --- 6. DATI UTENTE ---
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