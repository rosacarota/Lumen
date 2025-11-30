const API_BASE_URL = "http://localhost:8080/raccoltaFondi";

function getAuthToken() {
  return localStorage.getItem("token");
}


// Funzione Helper per pulire la data (toglie l'orario T...)
const cleanDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  // Convertiamo in stringa e prendiamo solo la parte prima della T
  return String(dateString).split('T')[0];
};

export async function getRaccolteDiEnte() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/ottieniRaccolteDiEnte?token=${token}`, { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createRaccolta(raccoltaData) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/avviaRaccoltaFondi?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raccoltaData),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
}

// 3. TERMINA RACCOLTA
export async function terminaRaccolta(fullData) {
  const token = getAuthToken();
  const idNumerico = parseInt(fullData.id_raccolta || fullData.id, 10);

  // URL con parametri
  const url = `${API_BASE_URL}/terminaRaccoltaFondi?idRaccolta=${idNumerico}&token=${token}`;

  // PAYLOAD "PESANTE" PER SODDISFARE @VALID
  // 1. Convertiamo i nomi da snake_case (frontend) a camelCase (backend)
  // 2. Puliamo le date
  // 3. Inseriamo l'oggetto Ente
  const payload = {
    id: idNumerico,
    
    titolo: fullData.titolo,
    descrizione: fullData.descrizione,
    
    obiettivo: parseFloat(fullData.obiettivo || 0),
    totaleRaccolto: parseFloat(fullData.totale_raccolto || 0),
    
    // Date pulite (YYYY-MM-DD)
    dataApertura: cleanDate(fullData.data_apertura),
    dataChiusura: cleanDate(fullData.data_chiusura),
    
    stato: "ATTIVA",
    
    // Qui passiamo l'ente che abbiamo ricevuto da ProfiloEnte.jsx
    ente: fullData.enteObj 
  };

  console.log("Termina Raccolta Payload:", payload);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), 
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Errore Backend:", errorText);
    throw new Error(errorText || "Errore terminazione");
  }

  return await res.text();
}