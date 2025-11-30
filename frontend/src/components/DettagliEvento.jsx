import React from 'react';
import { useNavigate } from 'react-router-dom';
// Ho rimosso 'Clock' dagli import
import { X, Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/DettagliEvento.css';

export default function DettagliEvento({ evento, onClose }) {
  const navigate = useNavigate();

  if (!evento) return null; 

  // Funzione per andare alla pagina partecipanti
  const handleVediPartecipanti = () => {
    // Gestiamo sia id_evento (snake_case) che idEvento (camelCase)
    const id = evento.id_evento || evento.idEvento;
    navigate(`/partecipanti/${id}`);
  };

  // Formattazione data (Semplificata: Solo Data)
  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Tasto Chiudi */}
        <button className="btn-close-absolute" onClick={onClose}>
          <X size={24} />
        </button>

        {/* --- LATO SINISTRO: IMMAGINE --- */}
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
            <strong>{evento.ente || "Ente Sconosciuto"}</strong>
          </div>
        </div>

        {/* --- LATO DESTRO: CONTENUTO --- */}
        <div className="modal-right">
          <div className="modal-header">
            <h2 className="modal-title">{evento.titolo}</h2>
          </div>

          <div className="modal-grid-info">
            {/* DATA */}
            <div className="info-item">
              <Calendar className="info-icon" size={20} />
              <div>
                <span className="label">Data Inizio</span>
                <p>{formatDate(evento.data_inizio || evento.dataInizio)}</p>
              </div>
            </div>

            {/* LUOGO */}
            <div className="info-item">
              <MapPin className="info-icon" size={20} />
              <div>
                <span className="label">Luogo</span>
                <p>{evento.luogo || "Luogo da definire"}</p>
              </div>
            </div>
            
            {/* HO RIMOSSO IL BLOCCO "ORARI" QUI */}
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
              <button className="btn-primary" onClick={handleVediPartecipanti}>
                Vedi Partecipanti
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}