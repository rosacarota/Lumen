import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Users, Info, UserPlus, UserCheck, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2'; // <--- IMPORTANTE
import '../stylesheets/EventCard.css';

// --- IMPORT DEI 3 MODALI ---
import DettagliEvento from './DettagliEvento';
import VisualizzaPartecipantiEvento from './VisualizzaPartecipantiEvento';
import ModifyEvento from './ModifyEvento'; 

import { 
  iscrivitiEvento, 
  rimuoviIscrizione, 
  checkUserParticipation, 
  fetchDatiUtente 
} from '../services/PartecipazioneEventoService';

import { rimuoviEvento } from '../services/EventoService';

export default function EventCard({ event, showParticipate = true }) {
  
  // --- 1. RECUPERO SICURO DELL'ID ---
  const safeId = event.id || event.idEvento || event.id_evento;

  // Destrutturiamo i dati
  const title = event.title || event.titolo;
  const description = event.description || event.descrizione;
  const location = event.location || (event.indirizzo ? "Vedi dettagli" : event.luogo);
  const startDate = event.startDate || event.dataInizio || event.data_inizio;
  const maxParticipants = event.maxParticipants || event.maxPartecipanti || event.maxpartecipanti;
  const image = event.image || event.immagine;
  
  const organizerNameMapped = event.organizerName;

  // --- STATI ---
  const [isParticipating, setIsParticipating] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [userRole, setUserRole] = useState("");
  
  // STATO PER GESTIRE QUALE MODALE È APERTO
  const [activeModal, setActiveModal] = useState(null);

  // Formattazione data
  const fullDate = startDate 
    ? new Date(startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
    : "Data da definire";

  // --- CALCOLO NOME ORGANIZZATORE ---
  const getOrganizerName = () => {
    if (organizerNameMapped) return organizerNameMapped;
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

      if (showParticipate && isVolontario && safeId) {
        const status = await checkUserParticipation(safeId);
        setIsParticipating(status.isParticipating);
        setParticipationId(status.idPartecipazione);
      }
    };
    if (safeId) initializeCard();
  }, [safeId, showParticipate]);

  // --- HANDLERS PER I MODALI ---

  const handleOpenModifica = () => {
    setActiveModal('edit');
  };

  const handleUpdateSuccess = () => {
    setActiveModal(null); 
    window.location.reload(); 
  };

  // --- HANDLERS PARTECIPAZIONE (CON SWEETALERT) ---
  const handleToggleParticipation = async (e) => {
    e.stopPropagation();
    if (loadingBtn) return;
    setLoadingBtn(true);

    if (!isParticipating) {
      // --- ISCRIZIONE ---
      const result = await iscrivitiEvento(safeId);
      if (result.success) {
        // SUCCESSO
        Swal.fire({
            icon: 'success',
            title: 'Iscrizione effettuata!',
            text: `Ti sei iscritto a: ${title}`,
            timer: 2000,
            showConfirmButton: false
        });
        
        setIsParticipating(true);
        const status = await checkUserParticipation(safeId);
        if (status.idPartecipazione) setParticipationId(status.idPartecipazione);
      } else {
        // ERRORE
        Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: result.message || "Impossibile iscriversi"
        });
      }
    } else {
      // --- CANCELLAZIONE ---
      let idDaCancellare = participationId;
      if (!idDaCancellare) {
        const status = await checkUserParticipation(safeId);
        if (status.isParticipating && status.idPartecipazione) {
            idDaCancellare = status.idPartecipazione;
            setParticipationId(status.idPartecipazione);
        }
      }

      if (!idDaCancellare) {
        Swal.fire({
            icon: 'error',
            title: 'Errore tecnico',
            text: 'ID partecipazione non trovato. Ricarica la pagina.'
        });
        setLoadingBtn(false);
        return;
      }

      // CONFERMA CANCELLAZIONE CON SWEETALERT
      const confirmResult = await Swal.fire({
        title: 'Sei sicuro?',
        text: "Vuoi davvero annullare la tua partecipazione?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sì, annulla!',
        cancelButtonText: 'No, rimani'
      });

      if (confirmResult.isConfirmed) {
        const result = await rimuoviIscrizione(idDaCancellare);
        if (result.success) {
          Swal.fire(
            'Annullata!',
            'La tua partecipazione è stata cancellata.',
            'success'
          );
          setIsParticipating(false);
          setParticipationId(null);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: result.message || "Impossibile annullare"
          });
        }
      }
    }
    setLoadingBtn(false);
  };

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

      {/* --- GESTIONE MODALI --- */}
      {activeModal === 'details' && (
        <DettagliEvento 
          evento={event.raw || event} 
          onClose={() => setActiveModal(null)}
          onOpenParticipants={() => setActiveModal('participants')}
          onModifica={handleOpenModifica} 
        />
      )}

      {activeModal === 'participants' && (
        <VisualizzaPartecipantiEvento 
          idEvento={safeId}
          titoloEvento={title} 
          onClose={() => setActiveModal(null)}
          onBack={() => setActiveModal('details')} 
        />
      )}

      {activeModal === 'edit' && (
        <ModifyEvento
            isOpen={true}
            onClose={() => setActiveModal('details')} 
            eventToEdit={event.raw || event}         
            onUpdate={handleUpdateSuccess}           
        />
      )}
    </>
  );
}