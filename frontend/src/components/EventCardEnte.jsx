import React from 'react';
import { CalendarDays, MapPin, Users, Clock, Edit, Trash2 } from 'lucide-react';
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
  eventData,  // <--- DATI COMPLETI (Passati da ProfiloEnte)
  onModifica, // <--- CALLBACK per aprire il modale
  onElimina   // <--- CALLBACK per eliminare
}) {

  // --- FORMATTAZIONE DATA E ORA ---
  const formatDateRange = (start, end) => {
    if (!start) return { fullDate: "Data da definire", timeRange: "--:--" };

    const s = new Date(start);
    const e = end ? new Date(end) : null;
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    const timeOpts = { hour: '2-digit', minute: '2-digit' };

    const dateStr = s.toLocaleDateString('it-IT', dateOpts);
    const timeStart = s.toLocaleTimeString('it-IT', timeOpts);
    
    let timeRangeStr = timeStart;
    if (e) {
        const timeEnd = e.toLocaleTimeString('it-IT', timeOpts);
        timeRangeStr = `${timeStart} - ${timeEnd}`;
    }

    return { fullDate: dateStr, timeRange: timeRangeStr };
  };

  const { fullDate, timeRange } = formatDateRange(data_inizio, data_fine);

  // --- HANDLER MODIFICA ---
  const handleModifica = (e) => {
    e.stopPropagation(); // Evita di aprire i dettagli generici
    if (onModifica) {
        // Passiamo i dati grezzi al genitore per popolare il form
        onModifica(eventData); 
    }
  };

  // --- HANDLER ELIMINA ---
  const handleElimina = (e) => {
    e.stopPropagation();
    if (onElimina) {
        onElimina(id_evento);
    }
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
          <span className="event-brand">{ente || "Il tuo Ente"}</span>
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
            <span>Max {maxpartecipanti} pax</span>
          </div>
        )}
      </div>
      
      {/* FOOTER - Bottoni Azione */}
      <div className="event-footer">
        <button className="event-btn btn-secondary" onClick={handleModifica}>
            <Edit size={16} style={{marginRight: '5px'}}/> Modifica
        </button>

        <button className="event-btn btn-danger" onClick={handleElimina}>
            <Trash2 size={16} style={{marginRight: '5px'}}/> Elimina
        </button>
      </div>
    </div>
  );
}