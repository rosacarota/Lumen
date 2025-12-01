// UserServices.js

// CONFIGURAZIONE BASE
const API_BASE_URL = "http://localhost:8080";

// Funzione di utilità per prendere il token
function getAuthToken() {
 return localStorage.getItem("token");
}

// ==========================================
// 1. MAPPER: DA BACKEND A FRONTEND
// ==========================================
function mapApiToUser(apiData) {
  const indirizzo = apiData.indirizzo || {};

  return {
    email: apiData.email,
    nome: apiData.nome,
    cognome: apiData.cognome,
    password: apiData.password, 
    descrizione: apiData.descrizione,
    recapitoTelefonico: apiData.recapitoTelefonico,
    ruolo: apiData.ruolo,
    ambito: apiData.ambito,
    immagine: apiData.immagine,
    
    // Appiattimento indirizzo
    citta: indirizzo.citta || "",
    provincia: indirizzo.provincia || "",
    cap: indirizzo.cap || "",
    strada: indirizzo.strada || "",
    ncivico: indirizzo.nCivico || "" 
  };
}

// ==========================================
// 2. MAPPER: DA FRONTEND A BACKEND
// ==========================================
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
    immagine: formData.immagine, // Qui c'è la stringa Base64
    indirizzo: indirizzoObj
  };
}

// ==========================================
// CHIAMATE API
// ==========================================

/**
 * SCARICA IL PROFILO (POST con Token nel body)
 */
export async function fetchUserProfile() {
  const token = getAuthToken();

  if (!token) {
    console.warn("Nessun token trovato.");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/account/datiUtente?token=${token}`, {
      method: "GET",
     // headers: {
       // "Content-Type": "application/json"
      //},
      //body: JSON.stringify({ token: token })
    });

    if (!response.ok) {
      throw new Error(`Errore server fetch: ${response.status}`);
    }

    const data = await response.json();
    return mapApiToUser(data);

  } catch (error) {
    console.error("Errore fetchUserProfile:", error);
    throw error;
  }
}

/**
 * AGGIORNA IL PROFILO (POST con Token nell'URL)
 */
export async function updateUserProfile(formData) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Sessione scaduta.");
  }

  const payload = mapUserToApi(formData);

  try {
    const response = await fetch(`${API_BASE_URL}/account/modificaUtente?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Errore salvataggio profilo.");
    }

    return true;

  } catch (error) {
    console.error("Errore updateUserProfile:", error);
    throw error;
  }
}