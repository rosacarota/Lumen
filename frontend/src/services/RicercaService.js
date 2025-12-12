// src/services/RicercaService.js
import api from '../utils/api';

const RicercaService = {

  async cercaUtenti(query) {
    try {
      if (!query || query.trim() === "") return [];

      // api.get("/ricercaUtente/cerca", { nome: query })
      // Returns JSON. api.js throws if !ok.

      const data = await api.get("/ricercaUtente/cerca", { nome: query });

      // Normalizzazione dei dati per il frontend
      return data.map(user => ({
        // Manteniamo i campi esistenti
        ...user,

        // ID: Se manca l'id, usiamo l'email come chiave univoca temporanea
        id: user.id || user.email,

        // Immagine: Aggiungiamo il prefisso Base64 se necessario
        immagine: user.immagine && !user.immagine.startsWith('http') && !user.immagine.startsWith('data:')
          ? `data:image/jpeg;base64,${user.immagine}`
          : user.immagine,

        // Indirizzo: Il backend manda "objIndirizzo", noi nel frontend usiamo "indirizzo"
        indirizzo: user.objIndirizzo || user.indirizzo || {}
      }));

    } catch (error) {
      console.error("Errore RicercaService:", error);
      // Original rethrew error.
      throw error;
    }
  }
};

export default RicercaService;