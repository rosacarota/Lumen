const API_BASE_URL = "http://localhost:8080/raccoltaFondi";

function getAuthToken() {
  return localStorage.getItem("token");
 }



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

export async function terminaRaccolta(fullData) {
  const token = getAuthToken();
  if (!token) throw new Error("Token non presente o utente non autenticato");

  // Id numerico della raccolta
  const idNumerico = parseInt(fullData.id_raccolta || fullData.id, 10);
  if (isNaN(idNumerico)) throw new Error("ID raccolta non valido");

  // Costruzione URL con query params (come richiesto dal @GetMapping)
  const url = `${API_BASE_URL}/terminaRaccoltaFondi?idRaccolta=${idNumerico}&token=${token}`;

  console.log("Chiamata terminazione raccolta:", url);

  const res = await fetch(url, { method: "GET" });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Errore Backend:", errorText);
    throw new Error(errorText || "Errore durante la terminazione della raccolta");
  }

  return await res.text(); // Es. "Raccolta terminata"
}