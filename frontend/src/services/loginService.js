import api from '../utils/api';

export const registerUser = async (userPayload) => {
  try {
    return await api.post("/registrazione", userPayload);
  } catch (error) {
    console.error("Errore API Registration:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const sessionUser = await api.post("/login", credentials);
    if (sessionUser && sessionUser.token) {
      localStorage.setItem('token', sessionUser.token);
      localStorage.setItem('ruolo', sessionUser.ruolo);
    }
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

// Funzione opzionale per verificare se l'utente è loggato
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

// Funzione opzionale per ottenere il ruolo dell'utente corrente
export const getUserRole = () => {
  return localStorage.getItem('ruolo');
};