import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import '../stylesheets/DettagliEvento.css';

import { fetchDatiUtente } from '../services/PartecipazioneEventoService';
import { rimuoviEvento } from '../services/EventoService';

export default function DettagliEvento({ 
  evento, 
  onClose,
  onOpenParticipants,
  onModifica,
  onElimina
}) {
  
  const [currentUser, setCurrentUser] = useState(null);

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
    if (onOpenParticipants) {
        onOpenParticipants();
    }
  };

  const handleElimina = async () => {
    const id = evento.idEvento || evento.id_evento || evento.id;
    
    if (window.confirm(`Sei sicuro di voler eliminare definitivamente l'evento "${evento.titolo}"?`)) {
        try {
            await rimuoviEvento(id);
            alert("Evento eliminato con successo.");
            onClose();
            window.location.reload();
        } catch (error) {
            alert("Errore durante l'eliminazione: " + error.message);
        }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // --- LOGICHE DATI ---
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

          {/* --- NUOVO LAYOUT GRIGLIA --- */}
          <div className="modal-grid-info">
            
            {/* DATA INIZIO */}
            <div className="info-item">
              <Calendar className="info-icon" size={20} />
              <div>
                <span className="label">Data Inizio</span>
                <p>{formatDate(evento.data_inizio || evento.dataInizio)}</p>
              </div>
            </div>

            {/* DATA FINE (Nuova) */}
            <div className="info-item">
              <Calendar className="info-icon" size={20} />
              <div>
                <span className="label">Data Fine</span>
                <p>{formatDate(evento.data_fine || evento.dataFine)}</p>
              </div>
            </div>

            {/* LUOGO (Spostato sotto e allargato) */}
            {/* gridColumn: '1 / -1' forza l'elemento a occupare tutta la larghezza */}
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
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
              <span>Max {evento.maxpartecipanti || evento.maxPartecipanti}</span>
            </div>

            <div className="modal-actions">
              {isOwner ? (
                <>
                  <button className="btn-danger" onClick={handleElimina}>
                    <Trash2 size={18} /> Elimina
                  </button>
                  
                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onModifica && onModifica(evento); }}>
                    <Edit size={18}/> Modifica
                  </button>

                  <button className="btn-primary" onClick={handleVediPartecipanti}>
                    Vedi Partecipanti
                  </button>
                </>
              ) : (
                <button className="btn-secondary" onClick={onClose}>Chiudi</button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}