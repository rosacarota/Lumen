// src/services/authService.js

// NOTA: Cambia questo URL con quello del tuo backend reale quando sarà pronto
const API_URL = "http://localhost:8080/api"; 

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Prova a leggere il messaggio di errore dal server
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
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenziali non valide');
    }

    return await response.json();
  } catch (error) {
    console.error("Errore API Login:", error);
    throw error;
  }
};