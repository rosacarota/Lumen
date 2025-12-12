import api from '../utils/api';

export const creaRichiestaServizio = async (richiestaData) => {
  try {
    const res = await api.post("/richiestaServizio/creaRichiestaServizio", richiestaData);
    return typeof res === 'object' ? JSON.stringify(res) : res;
  } catch (error) {
    console.error("Errore API:", error);
    throw error;
  }
};

export const accettaRichiestaServizio = async (richiestaServizio) => {
  try {
    const res = await api.post("/richiestaServizio/accettaRichiestaServizio", richiestaServizio);
    return typeof res === 'object' ? JSON.stringify(res) : res;
  } catch (error) {
    console.error("Errore API:", error);
    throw error;
  }
};

export const rifiutaRichiestaServizio = async (richiestaServizio) => {
  try {
    const res = await api.post("/richiestaServizio/rifiutaRichiestaServizio", richiestaServizio);
    return typeof res === 'object' ? JSON.stringify(res) : res;
  } catch (error) {
    console.error("Errore API:", error);
    throw error;
  }
};

export const getRichiesteServizio = async () => {
  try {
    const data = await api.get("/richiestaServizio/getRichiestaInAttesa");
    return data;
  } catch (error) {
    console.error("Errore API:", error);
    return []; // Importante: ritorna array vuoto in caso di errore per evitare crash
  }
};