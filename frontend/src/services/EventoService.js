import api, { getAuthToken } from '../utils/api';

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
    const email = localStorage.getItem("searchEmail");
    if (!email) return [];

    const params = { email };
    if (stato) params.stato = stato;

    const data = await api.get("/evento/cronologiaEventiEnteEsterno", params);
    return data;
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

  try {
    const res = await api.post("/evento/aggiungiEvento", payload);

    if (typeof res === 'string') {
      try { return JSON.parse(res); } catch { return true; }
    }
    return res;
  } catch (error) {
    throw new Error("Errore aggiunta evento: " + error.message);
  }
};

// 3. MODIFICA EVENTO
export const updateEvento = async (eventoModificato) => {
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

  await api.post("/evento/modificaEvento", payload);
  return true;
};

// 4. RIMUOVI EVENTO
export const deleteEvento = async (idEvento) => {
  return rimuoviEvento(idEvento);
};

export const rimuoviEvento = async (idEvento) => {
  const payload = { idEvento: idEvento };
  await api.post("/evento/rimuoviEvento", payload);
  return true;
};