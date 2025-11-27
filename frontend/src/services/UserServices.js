const API_BASE_URL = "http://localhost:8080/account/datiUtente";

function getAuthToken() {
  return localStorage.getItem("eyJhbGciOiJIUzI1NiJ9.eyJydW9sbyI6IlZvbG9udGFyaW8iLCJzdWIiOiJtYXR0ZW8uZGVzdGFzaW8wMEBnbWFpbC5jb20iLCJpYXQiOjE3NjQxOTg2MDgsImV4cCI6MTc2NDc5ODYwOH0.Xhaf_ehWAnzAdtCWTjbI9TPJsptKjIG-nQKKUQiC8I4");
}

// Funzione Decodifica JWT
function parseJwt(token) {
    if (!token) return {};
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Errore decodifica token:", e);
        return {};
    }
}

// === MAPPERS ===
function mapUserFromApi(decodedData, roleFromResponse) {
  return {
    id: decodedData.id || decodedData.sub, 
    email: decodedData.email || decodedData.sub, 
    nome: decodedData.nome || decodedData.name,
    cognome: decodedData.cognome || decodedData.surname,
    descrizione: decodedData.descrizione || decodedData.description,
    
    // Priorità: Ruolo esplicito > Ruolo nel token > Default
    ruolo: roleFromResponse || decodedData.ruolo || decodedData.role || "Ente", 
    
    ambito: decodedData.ambito,
    immagine: decodedData.immagine || decodedData.image,
    recapitoTelefonico: decodedData.telefono || decodedData.recapitoTelefonico,
    strada: decodedData.via || decodedData.strada, 
    ncivico: decodedData.numeroCivico || decodedData.ncivico,
    citta: decodedData.citta,
    provincia: decodedData.provincia,
    cap: decodedData.cap
  };
}

function mapUserUpdateToApi(formData, tokenString) {
  return {
    token: tokenString,
    ruolo: formData.ruolo, 
    nome: formData.nome,
    cognome: formData.cognome,
    descrizione: formData.descrizione,
    ambito: formData.ambito,
    immagine: formData.immagine,
    telefono: formData.recapitoTelefonico,
    via: formData.strada,
    numeroCivico: formData.ncivico,
    citta: formData.citta,
    provincia: formData.provincia,
    cap: formData.cap
  };
}

// === CHIAMATE API ===

// 1. GET standard (Caricamento pagina)
export async function fetchUserProfile() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/account/datiUtente?token=${token}`, { method: "GET" });
  if (!res.ok) throw new Error("Errore fetch profilo");
  
  const data = await res.json();
  if (data.token) {
      return mapUserFromApi(parseJwt(data.token), data.ruolo);
  }
  return {};
}

// 2. POST "Intelligente" per Modifica (Non chiede parametri)
export async function fetchUserForEditing() {
  const token = getAuthToken();
  
  // A. Decodifichiamo il token LOCALE per scoprire chi siamo
  const localTokenData = parseJwt(token);
  
  // B. Recuperiamo il ruolo dal token (o fallback a 'Ente')
  // Nota: Controlla se nel tuo token si chiama 'ruolo', 'role' o 'authority'
  const ruoloRilevato = localTokenData.ruolo || localTokenData.role || "Ente";

  console.log("--> Ruolo rilevato dal token locale:", ruoloRilevato);

  // C. Prepariamo il payload per il server
  const payload = { 
      token: token, 
      ruolo: ruoloRilevato 
  };

  // D. Chiamata al server
  const res = await fetch(`${API_BASE_URL}/account/datiUtente`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Impossibile recuperare i dati per la modifica");
  
  const data = await res.json();

  // E. Restituzione dati mappati
  if (data.token) {
      return mapUserFromApi(parseJwt(data.token), ruoloRilevato);
  } else {
      return mapUserFromApi(data, ruoloRilevato);
  }
}

// 3. Salvataggio
export async function updateUserProfile(formData) {
  const token = getAuthToken();
  const payload = mapUserUpdateToApi(formData, token);
  const res = await fetch(`${API_BASE_URL}/account/modifica`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }
  return true;
}