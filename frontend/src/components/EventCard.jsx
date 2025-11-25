import React from 'react';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import '../stylesheets/EventCard.css';

export default function EventCard({ 
  id_evento,        // Chiave primaria (utile per link/azioni)
  titolo, 
  descrizione, 
  luogo, 
  data_inizio, 
  data_fine, 
  maxpartecipanti, 
  immagine, 
  ente 
}) {

  // Funzione helper per formattare la data in modo carino
  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    // Opzioni formattazione data (es. 15 ott 2025)
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    // Opzioni formattazione ora (es. 19:00)
    const timeOpts = { hour: '2-digit', minute: '2-digit' };

    const dateStr = s.toLocaleDateString('it-IT', dateOpts);
    const timeStart = s.toLocaleTimeString('it-IT', timeOpts);
    const timeEnd = e.toLocaleTimeString('it-IT', timeOpts);

    return {
      fullDate: dateStr,
      timeRange: `${timeStart} - ${timeEnd}`
    };
  };

  const { fullDate, timeRange } = formatDateRange(data_inizio, data_fine);

  return (
    <div className="event-card" id={`event-${id_evento}`}>
      
      {/* --- HEADER: Avatar (Immagine) + Ente --- */}
      <div className="event-header">
        <div className="event-avatar">
           {immagine ? (
             <img src={immagine} alt={ente} className="event-avatar-img" />
           ) : (
             // Fallback: Iniziale dell'ente se non c'è immagine
             <span>{ente ? ente.charAt(0).toUpperCase() : 'E'}</span>
           )} 
        </div>
        <div className="event-meta">
          <span className="event-brand">{ente || "Ente Sconosciuto"}</span>
          <span className="event-role">Organizzatore</span>
        </div>
      </div>

      {/* --- BODY: Titolo e Descrizione --- */}
      <div className="event-body">
        <h3 className="event-title">{titolo || "Titolo Evento"}</h3>
        
        {/* Mostra la descrizione troncata se troppo lunga */}
        <p className="event-description">
          {descrizione 
            ? (descrizione.length > 60 ? descrizione.substring(0, 60) + '...' : descrizione)
            : "Nessuna descrizione disponibile."}
        </p>
      </div>

      {/* --- DETAILS: Lista con Icone Lucide --- */}
      <div className="event-details">
        
        {/* Data e Ora */}
        <div className="event-detail-row">
          <span className="event-icon"><CalendarDays size={18} /></span>
          <span>{fullDate}</span>
        </div>
        
        <div className="event-detail-row">
          <span className="event-icon"><Clock size={18} /></span>
          <span>{timeRange}</span>
        </div>

        {/* Luogo */}
        <div className="event-detail-row">
          <span className="event-icon"><MapPin size={18} /></span>
          <span>{luogo || "Luogo da definire"}</span>
        </div>

        {/* Max Partecipanti */}
        {maxpartecipanti && (
          <div className="event-detail-row">
            <span className="event-icon"><Users size={18} /></span>
            <span>Max {maxpartecipanti} partecipanti</span>
          </div>
        )}
      </div>
      
      {/* --- FOOTER: Call to Action --- */}
      <button className="event-btn">Dettagli</button>
    </div>
  );
}