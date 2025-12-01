const API_BASE_URL = "http://localhost:8080";

function getAuthToken() {
  return localStorage.getItem("token");
}

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const addEvento = async (eventoInput) => {
  const token = getAuthToken();
  
  const payload = {
    titolo: eventoInput.titolo,
    descrizione: eventoInput.descrizione,
    dataInizio: eventoInput.dataInizio, // Formato YYYY-MM-DD
    dataFine: eventoInput.dataFine,     // Formato YYYY-MM-DD
    maxPartecipanti: parseInt(eventoInput.maxPartecipanti),
    immagine: eventoInput.immagineBase64 || null, 
    
    // MODIFICA: Mappiamo l'oggetto indirizzo completo
    indirizzo: {
        strada: eventoInput.indirizzo.strada,
        ncivico: eventoInput.indirizzo.ncivico,
        citta: eventoInput.indirizzo.citta,
        provincia: eventoInput.indirizzo.provincia,
        cap: eventoInput.indirizzo.cap
    }
  };

  const response = await fetch(`${API_BASE_URL}/evento/aggiungiEvento?token=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore durante l'aggiunta dell'evento");
  }

  try {
      const text = await response.text();
      return text ? JSON.parse(text) : true;
  } catch (e) {
      return true; 
  }
};