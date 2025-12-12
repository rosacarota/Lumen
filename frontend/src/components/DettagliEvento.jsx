import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
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
  // NUOVO STATO: Per capire se l'immagine è orizzontale
  const [isLandscape, setIsLandscape] = useState(false);

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

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!evento) return null;

  // --- FUNZIONE PER CONTROLLARE LE DIMENSIONI IMMAGINE ---
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    // Se la larghezza è maggiore dell'altezza, è orizzontale (Landscape)
    if (naturalWidth > naturalHeight) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  };

  const handleVediPartecipanti = () => {
    if (onOpenParticipants) {
      onOpenParticipants();
    }
  };

  const handleElimina = async () => {
    const id = evento.idEvento || evento.id_evento || evento.id;

    onClose();

    const result = await Swal.fire({
      title: 'Sei sicuro?',
      text: `Sei sicuro di voler eliminare definitivamente l'evento "${evento.titolo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#087886',
      confirmButtonText: 'Sì, elimina',
      cancelButtonText: 'Annulla'
    });

    if (result.isConfirmed) {
      try {
        await rimuoviEvento(id);
        await Swal.fire({
          icon: 'success',
          title: 'Eliminato',
          text: 'Evento eliminato con successo.',
          confirmButtonColor: '#087886'
        });
        window.location.reload();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Errore',
          text: "Errore durante l'eliminazione: " + error.message,
          confirmButtonColor: '#d33'
        });
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

        {/* IMMAGINE DI COPERTINA */}
        {/* Aggiungiamo una classe dinamica 'landscape-mode' se l'immagine è larga */}
        <div
          className={`modal-top-image ${isLandscape ? 'landscape-mode' : ''}`}
          style={(!isLandscape && evento.immagine) ? { backgroundImage: `url(${evento.immagine})` } : {}}
        >
          {evento.immagine ? (
            <img
              src={evento.immagine}
              alt={evento.titolo}
              className="modal-image"
              onLoad={handleImageLoad} // <--- Trigger per controllare le dimensioni
            />
          ) : (
            <div className="modal-placeholder">
              <ImageIcon size={48} />
              <span>Nessuna Immagine</span>
            </div>
          )}

          <button className="btn-close-absolute" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="modal-ente-badge">
            <span>Organizzato da:</span>
            <strong>{getEnteName()}</strong>
          </div>
        </div>

        {/* CONTENUTO */}
        <div className="modal-content-scrollable">

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
              <Calendar className="info-icon" size={20} />
              <div>
                <span className="label">Data Fine</span>
                <p>{formatDate(evento.data_fine || evento.dataFine)}</p>
              </div>
            </div>

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
                    <Trash2 size={16} /> Elimina
                  </button>

                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onModifica && onModifica(evento); }}>
                    <Edit size={16} /> Modifica
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