import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Info, UserPlus, UserCheck, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import '../stylesheets/EventCard.css';

// MODALI
import DettagliEvento from './DettagliEvento';
import VisualizzaPartecipantiEvento from './VisualizzaPartecipantiEvento';
import ModifyEvento from './ModifyEvento';

import {
  iscrivitiEvento,
  rimuoviIscrizione,
  checkUserParticipation
} from '../services/PartecipazioneEventoService';

import { rimuoviEvento } from '../services/EventoService';

// DEFINIZIONE URL BACKEND
const API_BASE_URL = "http://localhost:8080";

export default function EventCard({ event, showParticipate = true }) {

  const navigate = useNavigate();

  const safeId = event.id || event.idEvento || event.id_evento;

  const title = event.title || event.titolo;
  const description = event.description || event.descrizione;
  const location = event.location || (event.indirizzo ? "Vedi dettagli" : event.luogo);
  const startDate = event.startDate || event.dataInizio || event.data_inizio;
  const maxParticipants = event.maxParticipants || event.maxPartecipanti || event.maxpartecipanti;
  const image = event.image || event.immagine;

  const organizerNameMapped = event.organizerName;

  const [isParticipating, setIsParticipating] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  const fullDate = startDate
    ? new Date(startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
    : "Data da definire";

  // --- CALCOLO NOME ---
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


  // Trova la stringa dell'immagine nei dati
  const getOrganizerImage = () => {
    if (event.organizerImage) return event.organizerImage;
    if (event.utente && typeof event.utente === 'object' && event.utente.immagine) {
      return event.utente.immagine;
    }
    if (event.ente && typeof event.ente === 'object' && event.ente.immagine) {
      return event.ente.immagine;
    }
    return null;
  };

  // Costruisce l'URL completo
  const getAvatarUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  // Variabili finali da usare nel return
  const rawImage = getOrganizerImage();
  const finalAvatarUrl = getAvatarUrl(rawImage);
  const avatarLetter = (displayOrganizerName || "E").charAt(0).toUpperCase();



  const handleEnteClick = (e) => {
    e.stopPropagation();
    localStorage.setItem("searchEmail", event.utente.email);
    navigate('/ProfiloEnte');
  };

  useEffect(() => {
    const initializeCard = async () => {
      // Usiamo direttamente il localStorage 
      const ruoloFinale = localStorage.getItem("ruolo") || localStorage.getItem("userRole") || "";
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

  const handleOpenModifica = () => {
    setActiveModal('edit');
  };

  const handleUpdateSuccess = () => {
    setActiveModal(null);
    window.location.reload();
  };

  const handleEliminaEvento = async () => {
    if (window.confirm(`Sei sicuro di voler eliminare l'evento "${title}"?`)) {
      try {
        await rimuoviEvento(safeId);
        window.location.reload();
      } catch (error) {
        alert("Errore: " + error.message);
      }
    }
  };

  const handleToggleParticipation = async (e) => {
    e.stopPropagation();
    if (loadingBtn) return;
    setLoadingBtn(true);

    if (!isParticipating) {
      const result = await iscrivitiEvento(safeId);
      if (result.success) {
        Swal.fire({ icon: 'success', title: 'Iscrizione effettuata!', text: `Ti sei iscritto a: ${title}`, timer: 2000, showConfirmButton: false });
        setIsParticipating(true);
        const status = await checkUserParticipation(safeId);
        if (status.idPartecipazione) setParticipationId(status.idPartecipazione);
      } else {
        Swal.fire({ icon: 'error', title: 'Errore', text: result.message || "Impossibile iscriversi" });
      }
    } else {
      let idDaCancellare = participationId;
      if (!idDaCancellare) {
        const status = await checkUserParticipation(safeId);
        if (status.isParticipating && status.idPartecipazione) {
          idDaCancellare = status.idPartecipazione;
          setParticipationId(status.idPartecipazione);
        }
      }

      if (!idDaCancellare) {
        Swal.fire({ icon: 'error', title: 'Errore tecnico', text: 'ID partecipazione non trovato.' });
        setLoadingBtn(false);
        return;
      }

      const confirmResult = await Swal.fire({
        title: 'Sei sicuro?',
        text: "Vuoi davvero annullare la tua partecipazione?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sì, annulla!'
      });

      if (confirmResult.isConfirmed) {
        const result = await rimuoviIscrizione(idDaCancellare);
        if (result.success) {
          Swal.fire('Annullata!', 'La tua partecipazione è stata cancellata.', 'success');
          setIsParticipating(false);
          setParticipationId(null);
        } else {
          Swal.fire({ icon: 'error', title: 'Errore', text: result.message || "Impossibile annullare" });
        }
      }
    }
    setLoadingBtn(false);
  };

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
            {/*  CODICE JSX PER L'AVATAR */}
            <div className="event-avatar">
              {finalAvatarUrl ? (
                <img
                  src={finalAvatarUrl}
                  alt={displayOrganizerName}
                  className="event-avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}

              {/* Fallback Lettera */}
              <span style={{ display: finalAvatarUrl ? 'none' : 'flex' }}>
                {avatarLetter}
              </span>
            </div>
            {}

            <div className="event-meta">
              <span
                className="event-brand"
                onClick={handleEnteClick}
                style={{ cursor: 'pointer' }}
                title="Vai al profilo Ente"
              >
                {displayOrganizerName}
              </span>
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
          evento={event.raw || event}
          onClose={() => setActiveModal(null)}
          onOpenParticipants={() => setActiveModal('participants')}
          onElimina={handleEliminaEvento}
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