// src/services/loginService.js

// ATTENZIONE: Se il tuo controller è su "localhost:8080/login", 
// l'API_URL deve essere la radice, senza "/api" se non l'hai configurato in Spring.
// Modificalo se necessario.
const API_URL = "http://localhost:8080"; 

export const registerUser = async (userPayload) => {
  try {
    // La registrazione di solito non richiede sessione, ma possiamo lasciarla standard
    const response = await fetch(`${API_URL}/registrazione`, { // Adatta questo path al tuo RegisterControl
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Errore nella registrazione');
    }
    return await response.json();
  } catch (error) {
    console.error("Errore API Registration:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    // NOTA: L'endpoint nel tuo controller è "/login"
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // <--- FONDAMENTALE: Abilita i cookie per HttpSession
    });

    if (!response.ok) {
        // Il backend restituisce stringhe in caso di errore (es. "Utente non trovato")
        // o JSON in caso di validazione. Proviamo a leggere come testo prima.
        const errorText = await response.text();
        throw new Error(errorText || 'Credenziali non valide');
    }

    // Il tuo controller restituisce una stringa: "Accesso con successo"
    // NON usare response.json() qui perché spacca tutto se non è un oggetto JSON.
    return await response.text(); 
  } catch (error) {
    console.error("Errore API Login:", error);
    throw error;
  }
};