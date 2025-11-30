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
  ente,
  showParticipate = true,
  eventData,      
  onOpenDetails   
}) {

  const [isParticipating, setIsParticipating] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Formattazione data
  const formatDate = (dateString) => {
    if (!dateString) return "Data da definire";
    const date = new Date(dateString);
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('it-IT', dateOpts);
  };

  const fullDate = formatDate(data_inizio);

  // --- CONTROLLO INIZIALE (Ruolo + Partecipazione) ---
 // --- CONTROLLO INIZIALE (RUOLO + PARTECIPAZIONE) ---
  useEffect(() => {
    // AGGIUNGI LA PAROLA 'async' QUI SOTTO vvv
    const initializeCard = async () => {
      
      let ruoloFinale = "";

      try {
        const datiUtente = await fetchDatiUtente();
        if (datiUtente && datiUtente.ruolo) {
          ruoloFinale = datiUtente.ruolo;
        }
      } catch (error) {
        console.warn("Impossibile recuperare dati utente dal server");
      }

      if (!ruoloFinale) {
        ruoloFinale = localStorage.getItem("ruolo") || localStorage.getItem("userRole");
      }
      
      setUserRole(ruoloFinale);

      const isVolontario = ruoloFinale && ruoloFinale.toLowerCase() === "volontario";

      if (showParticipate && isVolontario) {
        // Ora 'await' funzionerà perché la funzione initializeCard è 'async'
        const status = await checkUserParticipation(id_evento);
        setIsParticipating(status.isParticipating);
        setParticipationId(status.idPartecipazione);
      }
    };

    initializeCard();
  }, [id_evento, showParticipate]);

  // --- APERTURA DETTAGLI ---
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

  // --- GESTIONE ISCRIZIONE / CANCELLAZIONE (CON FIX ID) ---
  const handleToggleParticipation = async (e) => {
    e.stopPropagation();
    if (loadingBtn) return;
    setLoadingBtn(true);

    if (!isParticipating) {
      // CASO 1: ISCRIZIONE
      const result = await iscrivitiEvento(id_evento);
      
      if (result.success) {
        alert("Iscrizione avvenuta con successo!");
        setIsParticipating(true);
        // Recuperiamo subito l'ID della nuova partecipazione
        const status = await checkUserParticipation(id_evento);
        if (status.idPartecipazione) setParticipationId(status.idPartecipazione);
      } else {
        alert("Errore: " + (result.message || "Impossibile iscriversi"));
      }

    } else {
      // CASO 2: CANCELLAZIONE (Logica "Smart")
      let idDaCancellare = participationId;

      // Se l'ID manca, proviamo a recuperarlo ADESSO
      if (!idDaCancellare) {
        console.log("ID mancante, tentativo di recupero al volo...");
        const status = await checkUserParticipation(id_evento);
        if (status.isParticipating && status.idPartecipazione) {
            idDaCancellare = status.idPartecipazione;
            setParticipationId(status.idPartecipazione); // Lo salviamo anche nello stato
        }
      }

      // Se ancora non lo abbiamo, non possiamo fare nulla
      if (!idDaCancellare) {
        alert("Errore tecnico: Impossibile recuperare i dati della tua iscrizione. Ricarica la pagina.");
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