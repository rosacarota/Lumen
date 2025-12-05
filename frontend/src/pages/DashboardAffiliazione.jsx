import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../stylesheets/DashboardAffiliazione.css";
import {
  Trash2,
  Search,
  MapPin,
  Briefcase,
  User,
  Loader2,
  Check,
  Clock
} from "lucide-react";
import AffiliazioneService from "../services/AffiliazioneService";
import { useNavigate } from "react-router-dom";

export default function DashboardAffiliazione() {
  const [volontari, setVolontari] = useState([]);
  const [richieste, setRichieste] = useState([]);

  const [loadingAffiliati, setLoadingAffiliati] = useState(true);
  const [loadingRichieste, setLoadingRichieste] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [errorAffiliati, setErrorAffiliati] = useState(null);
  const [errorRichieste, setErrorRichieste] = useState(null);

  const [activeTab, setActiveTab] = useState("affiliati");

  const navigate = useNavigate();

  // CARICA AFFILIATI 
  const loadAffiliati = async () => {
    setLoadingAffiliati(true);
    setErrorAffiliati(null);

    try {
      const token = localStorage.getItem("token");
      const data = await AffiliazioneService.getListaAffiliati(token);
      setVolontari(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorAffiliati("Impossibile caricare i volontari affiliati.");
    } finally {
      setLoadingAffiliati(false);
    }
  };

  // CARICA RICHIESTE 
  const loadRichieste = async () => {
    setLoadingRichieste(true);
    setErrorRichieste(null);

    try {
      const token = localStorage.getItem("token");
      const data = await AffiliazioneService.getRichiesteInAttesa(token);
      // data = [
      //   { idAffiliazione, descrizione, dataInizio, stato, nome, cognome, ambito, immagine }
      // ]
      setRichieste(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorRichieste("Impossibile caricare le richieste in attesa.");
    } finally {
      setLoadingRichieste(false);
    }
  };

  useEffect(() => {
    loadAffiliati();
    loadRichieste();
  }, [navigate]);

  // RIMUOVI AFFILIATO
  const handleRemove = async (idAffiliazione) => {
    if (!window.confirm("Confermi la rimozione?")) return;

    try {
      const token = localStorage.getItem("token");
      await AffiliazioneService.rifiutaAffiliazione(idAffiliazione, token);

      setVolontari(prev =>
        prev.filter(v => v.idAffiliazione !== idAffiliazione)
      );
    } catch (err) {
      alert("Errore durante la rimozione: " + err.message);
    }
  };

  // ACCETTA 
  const handleAccettaRichiesta = async (idAffiliazione) => {
    if (!window.confirm("Confermi l’accettazione?")) return;

    try {
      const token = localStorage.getItem("token");
      await AffiliazioneService.accettaAffiliazione(idAffiliazione, token);

      // rimuovo dalla lista richieste
      setRichieste(prev =>
        prev.filter(r => r.idAffiliazione !== idAffiliazione)
      );

      // ricarico gli affiliati aggiornati
      loadAffiliati();
    } catch (err) {
      alert("Errore durante l'accettazione: " + err.message);
    }
  };

  // RIFIUTA 
  const handleRifiutaRichiesta = async (idAffiliazione) => {
    if (!window.confirm("Confermi il rifiuto?")) return;

    try {
      const token = localStorage.getItem("token");
      await AffiliazioneService.rifiutaAffiliazione(idAffiliazione, token);

      // rimuovo dalla lista richieste
      setRichieste(prev =>
        prev.filter(r => r.idAffiliazione !== idAffiliazione)
      );
    } catch (err) {
      alert("Errore durante il rifiuto: " + err.message);
    }
  };

  // FILTRO AFFILIATI
  const filteredVolontari = volontari.filter(v =>
    `${v.nome} ${v.cognome}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // RICHIESTE ORDINATE 
  const richiesteOrdinate = [...richieste].sort((a, b) => {
    const d1 = a.dataInizio ? new Date(a.dataInizio) : new Date(0);
    const d2 = b.dataInizio ? new Date(b.dataInizio) : new Date(0);
    return d2 - d1; // più recenti prima
  });

  // ULTIME 2 PER SIDEBAR 
  const ultimeRichieste = richiesteOrdinate.slice(0, 2);

  return (
    <div className="dashaff-page">
      <Navbar />

      <div className="dashaff-container">

        {/* HEADER */}
        <div className="dashaff-header">
          <h1>Gestione Affiliazioni</h1>

          <div className="dashaff-tabs">
            <button
              className={activeTab === "affiliati" ? "active" : ""}
              onClick={() => setActiveTab("affiliati")}
            >
              Affiliati
            </button>
            <button
              className={activeTab === "richieste" ? "active" : ""}
              onClick={() => setActiveTab("richieste")}
            >
              Richieste in attesa
            </button>
          </div>
        </div>

        <div className="dashaff-layout">
          {/* SINISTRA  */}
          <div className="dashaff-left">

            {/* Barra ricerca affiliati */}
            {activeTab === "affiliati" && (
              <div className="dashaff-search">
                <Search size={20} color="#087886" />
                <input
                  type="text"
                  placeholder="Cerca volontario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            {/* LISTA AFFILIATI  */}
            {activeTab === "affiliati" && (
              <>
                {loadingAffiliati ? (
                  <div className="dashaff-loading">
                    <Loader2 className="animate-spin" size={40} />
                  </div>
                ) : (
                  <div className="dashaff-list">
                    {filteredVolontari.map(v => (
                      <div className="dashaff-card" key={v.idAffiliazione}>
                        <div className="dashaff-avatar">
                          {v.immagine ? (
                            <img src={v.immagine} alt="" />
                          ) : (
                            <User size={24} color="#087886" />
                          )}
                        </div>

                        <div className="dashaff-info">
                          <h3>{v.nome} {v.cognome}</h3>
                          <div className="dashaff-badges">
                            {v.ambito && (
                              <span><Briefcase size={14}/> {v.ambito}</span>
                            )}
                            {v.citta && (
                              <span className="gray"><MapPin size={14}/> {v.citta}</span>
                            )}
                          </div>
                        </div>

                        <button
                          className="dashaff-remove"
                          onClick={() => handleRemove(v.idAffiliazione)}
                        >
                          <Trash2 size={16}/> Rimuovi
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* LISTA RICHIESTE*/}
            {activeTab === "richieste" && (
              <>
                {loadingRichieste ? (
                  <div className="dashaff-loading">
                    <Loader2 className="animate-spin" size={40}/>
                  </div>
                ) : errorRichieste ? (
                  <div className="dashaff-error">{errorRichieste}</div>
                ) : (
                  <div className="dashaff-list">
                    {richiesteOrdinate.map(r => (
                      <div className="dashaff-card" key={r.idAffiliazione}>
                        <div className="dashaff-avatar">
                          {r.immagine ? (
                            <img src={r.immagine} alt="" />
                          ) : (
                            <User size={24} color="#087886"/>
                          )}
                        </div>

                        <div className="dashaff-info">
                          <h3>{r.nome} {r.cognome}</h3>
                          <p className="dashaff-desc">{r.descrizione}</p>
                          {r.ambito && (
                            <div className="dashaff-badges">
                              <span><Briefcase size={14}/> {r.ambito}</span>
                            </div>
                          )}
                        </div>

                        <div className="dashaff-actions">
                          <button
                            className="dashaff-accept"
                            onClick={() => handleAccettaRichiesta(r.idAffiliazione)}
                          >
                            <Check size={16}/> Accetta
                          </button>

                          <button
                            className="dashaff-remove"
                            onClick={() => handleRifiutaRichiesta(r.idAffiliazione)}
                          >
                            <Trash2 size={16}/> Rifiuta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

          {/*SIDEBAR ULTIME RICHIESTE */}
          <div className="dashaff-right">
            <div className="dashaff-sidebar">
              <h3>Ultime richieste</h3>
              <p className="subtitle">Le richieste di affiliazione più recenti.</p>

              {loadingRichieste ? (
                <div className="dashaff-loading small">
                  <Loader2 className="animate-spin" size={30}/>
                </div>
              ) : ultimeRichieste.length > 0 ? (
                <div className="dashaff-sidebar-list">
                  {ultimeRichieste.map(r => (
                    <div className="dashaff-sidebar-item" key={r.idAffiliazione}>
                      <div className="dashaff-sidebar-avatar">
                        {r.immagine ? (
                          <img src={r.immagine} alt="" />
                        ) : (
                          <User size={18} color="#087886"/>
                        )}
                      </div>

                      <div className="dashaff-sidebar-info">
                        <strong>{r.nome} {r.cognome}</strong>
                        <div className="dashaff-sidebar-meta">
                          <Clock size={12}/> In attesa
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nessuna richiesta recente.</p>
              )}

              <button
                className="dashaff-sidebar-btn"
                onClick={() => setActiveTab("richieste")}
              >
                Gestisci tutte
              </button>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
