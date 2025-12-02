const API_URL = 'http://localhost:8080/affiliazione';
const MOCK = false;

class AffiliazioneService {
  async checkAffiliazione(emailEnte, token) {
    if (MOCK) {
      console.log("[MOCK] checkAffiliazione chiamato");
      return false;
    }

    const params = new URLSearchParams({ emailEnte, token });

    const response = await fetch(`${API_URL}/check?${params}`);
    if (!response.ok) throw new Error("Errore check affiliazione");

    return await response.json(); // boolean
  }

  // INVIA RICHIESTA DI AFFILIAZIONE
  async richiediAffiliazione(descrizione, emailEnte, token) {
    if (MOCK) {
      console.log("[MOCK] richiediAffiliazione:", descrizione, emailEnte);
      return "Richiesta di affiliazione inviata con successo (mock)";
    }

    const params = new URLSearchParams({ token });
    const body = {
      descrizione,
      ente: { email: emailEnte }
    };

    const response = await fetch(`${API_URL}/richiedi?${params}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `Errore nella richiesta: ${response.status}`);
    }

    return text; 
  }

  // RICHIESTE IN ATTESA
  async getRichiesteInAttesa(token) {
    if (MOCK) {
      console.log("[MOCK] getRichiesteInAttesa chiamato");
      return [
        {
          idAffiliazione: 11,
          nome: "Giorgia",
          cognome: "Neri",
          ambito: "Sociale",
          descrizione: "Vorrei collaborare con il vostro Ente",
          immagine: null
        },
        {
          idAffiliazione: 12,
          nome: "Simone",
          cognome: "Russo",
          ambito: "Logistica",
          descrizione: "Disponibile weekend",
          immagine: null
        }
      ];
    }

    const params = new URLSearchParams({ token });
    const response = await fetch(`${API_URL}/richiesteInAttesa?${params}`);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Errore richieste: ${response.status} - ${text}`);
    }

    const raw = await response.json();
    const mapped = raw.map((item) => ({
      idAffiliazione: item.richiesta.idAffiliazione,
      descrizione: item.richiesta.descrizione,
      dataInizio: item.richiesta.dataInizio,
      stato: item.richiesta.stato,
      nome: item.volontario.nome,
      cognome: item.volontario.cognome,
      ambito: item.volontario.ambito,
      immagine: item.volontario.immagine
    }));

    return mapped;
  }

  // ACCETTA AFFILIAZIONE
  async accettaAffiliazione(idAffiliazione, token) {
    if (MOCK) {
      console.log("[MOCK] accettaAffiliazione:", idAffiliazione);
      return "Affiliazione accettata (mock)";
    }

    const params = new URLSearchParams({ idAffiliazione, token });

    const response = await fetch(`${API_URL}/accetta?${params}`, {
      method: "POST"
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || "Errore durante l'accettazione");
    }

    return text;
  }

  // RIFIUTA AFFILIAZIONE
  async rifiutaAffiliazione(idAffiliazione, token) {
    if (MOCK) {
      console.log("[MOCK] rifiutaAffiliazione:", idAffiliazione);
      return "Affiliazione rifiutata (mock)";
    }

    const params = new URLSearchParams({ idAffiliazione, token });

    const response = await fetch(`${API_URL}/rifiuta?${params}`, {
      method: "POST"
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || "Errore durante il rifiuto");
    }

    return text;
  }

  // LISTA AFFILIATI
  async getListaAffiliati(token) {
    if (MOCK) {
      console.log("[MOCK] getListaAffiliati chiamato");
      return [
        {
          nome: "Marco",
          cognome: "Bianchi",
          ambito: "Logistica",
          immagine: null
        },
        {
          nome: "Elena",
          cognome: "Verdi",
          ambito: "Sanitario",
          immagine: null
        }
      ];
    }

    const params = new URLSearchParams({ token });

    const response = await fetch(`${API_URL}/listaAffiliati?${params}`);
    if (!response.ok) {
      throw new Error(`Errore lista affiliati: ${response.status}`);
    }

    return await response.json(); // lista UtenteDTO (nome, cognome, ambito, immagine)
  }
}

export default new AffiliazioneService();
