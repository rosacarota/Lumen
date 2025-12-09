// UserServices.js
import api from '../utils/api';

// ==========================================
// 1. MAPPER
// ==========================================
function mapApiToUser(apiData) {
  const indirizzo = apiData.indirizzo || apiData.objIndirizzo || {};
  return {
    email: apiData.email,
    nome: apiData.nome,
    cognome: apiData.cognome,
    descrizione: apiData.descrizione,
    recapitoTelefonico: apiData.recapitoTelefonico || apiData.telefono || apiData.numeroTelefonico || apiData.cellulare,
    ruolo: apiData.ruolo,
    ambito: apiData.ambito,
    immagine: apiData.immagine,
    citta: indirizzo.citta || "",
    provincia: indirizzo.provincia || "",
    cap: indirizzo.cap || "",
    strada: indirizzo.strada || "",
    ncivico: indirizzo.nCivico || ""
  };
}

function mapUserToApi(formData) {
  const indirizzoObj = {
    citta: formData.citta,
    provincia: formData.provincia,
    cap: formData.cap,
    strada: formData.strada,
    nCivico: formData.ncivico
  };
  return {
    email: formData.email,
    nome: formData.nome,
    cognome: formData.cognome,
    password: formData.password,
    descrizione: formData.descrizione,
    recapitoTelefonico: formData.recapitoTelefonico,
    ruolo: formData.ruolo,
    ambito: formData.ambito,
    immagine: formData.immagine,
    indirizzo: indirizzoObj
  };
}

// ==========================================
// CHIAMATE API
// ==========================================

/**
 * SCARICA IL PROFILO PRIVATO (Utente Loggato)
 */
export async function fetchUserProfile() {
  try {
    const data = await api.get("/account/datiUtente");
    return mapApiToUser(data);
  } catch (error) {
    console.error("Errore fetchUserProfile:", error);
    throw error;
  }
}


export async function fetchUserPublicProfile(email) {
  try {
    const data = await api.post("/ricercaUtente/datiUtente", { email });
    return mapApiToUser(data);

  } catch (error) {
    console.error("Errore fetchUserPublicProfile:", error);
    throw error;
  }
}

export async function updateUserProfile(formData) {
  const payload = mapUserToApi(formData);

  try {
    await api.post("/account/modificaUtente", payload);
    return true;
  } catch (error) {
    console.error("Errore updateUserProfile:", error);
    throw error;
  }
}