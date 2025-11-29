import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Users, Clock, Info, UserPlus, UserCheck, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/EventCard.css';

// Importiamo i servizi aggiornati
import { iscrivitiEvento, rimuoviIscrizione, checkUserParticipation } from '../services/PartecipazioneEventiService';

export default function EventCard({
  id_evento,  // IMPORTANTE: Assicurati che dal backend arrivi come "idEvento" o "id_evento"
  titolo,
  descrizione,
  luogo,
  data_inizio,
  data_fine,
  maxpartecipanti,
  immagine,
  ente,
  showParticipate = true
}) {

  // Stati locali
  const [isParticipating, setIsParticipating] = useState(false);
  const [participationId, setParticipationId] = useState(null); // Serve per la cancellazione
  const [loadingBtn, setLoadingBtn] = useState(false);

  // Formattazione Date (rimasta uguale)
  const formatDateRange = (start, end) => {
    if (!start || !end) return { fullDate: "Data da definire", timeRange: "--:--" };
    const s = new Date(start);
    const e = new Date(end);
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    const timeOpts = { hour: '2-digit', minute: '2-digit' };
    return {
      fullDate: s.toLocaleDateString('it-IT', dateOpts),
      timeRange: `${s.toLocaleTimeString('it-IT', timeOpts)} - ${e.toLocaleTimeString('it-IT', timeOpts)}`
    };
  };

  const { fullDate, timeRange } = formatDateRange(data_inizio, data_fine);

  // --- CONTROLLO INIZIALE ---
  // Appena appare la card, controlliamo se l'utente è già iscritto
  useEffect(() => {
    const checkStatus = async () => {
      if (showParticipate) {
        const status = await checkUserParticipation(id_evento);
        setIsParticipating(status.isParticipating);
        setParticipationId(status.idPartecipazione);
      }
    };
    checkStatus();
  }, [id_evento, showParticipate]);


  // --- GESTIONE CLICK ---
  const handleToggleParticipation = async (e) => {
    e.stopPropagation();
    if (loadingBtn) return;
    setLoadingBtn(true);

    if (!isParticipating) {
      // --- CASO 1: VOGLIO ISCRIVERMI ---
      const result = await iscrivitiEvento(id_evento);

      if (result.success) {
        alert("Iscrizione avvenuta con successo!");
        setIsParticipating(true);
        // Ricarichiamo lo stato per ottenere il nuovo ID partecipazione
        const status = await checkUserParticipation(id_evento);
        setParticipationId(status.idPartecipazione);
      } else {
        alert("Errore: " + (result.message || "Impossibile iscriversi"));
      }

    } else {
      // --- CASO 2: VOGLIO CANCELLARMI ---
      if (!participationId) {
        alert("Errore: ID partecipazione mancante.");
        setLoadingBtn(false);
        return;
      }

      const conferma = window.confirm("Vuoi davvero annullare la partecipazione?");
      if (conferma) {
        const result = await rimuoviIscrizione(participationId);

        if (result.success) {
          alert("Partecipazione annullata.");
          setIsParticipating(false);
          setParticipationId(null);
        } else {
          alert("Errore: " + (result.message || "Impossibile annullare"));
        }
      }
    }

    setLoadingBtn(false);
  };

  return (
    <div className="event-card" id={`event-${id_evento}`}>

      {immagine ? (
        <img src={immagine} alt={titolo} className="event-cover" />
      ) : (
        <div className="event-cover placeholder-cover">
          <ImageIcon size={48} strokeWidth={1} />
        </div>
      )}

      <div className="event-content">
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

        <div className="event-body">
          <h3 className="event-title">{titolo || "Titolo Evento"}</h3>
          <p className="event-description">
            {descrizione
              ? (descrizione.length > 60 ? descrizione.substring(0, 60) + '...' : descrizione)
              : "Nessuna descrizione disponibile."}
          </p>
        </div>

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

        <div className="event-footer">
          <button className="event-btn btn-secondary">
            <Info size={18} />
            Dettagli
          </button>

          {showParticipate && (
            <button
              className={`event-btn btn-primary ${isParticipating ? 'btn-active' : ''}`}
              onClick={handleToggleParticipation}
              disabled={loadingBtn}
              style={{ opacity: loadingBtn ? 0.7 : 1 }}
            >
              {loadingBtn ? "..." : isParticipating ? (
                <>
                  <UserCheck size={18} />
                  Iscritto
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Partecipa
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}