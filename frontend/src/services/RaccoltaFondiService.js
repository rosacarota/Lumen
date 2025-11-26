
const API_URL = "http://localhost:8080/raccoltaFondi";

export const createRaccolta = async (raccoltaData) => {
  try {
    const response = await fetch(`${API_URL}/avviaRaccoltaFondi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(raccoltaData),
    });

    // Gestione degli errori HTTP
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Errore HTTP: ${response.status}`);
    }

    // Il controller Java restituisce una Stringa semplice e non un JSON.
    const responseData = await response.text();
    return responseData;

  } catch (error) {
    console.error("Errore nel service createRaccolta:", error);
    throw error;
  }
};

