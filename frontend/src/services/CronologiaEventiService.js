const API_URL = "http://localhost:8080";

function getAuthToken() {
  return localStorage.getItem("token");
}

export const getCronologiaEventi = async () => {
  try {
    const token = getAuthToken();
    if (!token) return [];
    const url = `${API_URL}/partecipazione/cronologiaPartecipazioni?token=${encodeURIComponent(token)}`;

    const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || 'Errore nel recupero della cronologia eventi');
    }

    const data = await response.json();
    
    return data.map(dto => ({
            id: dto.idEvento,
            titolo: dto.nomeEvento,
            data_inizio: dto.data,
            descrizione: "Dettagli non disponibili in cronologia",
            luogo: "Vedi dettagli",
            immagine: null,
            ente: "Ente Organizzatore"
    }));
  } catch (error) {
    console.error("Errore API Cronologia Eventi:", error);
    return [];
  }
};

export const getEventiFuturi = async () => {
  return await getCronologiaEventi('futuri');
};