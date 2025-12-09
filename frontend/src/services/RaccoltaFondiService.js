import api from '../utils/api';

export async function getRaccolteDiEnteEsterno(email) {
  // api.get("/raccoltaFondi/ottieniRaccolteDiEnteEsterno?email=...") auto-appends token if present
  const data = await api.get("/raccoltaFondi/ottieniRaccolteDiEnteEsterno", { email });
  return data;
}

export async function getRaccolteDiEnte() {
  const data = await api.get("/raccoltaFondi/ottieniRaccolteDiEnte");
  return data;
}

export async function createRaccolta(raccoltaData) {
  // api.post auto-appends token
  // returns json or text. Original returned text.
  const res = await api.post("/raccoltaFondi/avviaRaccoltaFondi", raccoltaData);
  // Post usually returns text here.
  return typeof res === 'object' ? JSON.stringify(res) : res;
}

export async function terminaRaccolta(fullData) {
  // Id numerico della raccolta
  const idNumerico = parseInt(fullData.id_raccolta || fullData.id, 10);
  if (isNaN(idNumerico)) throw new Error("ID raccolta non valido");

  // This is a GET request in original code:
  // `${API_BASE_URL}/terminaRaccoltaFondi?idRaccolta=${idNumerico}&token=${token}`

  const res = await api.get("/raccoltaFondi/terminaRaccoltaFondi", { idRaccolta: idNumerico });
  return typeof res === 'object' ? JSON.stringify(res) : res;
}