import React, { useState, useEffect } from 'react';
// Rimosso useNavigate perché usiamo la prop onOpenParticipants
import { X, Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/DettagliEvento.css';

import { fetchDatiUtente } from '../services/PartecipazioneEventoService';

export default function DettagliEvento({ 
  evento, 
  onClose,
  onOpenParticipants 
}) {
  
  const [currentUser, setCurrentUser] = useState(null);

  // --- 1. RECUPERO UTENTE ---
  useEffect(() => {
    const loadUser = async () => {
      let user = null;
      try {
        user = await fetchDatiUtente();
      } catch (error) { console.warn("API dati utente non disponibile"); }

      if (!user) {
        const emailLocal = localStorage.getItem("userEmail");
        const ruoloLocal = localStorage.getItem("ruolo") || localStorage.getItem("userRole");
        if (emailLocal) user = { email: emailLocal, ruolo: ruoloLocal };
      }
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  if (!evento) return null; 

  const handleVediPartecipanti = () => {
    // Gestione ID sia snake_case che camelCase
    const id = evento.idEvento || evento.id_evento;
    if (onOpenParticipants) {
        onOpenParticipants(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // --- LOGICHE RECUPERO DATI (Con Log di Debug) ---
  const getEnteEmail = () => {
    // Priorità: ente (oggetto) > ente (stringa) > utente (oggetto) > utente (stringa)
    let emailTrovata = "";

    if (evento.ente) {
        if (typeof evento.ente === 'object') emailTrovata = evento.ente.email;
        else emailTrovata = evento.ente;
    } else if (evento.utente) {
        if (typeof evento.utente === 'object') emailTrovata = evento.utente.email;
        else emailTrovata = evento.utente;
    }
    
    return emailTrovata || "";
  };

  const getEnteName = () => {
    if (evento.ente) {
        if (typeof evento.ente === 'string') return evento.ente;
        return evento.ente.nome || evento.ente.email || "Ente Sconosciuto";
    }
    if (evento.utente) {
        if (typeof evento.utente === 'string') return evento.utente;
        return evento.utente.nome || evento.utente.email || "Ente Sconosciuto";
    }
    return "Ente Sconosciuto";
  };

  const getIndirizzoCompleto = () => {
    if (evento.indirizzo && typeof evento.indirizzo === 'object') {
        const { strada, nCivico, citta, provincia } = evento.indirizzo;
        let fullAddress = "";
        if (strada) fullAddress += strada;
        if (nCivico) fullAddress += ` ${nCivico}`;
        if (citta) fullAddress += fullAddress ? `, ${citta}` : citta;
        if (provincia) fullAddress += ` (${provincia})`;
        return fullAddress || "Indirizzo non specificato";
    }
    if (evento.luogo && typeof evento.luogo === 'string') return evento.luogo;
    return "Luogo da definire";
  };

  // --- CONTROLLO PROPRIETARIO ---
  const emailEnteEvento = getEnteEmail();
  const emailUtenteLoggato = currentUser?.email || "";
  const normalize = (str) => str ? str.trim().toLowerCase() : "";

  const isOwner = currentUser && 
                  normalize(currentUser.ruolo) === 'ente' &&
                  normalize(emailEnteEvento) === normalize(emailUtenteLoggato);

  // --- DEBUG DETTAGLIATO ---
  console.group(`🔎 DEBUG MODALE (ID: ${evento.idEvento})`);
  console.log("CHI SONO IO (Browser):", emailUtenteLoggato);
  console.log("CHI HA CREATO L'EVENTO (Evento):", emailEnteEvento);
  console.log("IL MIO RUOLO:", currentUser?.ruolo);
  console.log("MATCH:", isOwner ? "✅ SÌ (Mostro tasto)" : "❌ NO (Nascondo tasto)");
  console.log("DATI GREZZI EVENTO:", evento);
  console.groupEnd();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="btn-close-absolute" onClick={onClose}>
          <X size={24} />
        </button>

        {/* LATO SINISTRO */}
        <div className="modal-left">
          {evento.immagine ? (
            <img src={evento.immagine} alt={evento.titolo} className="modal-image" />
          ) : (
            <div className="modal-placeholder">
              <ImageIcon size={64} color="white" />
              <span>Nessuna Immagine</span>
            </div>
          )}
          
          <div className="modal-ente-badge">
            <span>Organizzato da:</span>
            <strong>{getEnteName()}</strong>
          </div>
        </div>

        {/* LATO DESTRO */}
        <div className="modal-right">
          <div className="modal-header">
            <h2 className="modal-title">{evento.titolo}</h2>
          </div>

          <div className="modal-grid-info">
            <div className="info-item">
              <Calendar className="info-icon" size={20} />
              <div>
                <span className="label">Data Inizio</span>
                <p>{formatDate(evento.data_inizio || evento.dataInizio)}</p>
              </div>
            </div>

            <div className="info-item">
              <MapPin className="info-icon" size={20} />
              <div>
                <span className="label">Luogo</span>
                <p>{getIndirizzoCompleto()}</p>
              </div>
            </div>
          </div>

          <div className="modal-description">
            <h3>Descrizione</h3>
            <p>{evento.descrizione || "Nessuna descrizione disponibile."}</p>
          </div>

          <div className="modal-footer">
            <div className="partecipanti-stat">
              <Users size={18} />
              <span>Max {evento.maxpartecipanti || evento.maxPartecipanti || "Illimitati"} posti</span>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>Chiudi</button>
              
              {isOwner && (
                <button className="btn-primary" onClick={handleVediPartecipanti}>
                  Vedi Partecipanti
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}