const API_BASE_URL = "http://localhost:8080"; // Assicurati che la porta sia giusta (8080 è standard Spring)

// Helper: Recupera il token salvato al login
const getToken = () => localStorage.getItem("token") || "";
// Helper: Recupera l'email salvata al login
const getUserEmail = () => localStorage.getItem("userEmail") || "";

// --- 1. RECUPERA EVENTI (Lista) ---
// Nota: Non mi hai mandato EventoControl, quindi qui lascio i dati finti per ora.
// Quando avrai il backend eventi, scommenta la fetch.
export const fetchEvents = async () => {
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/evento/visualizzaTutti`);
    return await response.json();
  } catch (error) { return []; }
  */
 
  // MOCK DATA (Dati finti per vedere la grafica)
  return [
    {
      idEvento: 1,
      titolo: "Pulizia Spiaggia",
      descrizione: "Raccogliamo la plastica per un mare più pulito.",
      luogo: "Lido di Ostia",
      dataInizio: "2025-06-15T09:00:00",
      dataFine: "2025-06-15T13:00:00",
      ente: "Legambiente",
      maxPartecipanti: 50,
      immagine: null
    },
    {
      idEvento: 2,
      titolo: "Raccolta Alimentare",
      descrizione: "Aiuto per le famiglie in difficoltà.",
      luogo: "Roma",
      dataInizio: "2025-12-05T08:00:00",
      dataFine: "2025-12-05T20:00:00",
      ente: "Caritas",
      maxPartecipanti: 100,
      immagine: null
    }
  ];
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