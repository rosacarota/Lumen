
const API_URL = "http://localhost:8080/api"; 

export const registerUser = async (userPayload) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
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
    const response = await fetch(`${API_URL}/login`, {
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