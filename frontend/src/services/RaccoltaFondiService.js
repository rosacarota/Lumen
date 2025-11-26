const API_BASE_URL = "http://localhost:8080/raccoltaFondi";


const getAuthToken = () => {
  let token = localStorage.getItem("token");

  if (!token) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        token = userObj.token || userObj.jwt;
      } catch (e) {
        console.error("Errore parsing user per token", e);
      }
    }
  }
  return token;
};


export const createRaccolta = async (raccoltaData) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Autenticazione mancante. Effettua il login.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/avviaRaccoltaFondi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(raccoltaData),
    });

    // Gestione degli errori HTTP 
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Errore server: ${response.status}`);
    }

    // Il controller Java restituisce una Stringa 
    const data = await response.text();
    return data;

  } catch (error) {
    console.error("Errore nel service createRaccolta:", error);
    throw error;
  }
};