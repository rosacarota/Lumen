import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/DettagliEvento.css';

import { fetchDatiUtente } from '../services/PartecipazioneEventoService';

export default function DettagliEvento({ evento, onClose }) {
  const navigate = useNavigate();
  
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
    const id = evento.id_evento || evento.idEvento;
    navigate(`/partecipanti/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // --- LOGICA ENTE ---
  const getEnteEmail = () => {
    if (evento.ente) {
        if (typeof evento.ente === 'string') return evento.ente;
        return evento.ente.email || "";
    }
    if (evento.utente) {
        if (typeof evento.utente === 'string') return evento.utente;
        return evento.utente.email || "";
    }
    return "";
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

  // --- NUOVA LOGICA INDIRIZZO ---
  const getIndirizzoCompleto = () => {
    // 1. Se il backend manda l'oggetto "indirizzo"
    if (evento.indirizzo && typeof evento.indirizzo === 'object') {
        const { strada, nCivico, citta, provincia } = evento.indirizzo;
        
        // Costruiamo la stringa: "Via Roma 10, Milano (MI)"
        let fullAddress = "";
        
        if (strada) fullAddress += strada;
        if (nCivico) fullAddress += ` ${nCivico}`;
        if (citta) fullAddress += fullAddress ? `, ${citta}` : citta;
        if (provincia) fullAddress += ` (${provincia})`;

        return fullAddress || "Indirizzo non specificato";
    }

    // 2. Fallback: se manda una stringa semplice "luogo"
    if (evento.luogo && typeof evento.luogo === 'string') {
        return evento.luogo;
    }

    return "Luogo da definire";
  };

  // --- CONTROLLO PROPRIETARIO ---
  const emailEnteEvento = getEnteEmail();
  const emailUtenteLoggato = currentUser?.email || "";
  const normalize = (str) => str ? str.trim().toLowerCase() : "";

  const isOwner = currentUser && 
                  normalize(currentUser.ruolo) === 'ente' &&
                  normalize(emailEnteEvento) === normalize(emailUtenteLoggato);

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
                {/* QUI USIAMO LA NUOVA FUNZIONE */}
                <p>{getIndirizzoCompleto()}</p>
              </div>
            </div>
          </div>

          <div className="modal-description">
            <h3>Descrizione</h3>
            <p>{evento.descrizione || "Nessuna descrizione disponibile per questo evento."}</p>
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