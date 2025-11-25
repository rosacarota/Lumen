import React from 'react';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import '../stylesheets/EventCard.css';

export default function EventCard({ 
  id_evento, 
  titolo, 
  descrizione, 
  luogo, 
  data_inizio, 
  data_fine, 
  maxpartecipanti, 
  immagine, 
  ente,
  // NUOVA PROP: Se true, mostra il tasto partecipa. Default è false.
  showParticipate = true,
  isParticipating = false, // Indica se l'utente sta già partecipando all'evento 
}) {

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    const timeOpts = { hour: '2-digit', minute: '2-digit' };

    const dateStr = s.toLocaleDateString('it-IT', dateOpts);
    const timeStart = s.toLocaleTimeString('it-IT', timeOpts);
    const timeEnd = e.toLocaleTimeString('it-IT', timeOpts);

    return { fullDate: dateStr, timeRange: `${timeStart} - ${timeEnd}` };
  };

  const { fullDate, timeRange } = formatDateRange(data_inizio, data_fine);

  // Gestione del click su Partecipa
  const handleParticipate = (e) => {
    e.stopPropagation(); // Evita che il click "passi sotto" alla card (se la card è cliccabile)

    if (isParticipating) {
        alert("Partecipazione annullata.");
    } else {
        alert("Partecipazione confermata!");
    }
    // Qui in futuro metterai la chiamata API al backend
  };

  return (
    <div className="event-card" id={`event-${id_evento}`}>
      
      {/* HEADER */}
      <div className="event-header">
        <div className="event-avatar">
           {immagine ? (
             <img src={immagine} alt={ente} className="event-avatar-img" />
           ) : (
             <span>{ente ? ente.charAt(0).toUpperCase() : 'E'}</span>
           )} 
        </div>
        <div className="event-meta">
          <span className="event-brand">{ente || "Ente Sconosciuto"}</span>
          <span className="event-role">Organizzatore</span>
        </div>
      </div>

      {/* BODY */}
      <div className="event-body">
        <h3 className="event-title">{titolo || "Titolo Evento"}</h3>
        <p className="event-description">
          {descrizione 
            ? (descrizione.length > 60 ? descrizione.substring(0, 60) + '...' : descrizione)
            : "Nessuna descrizione disponibile."}
        </p>
      </div>

      {/* DETAILS */}
      <div className="event-details">
        <div className="event-detail-row">
          <span className="event-icon"><CalendarDays size={18} /></span>
          <span>{fullDate}</span>
        </div>
        <div className="event-detail-row">
          <span className="event-icon"><Clock size={18} /></span>
          <span>{timeRange}</span>
        </div>
        <div className="event-detail-row">
          <span className="event-icon"><MapPin size={18} /></span>
          <span>{luogo || "Luogo da definire"}</span>
        </div>
        {maxpartecipanti && (
          <div className="event-detail-row">
            <span className="event-icon"><Users size={18} /></span>
            <span>Max {maxpartecipanti} partecipanti</span>
          </div>
        )}
      </div>
      
      {/* FOOTER - Qui c'è la logica del doppio tasto */}
      <div className="event-footer">
        {/* Tasto Dettagli (c'è sempre) */}
        <button className="event-btn btn-secondary">Dettagli</button>

        {/* Tasto Partecipa (c'è solo se richiesto) */}
        {showParticipate && (
          <button 
            className="event-btn btn-primary" /* Uso SEMPRE la classe primaria (verde) */
            onClick={handleParticipate}
          >
            {/* Cambio SOLO il testo in base alla variabile */}
            {isParticipating ? "Non partecipare" : "Partecipa"}
          </button>
        )}
      </div>

    </div>
  );
}