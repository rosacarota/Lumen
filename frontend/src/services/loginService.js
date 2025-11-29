const API_URL = "http://localhost:8080";

export const registerUser = async (userPayload) => {
  try {
    const response = await fetch(`${API_URL}/registrazione`, {
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
    // Endpoint del nuovo controller di autenticazione
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // In caso di errore, il backend restituisce un JSON con "message"
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Credenziali non valide');
    }

    // Il controller restituisce SessionUser: { token, ruolo }
    const sessionUser = await response.json();
    
    // Salva token e ruolo nel localStorage
    localStorage.setItem('token', sessionUser.token);
    localStorage.setItem('ruolo', sessionUser.ruolo);
    
    console.log('Login effettuato con successo');
    console.log('Token salvato:', sessionUser.token ? 'SI' : 'NO');
    console.log('Ruolo:', sessionUser.ruolo);
    
    // Restituisce l'oggetto completo per eventuali utilizzi
    return sessionUser;
    
  } catch (error) {
    console.error("Errore API Login:", error);
    throw error;
  }
};

// Funzione opzionale per fare il logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('ruolo');
  console.log('Logout effettuato');
};

// Funzione opzionale per verificare se l'utente Ã¨ loggato
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

// Funzione opzionale per ottenere il ruolo dell'utente corrente
export const getUserRole = () => {
  return localStorage.getItem('ruolo');
};