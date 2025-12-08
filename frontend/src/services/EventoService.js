const API_URL = "http://localhost:8080";

// Funzione per recuperare il token (Usa localStorage per la produzione)
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

// 1. GET CRONOLOGIA (Generica)
export const getCronologiaEventi = async (stato = null) => {
  try {
    const token = localStorage.getItem("searchEmail");
    if (!token) return [];
    
    let url = `${API_URL}/evento/cronologiaEventiEnteEsterno?email=${encodeURIComponent(token)}`;
    if (stato) url += `&stato=${stato}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 204 || !response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Errore API Cronologia:", error);
    return [];
  }
};

// --- QUESTA È LA FUNZIONE CHE MANCAVA E CAUSAVA LA PAGINA BIANCA ---
export const getEventiFuturi = async () => {
  return await getCronologiaEventi('futuri');
};
// -------------------------------------------------------------------

// 2. AGGIUNGI EVENTO
export const addEvento = async (eventoInput) => {
  const token = getAuthToken();
  
  const payload = {
    titolo: eventoInput.titolo,
    descrizione: eventoInput.descrizione,
    dataInizio: eventoInput.dataInizio, 
    dataFine: eventoInput.dataFine,     
    maxPartecipanti: parseInt(eventoInput.maxPartecipanti),
    immagine: eventoInput.immagineBase64 || null, 
    indirizzo: {
        strada: eventoInput.indirizzo.strada,
        ncivico: eventoInput.indirizzo.ncivico,
        citta: eventoInput.indirizzo.citta,
        provincia: eventoInput.indirizzo.provincia,
        cap: eventoInput.indirizzo.cap
    }
  };

  const response = await fetch(`${API_URL}/evento/aggiungiEvento?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Errore aggiunta evento");
  try { return JSON.parse(await response.text()); } catch (e) { return true; }
};

// 3. MODIFICA EVENTO
export const updateEvento = async (eventoModificato) => {
  const token = getAuthToken();

  const payload = {
    idEvento: eventoModificato.idEvento, 
    titolo: eventoModificato.titolo,
    descrizione: eventoModificato.descrizione,
    dataInizio: eventoModificato.dataInizio, 
    dataFine: eventoModificato.dataFine,
    maxPartecipanti: parseInt(eventoModificato.maxPartecipanti),
    immagine: eventoModificato.immagineBase64 || null, 
    indirizzo: {
        id: eventoModificato.indirizzo.id || eventoModificato.indirizzo.idIndirizzo,
        strada: eventoModificato.indirizzo.strada,
        nCivico: eventoModificato.indirizzo.ncivico, 
        citta: eventoModificato.indirizzo.citta,
        provincia: eventoModificato.indirizzo.provincia,
        cap: eventoModificato.indirizzo.cap
    }
  };

  const response = await fetch(`${API_URL}/evento/modificaEvento?token=${encodeURIComponent(token)}`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
     const text = await response.text();
     throw new Error(text || "Errore modifica evento");
  }
  return true;
};

// 4. RIMUOVI EVENTO
export const deleteEvento = async (idEvento) => {
    return rimuoviEvento(idEvento);
};

export const rimuoviEvento = async (idEvento) => {
    const token = getAuthToken();
    const payload = { idEvento: idEvento };

    const response = await fetch(`${API_URL}/evento/rimuoviEvento?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Impossibile eliminare l'evento.");
    }
    return true; 
};