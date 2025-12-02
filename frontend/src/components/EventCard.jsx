import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Users, Info, UserPlus, UserCheck, Image as ImageIcon } from 'lucide-react';
import '../stylesheets/EventCard.css';

// Modali
import DettagliEvento from './DettagliEvento';
import VisualizzaPartecipantiEvento from './VisualizzaPartecipantiEvento';

import { 
  iscrivitiEvento, 
  rimuoviIscrizione, 
  checkUserParticipation, 
  fetchDatiUtente 
} from '../services/PartecipazioneEventoService';

export default function EventCard({ event, showParticipate = true }) {
  
  // --- 1. RECUPERO SICURO DELL'ID ---
  // Cerchiamo l'ID in tutti i modi possibili per evitare "undefined"
  const safeId = event.id || event.idEvento || event.id_evento;

  // Destrutturiamo i dati (con fallback ai nomi raw se il mapping non c'è)
  const title = event.title || event.titolo;
  const description = event.description || event.descrizione;
  const location = event.location || (event.indirizzo ? "Vedi dettagli" : event.luogo);
  const startDate = event.startDate || event.dataInizio || event.data_inizio;
  const maxParticipants = event.maxParticipants || event.maxPartecipanti || event.maxpartecipanti;
  const image = event.image || event.immagine;
  
  // Per l'organizzatore usiamo una logica specifica sotto, o quella mappata
  const organizerNameMapped = event.organizerName;

  // --- STATI ---
  const [isParticipating, setIsParticipating] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  // Formattazione data
  const fullDate = startDate 
    ? new Date(startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
    : "Data da definire";

  // --- CALCOLO NOME ORGANIZZATORE (Se non arriva già mappato) ---
  const getOrganizerName = () => {
    if (organizerNameMapped) return organizerNameMapped;

    // Logica di fallback sui dati raw
    if (event.utente) {
        if (typeof event.utente === 'object') return event.utente.nome || event.utente.email || "Ente";
        return event.utente;
    }
    if (event.ente) {
        if (typeof event.ente === 'object') return event.ente.nome || event.ente.email || "Ente";
        return event.ente;
    }
    return "Ente";
  };
  
  const displayOrganizerName = getOrganizerName();

  // --- CONTROLLO INIZIALE ---
  useEffect(() => {
    const initializeCard = async () => {
      let ruoloFinale = "";
      try {
        const datiUtente = await fetchDatiUtente();
        if (datiUtente && datiUtente.ruolo) ruoloFinale = datiUtente.ruolo;
      } catch (e) {}

      if (!ruoloFinale) {
        ruoloFinale = localStorage.getItem("ruolo") || localStorage.getItem("userRole");
      }
      setUserRole(ruoloFinale);

      const isVolontario = ruoloFinale && ruoloFinale.toLowerCase() === "volontario";

      // Usiamo safeId qui
      if (showParticipate && isVolontario && safeId) {
        const status = await checkUserParticipation(safeId);
        setIsParticipating(status.isParticipating);
        setParticipationId(status.idPartecipazione);
      }
    };
    if (safeId) initializeCard();
  }, [safeId, showParticipate]);

  // --- HANDLERS ---
  const handleToggleParticipation = async (e) => {
    e.stopPropagation();
    if (loadingBtn) return;
    setLoadingBtn(true);

    if (!isParticipating) {
      const result = await iscrivitiEvento(safeId); // Usa safeId
      if (result.success) {
        alert("Iscrizione avvenuta con successo!");
        setIsParticipating(true);
        const status = await checkUserParticipation(safeId);
        if (status.idPartecipazione) setParticipationId(status.idPartecipazione);
      } else {
        alert("Errore: " + (result.message || "Impossibile iscriversi"));
      }
    } else {
      let idDaCancellare = participationId;
      if (!idDaCancellare) {
        const status = await checkUserParticipation(safeId);
        if (status.isParticipating) {
            idDaCancellare = status.idPartecipazione;
            setParticipationId(status.idPartecipazione);
        }
      }

      if (!idDaCancellare) {
        alert("Errore tecnico: ID partecipazione non trovato.");
        setLoadingBtn(false);
        return;
      }

      if (window.confirm("Vuoi annullare la partecipazione?")) {
        const result = await rimuoviIscrizione(idDaCancellare);
        if (result.success) {
          alert("Partecipazione annullata.");
          setIsParticipating(false);
          setParticipationId(null);
        } else {
          alert("Errore: " + result.message);
        }
      }
    }
    setLoadingBtn(false);
  };

  // Safe Avatar Letter
  const avatarLetter = (displayOrganizerName || "E").charAt(0).toUpperCase();

  return (
    <>
      <div className="event-card">
        {image ? (
          <img src={image} alt={title} className="event-cover" />
        ) : (
          <div className="event-cover placeholder-cover">
            <ImageIcon size={48} strokeWidth={1} />
          </div>
        )}

        <div className="event-content">
          <div className="event-header">
            <div className="event-avatar">
              <span>{avatarLetter}</span>
            </div>
            <div className="event-meta">
              <span className="event-brand">{displayOrganizerName}</span>
              <span className="event-role">ORGANIZZATORE</span>
            </div>
          </div>

          <div className="event-body">
            <h3 className="event-title">{title}</h3>
            <p className="event-description">
              {description && description.length > 60 
                ? description.substring(0, 60) + "..." 
                : description || "Nessuna descrizione."}
            </p>
          </div>

          <div className="event-details">
            <div className="event-detail-row">
              <span className="event-icon"><CalendarDays size={18} /></span>
              <span>{fullDate}</span>
            </div>
            <div className="event-detail-row">
              <span className="event-icon"><MapPin size={18} /></span>
              <span>{location}</span>
            </div>
            {maxParticipants && (
              <div className="event-detail-row">
                <span className="event-icon"><Users size={18} /></span>
                <span>Max {maxParticipants}</span>
              </div>
            )}
          </div>

          <div className="event-footer">
            <button className="event-btn btn-secondary" onClick={() => setActiveModal('details')}>
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
                  <> <UserCheck size={18} /> Iscritto </>
                ) : (
                  <> <UserPlus size={18} /> Partecipa </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODALI */}
      {activeModal === 'details' && (
        <DettagliEvento 
          // Passiamo event.raw se esiste, altrimenti event
          evento={event.raw || event} 
          onClose={() => setActiveModal(null)}
          onOpenParticipants={() => setActiveModal('participants')}
        />
      )}

      {activeModal === 'participants' && (
        <VisualizzaPartecipantiEvento 
          // QUI USIAMO safeId CHE ORA E' SICURO
          idEvento={safeId}
          onClose={() => setActiveModal(null)}
          onBack={() => setActiveModal('details')} 
        />
      )}
    </>
  );
}