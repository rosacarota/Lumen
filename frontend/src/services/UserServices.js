// UserServices.js

const API_BASE_URL = "http://localhost:8080";

function getAuthToken() {
 return localStorage.getItem("token");
}

// ==========================================
// 1. MAPPER
// ==========================================
function mapApiToUser(apiData) {
  const indirizzo = apiData.indirizzo || {};
  return {
    id: apiData.id, // Importante: assicurati che il backend ritorni l'ID
    email: apiData.email,
    nome: apiData.nome,
    cognome: apiData.cognome,
    // Password non la mappiamo in lettura per sicurezza
    descrizione: apiData.descrizione,
    recapitoTelefonico: apiData.recapitoTelefonico,
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
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/account/datiUtente?token=${token}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error(`Errore server fetch: ${response.status}`);
    
    const data = await response.json();
    return mapApiToUser(data);

  } catch (error) {
    console.error("Errore fetchUserProfile:", error);
    throw error;
  }
}

/**
 * SCARICA IL PROFILO PUBBLICO (Di un altro utente/ente tramite ID)
 * Nota: Assumiamo che il backend abbia un endpoint pubblico tipo /account/profilo/{id}
 */
export async function fetchPublicUserData(id) {
    try {
      // Esempio di endpoint. Adatta l'URL in base al tuo Controller Java
      const response = await fetch(`${API_BASE_URL}/account/profilo/${id}`, { 
        method: "GET" 
      });
  
      if (!response.ok) throw new Error(`Errore fetch public user: ${response.status}`);
  
      const data = await response.json();
      return mapApiToUser(data);
  
    } catch (error) {
      console.error("Errore fetchPublicUserData:", error);
      return null;
    }
}

/**
 * AGGIORNA IL PROFILO
 */
export async function updateUserProfile(formData) {
  const token = getAuthToken();
  if (!token) throw new Error("Sessione scaduta.");

  const payload = mapUserToApi(formData);

  try {
    const response = await fetch(`${API_BASE_URL}/account/modificaUtente?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await response.text());
    return true;

  } catch (error) {
    console.error("Errore updateUserProfile:", error);
    throw error;
  }
}