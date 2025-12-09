import api from '../utils/api';

const MOCK = false;

class AffiliazioneService {
  async checkAffiliazione(emailEnte, token) {
    if (MOCK) {
      console.log("[MOCK] checkAffiliazione chiamato");
      return false;
    }


    return await api.get("/affiliazione/check", { emailEnte });
  }

  // INVIA RICHIESTA DI AFFILIAZIONE
  async richiediAffiliazione(descrizione, emailEnte, token) {
    if (MOCK) {
      console.log("[MOCK] richiediAffiliazione:", descrizione, emailEnte);
      return "Richiesta di affiliazione inviata con successo (mock)";
    }

    const body = {
      descrizione,
      ente: { email: emailEnte }
    };

    const res = await api.post("/affiliazione/richiedi", body);
    return typeof res === 'object' ? JSON.stringify(res) : res;
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

    const raw = await api.get("/affiliazione/richiesteInAttesa");

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

    const res = await api.get("/affiliazione/accetta", { idAffiliazione });
    return typeof res === 'object' ? JSON.stringify(res) : res;
  }

  // RIFIUTA AFFILIAZIONE
  async rifiutaAffiliazione(idAffiliazione, token) {
    if (MOCK) {
      console.log("[MOCK] rifiutaAffiliazione:", idAffiliazione);
      return "Affiliazione rifiutata (mock)";
    }

    const res = await api.get("/affiliazione/rifiuta", { idAffiliazione });
    return typeof res === 'object' ? JSON.stringify(res) : res;
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

    return await api.get("/affiliazione/listaAffiliati");
  }
}

export default new AffiliazioneService();
