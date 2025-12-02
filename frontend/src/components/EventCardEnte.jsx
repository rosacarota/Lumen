import React from 'react';
import { CalendarDays, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import '../stylesheets/EventCardEnte.css';

export default function EventCardEnte({ 
  id_evento, 
  titolo, 
  descrizione, 
  luogo, 
  data_inizio, 
  data_fine, 
  maxpartecipanti, 
  immagine, 
  ente,
  eventData,  // Dati completi per la modifica
  onModifica, 
  onElimina   
}) {

  // Formattazione Date
  const formatDateRange = (start, end) => {
    if (!start) return "Data da definire";
    const safeStart = start.split('T')[0];
    const safeEnd = end ? end.split('T')[0] : null;

    const s = new Date(safeStart);
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = s.toLocaleDateString('it-IT', dateOpts);

    if (safeEnd && safeStart !== safeEnd) {
        const e = new Date(safeEnd);
        const dateEndStr = e.toLocaleDateString('it-IT', dateOpts);
        return `${dateStr} - ${dateEndStr}`;
    }
    return dateStr;
  };

  const fullDate = formatDateRange(data_inizio, data_fine);

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
          <span className="event-brand">{ente || "Ente"}</span>
          <span className="event-role">Gestione</span>
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
          <span className="event-icon"><MapPin size={18} /></span>
          <span>{luogo || "Luogo da definire"}</span>
        </div>
        {maxpartecipanti && (
          <div className="event-detail-row">
            <span className="event-icon"><Users size={18} /></span>
            <span>Max {maxpartecipanti} pax</span>
          </div>
        )}
      </div>
      
      {/* FOOTER - Bottoni Azione */}
      <div className="event-footer">
        <button className="event-btn btn-secondary" onClick={(e) => { e.stopPropagation(); onModifica(eventData); }}>
            <Edit size={16} style={{marginRight: '5px'}}/> Modifica
        </button>

        <button className="event-btn btn-danger" onClick={(e) => { e.stopPropagation(); onElimina(id_evento); }}>
            <Trash2 size={16} style={{marginRight: '5px'}}/> Elimina
        </button>
      </div>
    </div>
  );
}