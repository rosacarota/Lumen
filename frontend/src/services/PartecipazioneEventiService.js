const API_BASE_URL = "http://localhost:8080"; // Assicurati che la porta sia giusta (8080 è standard Spring)

// Helper: Recupera il token salvato al login
const getToken = () => localStorage.getItem("token") || "";
// Helper: Recupera l'email salvata al login
const getUserEmail = () => localStorage.getItem("userEmail") || "";

// --- 1. RECUPERA EVENTI (Lista Reale dal Database) ---
export const fetchEvents = async () => {
  const token = getToken(); 
  
  try {
    // Chiamata reale al backend
    // Assumo che l'endpoint sia GET /evento/visualizzaTutti e richieda il token
    const response = await fetch(`${API_BASE_URL}/evento/visualizzaTutti?token=${token}`, {
      method: 'GET', // Se il tuo EventoControl usa @PostMapping, cambia 'GET' in 'POST'
      headers: { 
        'Content-Type': 'application/json' 
      }
    });

    if (!response.ok) {
      console.error("Errore nel recupero eventi dal server:", response.status);
      return [];
    }

    // Il backend deve restituire una lista di oggetti Evento in formato JSON
    return await response.json();

  } catch (error) { 
    console.error("Errore di connessione fetchEvents:", error);
    return []; 
  }
};

// --- 2. CONTROLLA SE L'UTENTE PARTECIPA GIA' ---
// Chiama: visualizzaPartecipazioniEvento
export const checkUserParticipation = async (idEvento) => {
  const token = getToken();
  const emailUtente = getUserEmail();

  if (!token || !emailUtente) return { isParticipating: false, idPartecipazione: null };

  try {
    // Il tuo backend si aspetta un oggetto Evento nel body
    const response = await fetch(`${API_BASE_URL}/partecipazione/visualizzaPartecipazioniEvento?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idEvento: idEvento }) 
    });

    if (!response.ok) return { isParticipating: false, idPartecipazione: null };

    const listaPartecipazioni = await response.json();

    // Filtriamo la lista lato client per vedere se c'è la nostra email
    // (Java: p.getVolontario().getEmail())
    const partecipazioneTrovata = listaPartecipazioni.find(
      p => p.volontario && p.volontario.email === emailUtente
    );

    if (partecipazioneTrovata) {
      return { isParticipating: true, idPartecipazione: partecipazioneTrovata.idPartecipazione };
    } else {
      return { isParticipating: false, idPartecipazione: null };
    }

  } catch (error) {
    console.error("Errore checkUserParticipation:", error);
    return { isParticipating: false, idPartecipazione: null };
  }
};

// --- 3. ISCRIVITI ---
// Chiama: /partecipazione/aggiungi
export const iscrivitiEvento = async (idEvento) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/aggiungi?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Java si aspetta un oggetto Partecipazione che contiene un Evento
      body: JSON.stringify({
        evento: {
          idEvento: idEvento
        }
      })
    });

    if (response.ok) return { success: true };
    
    const errorMsg = await response.text();
    return { success: false, message: errorMsg };

  } catch (error) {
    return { success: false, message: "Errore di connessione" };
  }
};

// --- 4. RIMUOVI ISCRIZIONE ---
// Chiama: /partecipazione/rimuovi
export const rimuoviIscrizione = async (idPartecipazione) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/rimuovi?token=${token}`, {
      method: 'POST', // Il tuo controller usa @PostMapping anche per eliminare
      headers: { 'Content-Type': 'application/json' },
      // Java si aspetta un oggetto Partecipazione con l'ID settato
      body: JSON.stringify({
        idPartecipazione: idPartecipazione
      })
    });

    if (response.ok) return { success: true };

    const errorMsg = await response.text();
    return { success: false, message: errorMsg };

  } catch (error) {
    return { success: false, message: "Errore di connessione" };
  }
};