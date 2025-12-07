const API_URL = "http://localhost:8080";

const getAuthToken = () => localStorage.getItem("token");

export const creaRichiestaServizio = async (richiestaData) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/richiestaServizio/creaRichiestaServizio?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(richiestaData),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.text();
  } catch (error) {
    console.error("Errore API:", error);
    throw error;
  }
};

export const accettaRichiestaServizio = async (richiestaServizio) => {
  try {
    const response = await fetch(`${API_URL}/richiestaServizio/accettaRichiestaServizio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(richiestaServizio),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.text();
  } catch (error) {
    console.error("Errore API:", error);
    throw error;
  }
};

export const rifiutaRichiestaServizio = async (richiestaServizio) => {
  try {
    const response = await fetch(`${API_URL}/richiestaServizio/rifiutaRichiestaServizio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(richiestaServizio),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.text();
  } catch (error) {
    console.error("Errore API:", error);
    throw error;
  }
};

export const getRichiesteServizio = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/richiestaServizio/getRichiesteServizio?token=${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Errore recupero richieste");
    return await response.json();
  } catch (error) {
    console.error("Errore API:", error);
    return []; // Importante: ritorna array vuoto in caso di errore per evitare crash
  }
};