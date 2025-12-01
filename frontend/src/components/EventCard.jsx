import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Users, Info, UserPlus, UserCheck, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/EventCard.css';

import { 
  iscrivitiEvento, 
  rimuoviIscrizione, 
  checkUserParticipation, 
  fetchDatiUtente 
} from '../services/PartecipazioneEventoService';

export default function EventCard({
  id_evento,
  titolo,
  descrizione,
  luogo,
  data_inizio,
  data_fine,
  maxpartecipanti,
  immagine,
  ente, // Questa prop potrebbe arrivare vuota, ci affidiamo a eventData
  
  showParticipate = true,
  eventData, // Qui dentro c'è l'oggetto completo dal backend
  onOpenDetails   
}) {

  const [isParticipating, setIsParticipating] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [userRole, setUserRole] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    const date = new Date(dateString);
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('it-IT', dateOpts);
  };

  const fullDate = formatDate(data_inizio);

  // --- LOGICA PER RECUPERARE IL NOME ENTE ---
  const getOrganizerName = () => {
    // 1. Controlliamo dentro 'eventData.utente' (Struttura attuale del tuo Backend)
    if (eventData && eventData.utente) {
        if (typeof eventData.utente === 'object') {
            // Se c'è il nome, restituiamo quello. Altrimenti l'email.
            return eventData.utente.nome || eventData.utente.email || "Ente Sconosciuto";
        }
        return eventData.utente; // Se è solo una stringa
    }

    // 2. Controlliamo dentro 'eventData.ente' (Caso alternativo)
    if (eventData && eventData.ente) {
        if (typeof eventData.ente === 'object') {
            return eventData.ente.nome || eventData.ente.email || "Ente Sconosciuto";
        }
        return eventData.ente;
    }

    // 3. Fallback sulla prop 'ente' passata direttamente
    if (ente) {
        if (typeof ente === 'object') return ente.nome || ente.email;
        return ente;
    }

    return "Ente Sconosciuto";
  };

  // Calcoliamo il nome da visualizzare (es. "Lumen Organization")
  const organizerName = getOrganizerName();


  // --- CONTROLLO INIZIALE ---
  useEffect(() => {
    const initializeCard = async () => {
      let ruoloFinale = "";

      try {
        const datiUtente = await fetchDatiUtente();
        if (datiUtente && datiUtente.ruolo) {
          ruoloFinale = datiUtente.ruolo;
        }
      } catch (error) { console.warn("Impossibile recuperare dati utente"); }

      if (!ruoloFinale) {
        ruoloFinale = localStorage.getItem("ruolo") || localStorage.getItem("userRole");
      }
      
      setUserRole(ruoloFinale);

      const isVolontario = ruoloFinale && ruoloFinale.toLowerCase() === "volontario";

      if (showParticipate && isVolontario) {
        const status = await checkUserParticipation(id_evento);
        setIsParticipating(status.isParticipating);
        setParticipationId(status.idPartecipazione);
      }
    };

    initializeCard();
  }, [id_evento, showParticipate]);

  // --- HANDLERS ---
  const handleDettagliClick = (e) => {
    e.stopPropagation(); 
    if (onOpenDetails) {
        const eventoPerModale = eventData || {
            idEvento: id_evento, id_evento, 
            titolo, descrizione, luogo, 
            dataInizio: data_inizio, dataFine: data_fine,
            ente, maxPartecipanti: maxpartecipanti, immagine
        };
        onOpenDetails(eventoPerModale);
    }
  };

  const handleToggleParticipation = async (e) => {
    e.stopPropagation();
    if (loadingBtn) return;
    setLoadingBtn(true);

    if (!isParticipating) {
      const result = await iscrivitiEvento(id_evento);
      if (result.success) {
        alert("Iscrizione avvenuta con successo!");
        setIsParticipating(true);
        const status = await checkUserParticipation(id_evento);
        if (status.idPartecipazione) setParticipationId(status.idPartecipazione);
      } else {
        alert("Errore: " + (result.message || "Impossibile iscriversi"));
      }
    } else {
      let idDaCancellare = participationId;
      if (!idDaCancellare) {
        const status = await checkUserParticipation(id_evento);
        if (status.isParticipating && status.idPartecipazione) {
            idDaCancellare = status.idPartecipazione;
            setParticipationId(status.idPartecipazione);
        }
      }

      if (!idDaCancellare) {
        alert("Errore tecnico: ID partecipazione non trovato.");
        setLoadingBtn(false);
        return;
      }

      const conferma = window.confirm("Vuoi davvero annullare la partecipazione?");
      if (conferma) {
        const result = await rimuoviIscrizione(idDaCancellare);
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
              <img src={immagine} alt={organizerName} className="event-avatar-img" />
            ) : (
              // Mostra la prima lettera del nome dell'ente
              <span>{organizerName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="event-meta">
            {/* QUI ORA ESCE IL NOME (es. "Lumen Organization") */}
            <span className="event-brand">{organizerName}</span>
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
          <button className="event-btn btn-secondary" onClick={handleDettagliClick}>
            <Info size={18} />
            Dettagli
          </button>

          {showParticipate && userRole && userRole.toLowerCase() === "volontario" && (
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