import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../stylesheets/DashboardRichiesteServizio.css'; 
import {
  Check, X, Mail, Phone, Calendar, MapPin, User, Loader2, FileText
} from "lucide-react";

// Importiamo SweetAlert2
import Swal from 'sweetalert2';

// Importiamo le funzioni dal tuo Service
import { 
  getRichiesteServizio, 
  accettaRichiestaServizio, 
  rifiutaRichiestaServizio 
} from "../services/RichiestaServizioService";

export default function DashboardRichiesteServizio() {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- CARICAMENTO DATI ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRichiesteServizio();
        if (Array.isArray(data)) {
          setRichieste(data);
        } else {
          setRichieste([]);
        }
      } catch (err) {
        console.error("Errore componente:", err);
        setError("Impossibile caricare le richieste al momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- GESTIONE TERMINA (ex Accetta) CON SWEETALERT ---
  const handleTermina = async (req) => {
    // 1. Chiediamo conferma
    const result = await Swal.fire({
      title: 'Hai completato il servizio?',
      text: `Confermi di aver risolto la richiesta per ${req.beneficiario?.nome || 'questo utente'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#087886', // Il tuo colore Turchese
      cancelButtonColor: '#6b7280',  // Grigio
      confirmButtonText: 'Sì, termina',
      cancelButtonText: 'Annulla'
    });

    if (result.isConfirmed) {
      try {
        // Mostriamo un caricamento mentre chiamiamo l'API
        Swal.fire({
          title: 'Elaborazione...',
          text: 'Sto chiudendo la richiesta',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Chiamata API (Usiamo la funzione di accettazione per confermare/chiudere)
        await accettaRichiestaServizio(req);
        
        // Aggiorniamo stato locale (Rimuove la card dalla lista)
        setRichieste(prev => prev.filter(r => r.idRichiestaServizio !== req.idRichiestaServizio));

        // Messaggio di successo RICHIESTO
        Swal.fire({
          icon: 'success',
          title: 'Ottimo lavoro!',
          text: 'Complimenti hai risolto la richiesta',
          confirmButtonColor: '#087886',
          timer: 3000 // Si chiude dopo 3 secondi
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Errore',
          text: err.message || "Impossibile completare l'operazione.",
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // --- GESTIONE RIFIUTA CON SWEETALERT ---
  const handleRifiuta = async (req) => {
    // 1. Chiediamo conferma (Stile Warning)
    const result = await Swal.fire({
      title: 'Rifiutare la richiesta?',
      text: "Questa azione non può essere annullata.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rosso pericolo
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sì, rifiuta',
      cancelButtonText: 'Annulla'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Elaborazione...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // Chiamata API
        await rifiutaRichiestaServizio(req);

        // Aggiorniamo stato locale
        setRichieste(prev => prev.filter(r => r.idRichiestaServizio !== req.idRichiestaServizio));

        Swal.fire({
          icon: 'success',
          title: 'Rifiutata',
          text: 'La richiesta è stata rimossa.',
          confirmButtonColor: '#087886',
          timer: 2000
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Errore',
          text: err.message || "Impossibile rifiutare la richiesta.",
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // Helper formattazione data
  const formatDate = (dateString) => {
    if (!dateString) return "Data N/D";
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  return (
    <div className="dash-req-page">
      <Navbar /> 
      
      <div className="dash-req-container">
        {/* HEADER */}
        <div className="dash-req-header">
          <h1>Gestione Richieste Servizio</h1>
          <p>Visualizza e gestisci le richieste di aiuto in arrivo.</p>
        </div>

        {/* AREA SCROLLABILE */}
        <div className="dash-req-scroll-area">
          
          {loading ? (
            <div className="dash-req-loading">
              <Loader2 className="animate-spin" size={40} />
              <p style={{ marginTop: '15px' }}>Caricamento richieste...</p>
            </div>
          ) : error ? (
            <div className="dash-req-empty" style={{ color: '#ef4444' }}>
              <p>{error}</p>
            </div>
          ) : richieste.length === 0 ? (
            <div className="dash-req-empty">
              <p>Nessuna richiesta in attesa.</p>
            </div>
          ) : (
            <div className="dash-req-grid">
              {richieste.map((req) => (
                <div className="req-card" key={req.idRichiestaServizio}>
                  
                  {/* HEADER CARD */}
                  <div className="req-card-header">
                    <div className="req-avatar">
                      <User size={24} />
                    </div>
                    <div className="req-user-info">
                      <h3>{req.beneficiario?.nome} {req.beneficiario?.cognome}</h3>
                      <div className="req-location">
                        <MapPin size={14} />
                        {req.beneficiario?.indirizzo?.citta || "Città N/D"}
                        {req.beneficiario?.indirizzo?.provincia && ` (${req.beneficiario.indirizzo.provincia})`}
                      </div>
                    </div>
                    <div className="req-date-badge">
                       <Calendar size={12} style={{ marginRight: '4px' }}/>
                       {formatDate(req.dataRichiesta)}
                    </div>
                  </div>

                  {/* BODY CARD */}
                  <div className="req-card-body">
                    <div className="req-desc-title">
                      <FileText size={16} /> <span>Dettagli Richiesta</span>
                    </div>
                    <p className="req-text">{req.testo}</p>
                    
                    <div className="req-divider"></div>

                    <div className="req-contacts">
                      <div className="req-contact-item">
                        <Mail size={16} /> 
                        <a href={`mailto:${req.beneficiario?.email}`}>
                          {req.beneficiario?.email || "Email non disponibile"}
                        </a>
                      </div>
                      {req.beneficiario?.recapitoTelefonico && (
                        <div className="req-contact-item">
                          <Phone size={16} /> 
                          <a href={`tel:${req.beneficiario.recapitoTelefonico}`}>
                            {req.beneficiario.recapitoTelefonico}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER CARD */}
                  <div className="req-card-footer">
                     {/* Passiamo l'intero oggetto 'req' alle funzioni */}
                     <button className="btn-reject" onClick={() => handleRifiuta(req)}>
                       <X size={18} /> Rifiuta
                     </button>
                     {/* Bottone modificato in TERMINA */}
                     <button className="btn-accept" onClick={() => handleTermina(req)}>
                       <Check size={18} /> Accetta
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}