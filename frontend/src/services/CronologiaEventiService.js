const API_URL = "http://localhost:8080";

function getAuthToken(){
    return "eyJhbGciOiJIUzI1NiJ9.eyJydW9sbyI6IlZvbG9udGFyaW8iLCJzdWIiOiJlc2VtcGlvQGVtYWlsLmNvbSIsImlhdCI6MTc2NDI3OTg3OSwiZXhwIjoxNzY0ODc5ODc5fQ.rRpqxDLdLYyxaQhRV2lEX52AfedFHLpTq-Be9iL3wXk";
}

export const getCronologiaEventi = async (stato = null) => {
  try {
    const token = getAuthToken();
    
    // Costruisco l'URL di base con il token
    let url = `${API_URL}/evento/cronologiaEventi?token=${token}`;

    // Se c'è lo stato, lo accodo alla stringa con la '&'
    if (stato) {
      url += `&stato=${stato}`;
    }

    // Eseguo la fetch usando la stringa URL costruita
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // Gestione status 204 (No Content) -> Ritorna lista vuota
    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || 'Errore nel recupero della cronologia eventi');
    }

    return await response.json();
  } catch (error) {
    console.error("Errore API Cronologia Eventi:", error);
    throw error;
  }
};