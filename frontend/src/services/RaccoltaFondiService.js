const API_BASE_URL = "http://localhost:8080/raccoltaFondi";

function getAuthToken() {

  return localStorage.getItem("token");
}

export async function getRaccolteDiEnte() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/ottieniRaccolteDiEnte?token=${token}`, { method: "GET" });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Errore nel caricamento delle raccolte fondi");
  }
  const data = await res.json();
  return data;
}

export async function createRaccolta(raccoltaData) {
  const token = getAuthToken();
  console.log("Invio richiesta con token:", token); // Controllo console browser

  const res = await fetch(`${API_BASE_URL}/avviaRaccoltaFondi?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raccoltaData),
  });

  if (!res.ok) {
    // Qui catturiamo l'errore che viene dal backend (es. "Token scaduto" o "Utente non trovato")
    const errorText = await res.text();
    console.error("Errore Backend:", errorText);
    throw new Error(errorText || "Errore durante l'avvio della raccolta fondi");
  }
  
  const data = await res.text();
  return data;
}

export async function terminaRaccolta(raccoltaData) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/terminaRaccoltaFondi?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raccoltaData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Errore durante la chiusura della raccolta fondi");
  }
  const data = await res.text();
  return data;
}