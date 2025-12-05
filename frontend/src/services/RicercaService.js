// src/services/RicercaService.js

const API_URL = "http://localhost:8080/ricercaUtente";

const RicercaService = {
  
  async cercaUtenti(query) {
    try {
      if (!query || query.trim() === "") return [];

      const response = await fetch(`${API_URL}/cerca?nome=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 204) return [];
      if (!response.ok) throw new Error(`Errore nella ricerca: ${response.status}`);

      const data = await response.json();
      
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
      throw error;
    }
  }
};

export default RicercaService;