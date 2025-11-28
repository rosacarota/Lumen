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
  // DEBUG: Stampa cosa stai per inviare
  console.log("Tentativo iscrizione a ID:", idEvento);

  if (!idEvento) {
    console.error("ERRORE: idEvento mancante o non valido!");
    return { success: false, message: "ID Evento mancante" };
  }

  const token = getToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/partecipazione/aggiungi?token=${encodeURIComponent(token)}&idEvento=${idEvento}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Usa parseInt per essere sicuro che sia un numero e non una stringa "1"
      /* body: JSON.stringify({ 
          evento: { idEvento: parseInt(idEvento) } 
      }) */
    });
    

    if (response.ok) {
        return { success: true };
    }
    
    // Recupera il messaggio di errore specifico dal backend (es. "Numero di partecipanti al completo")
    const errorMessage = await response.text();
    return { success: false, message: errorMessage };

  } catch (error) {
    console.error("Errore durante l'iscrizione:", error);
    return { success: false, message: "Errore di connessione al server" };
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