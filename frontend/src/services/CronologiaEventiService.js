const API_URL = "http://localhost:8080";

function getAuthToken(){
    return localStorage.getItem("token");
}

export const getCronologiaEventi = async (stato = null) => {
  try {
    const token = getAuthToken();

    if (!token) return [];
    let url = `${API_URL}/evento/cronologiaEventi?token=${token}`;

    if (stato) {
      url += `&stato=${stato}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

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