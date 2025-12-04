const API_URL = "http://localhost:8080";

function getAuthToken() {
  return localStorage.getItem("token");
}

// Funzione generica: recupera cronologia completa o filtrata per stato
export const getCronologiaEventi = async (stato = null) => {
  try {
    const token = getAuthToken();

    if (!token) return [];

    // Costruzione dell'URL base con il token
    let url = `${API_URL}/evento/cronologiaEventi?token=${token}`;

    // Se viene passato un parametro stato (es. 'futuri'), lo aggiunge all'URL
    if (stato) {
      url += `&stato=${stato}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    // 204 No Content: ritorna array vuoto senza errori
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
    return [];
  }
};

// Funzione specifica per gli eventi futuri
// Richiama la funzione principale passando lo stato 'futuri'
export const getEventiFuturi = async () => {
  return await getCronologiaEventi('futuri');
};