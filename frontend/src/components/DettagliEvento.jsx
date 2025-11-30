import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/DettagliEvento.css';

// Importiamo il servizio per sapere chi è loggato
import { fetchDatiUtente } from '../services/PartecipazioneEventoService';

export default function DettagliEvento({ evento, onClose }) {
  const navigate = useNavigate();
  
  // Stato per salvare i dati dell'utente loggato
  const [currentUser, setCurrentUser] = useState(null);

  // Al caricamento del modale, recuperiamo l'utente
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchDatiUtente();
        // Se user è null (non loggato), lo stato rimane null
        if (user) setCurrentUser(user);
      } catch (error) {
        console.error("Impossibile recuperare utente corrente");
      }
    };
    loadUser();
  }, []);

  // Se l'evento è nullo, non mostriamo nulla (evita crash)
  if (!evento) return null; 

  const handleVediPartecipanti = () => {
    // Recuperiamo l'ID in modo sicuro
    const id = evento.id_evento || evento.idEvento;
    navigate(`/partecipanti/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // --- LOGICA ROBUSTA PER RECUPERARE L'EMAIL DELL'ENTE ---
  // A volte dal backend arriva l'oggetto Ente, a volte solo la stringa email.
  const getEnteEmail = () => {
    if (!evento.ente) return "";
    if (typeof evento.ente === 'string') return evento.ente; // È solo la stringa email
    return evento.ente.email || ""; // È un oggetto
  };

  // --- LOGICA ROBUSTA PER RECUPERARE IL NOME DELL'ENTE (per visualizzazione) ---
  const getEnteName = () => {
    if (!evento.ente) return "Ente Sconosciuto";
    if (typeof evento.ente === 'string') return evento.ente; 
    return evento.ente.nome || evento.ente.email || "Ente Sconosciuto";
  };

  const emailEnteEvento = getEnteEmail();
  const emailUtenteLoggato = currentUser?.email || "";

  // --- LOGICA DI CONTROLLO PROPRIETARIO ---
  const isOwner = currentUser && 
                  currentUser.ruolo && 
                  currentUser.ruolo.toLowerCase() === 'ente' &&
                  emailEnteEvento &&
                  emailUtenteLoggato &&
                  emailEnteEvento.toLowerCase() === emailUtenteLoggato.toLowerCase();

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
            {/* Usiamo la funzione sicura per il nome */}
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
                <p>{evento.luogo || "Luogo da definire"}</p>
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
              
              {/* MOSTRA IL TASTO SOLO SE SEI IL PROPRIETARIO */}
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