import React, { useState, useEffect } from 'react';
import '../stylesheets/EventsPage.css';

import EventCard from '../components/EventCard';
import DettagliEvento from '../components/DettagliEvento';
import VisualizzaPartecipantiEvento from '../components/VisualizzaPartecipantiEvento';
import ModifyEvento from '../components/ModifyEvento';

import Swal from 'sweetalert2';

// Servizi
import { fetchEvents } from '../services/PartecipazioneEventoService';
import { rimuoviEvento } from '../services/EventoService';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATO MODALI (LIFTED UP) ---
  const [activeModal, setActiveModal] = useState(null); // 'details', 'participants', 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Funzione semplificata: carica sempre tutti gli eventi
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error("Errore caricamento:", error);
      Swal.fire({
        icon: 'error',
        title: 'Ops...',
        text: 'Impossibile caricare gli eventi. Riprova più tardi.',
        confirmButtonColor: '#087886'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- GESTIONE MODALI ---
  const handleOpenModal = (type, event) => {
    setSelectedEvent(event);
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedEvent(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseModal();
    loadData();
  };

  const handleEliminaEvento = async () => {
     if (!selectedEvent) return;
     const safeId = selectedEvent.id || selectedEvent.idEvento || selectedEvent.id_evento;
     const title = selectedEvent.title || selectedEvent.titolo;

     if (window.confirm(`Sei sicuro di voler eliminare l'evento "${title}"?`)) {
       try {
         await rimuoviEvento(safeId);
         handleCloseModal();
         loadData();
       } catch (error) {
         alert("Errore: " + error.message);
       }
     }
  };


  return (
    <div className="events-page-wrapper">

      {/* APPLICO L'ANIMAZIONE QUI, AL CONTENUTO INTERNO */}
      <div className="main-container page-enter-animation">
        <div className="content-box">

          <div className="box-header">
            <div className="header-text">
              <h1>Tutti gli Eventi</h1>
              <p>Scopri le attività della community e partecipa.</p>
            </div>
          </div>

          <div className="events-grid">
            {loading && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Caricamento in corso...</p>}

            {!loading && events.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Nessun evento disponibile.</p>
            )}

            {!loading && events.map((event, index) => (
              <EventCard
                // Usiamo l'ID se c'è, altrimenti l'indice come fallback per evitare errori di key
                key={event.id || event.idEvento || index}

                // Passiamo l'intero oggetto "pulito" dal service
                event={event}

                showParticipate={true}
                
                // Callback per aprire il modale
                onOpenDetails={() => handleOpenModal('details', event)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* MODALI FUORI DAL CONTENITORE ANIMATO */}
      {activeModal === 'details' && selectedEvent && (
        <DettagliEvento
          evento={selectedEvent.raw || selectedEvent}
          onClose={handleCloseModal}
          onOpenParticipants={() => setActiveModal('participants')}
          onElimina={handleEliminaEvento}
          onModifica={() => setActiveModal('edit')}
        />
      )}

      {activeModal === 'participants' && selectedEvent && (
        <VisualizzaPartecipantiEvento
          idEvento={selectedEvent.id || selectedEvent.idEvento || selectedEvent.id_evento}
          titoloEvento={selectedEvent.title || selectedEvent.titolo}
          onClose={handleCloseModal}
          onBack={() => setActiveModal('details')}
        />
      )}

      {activeModal === 'edit' && selectedEvent && (
        <ModifyEvento
          isOpen={true}
          onClose={() => setActiveModal('details')}
          eventToEdit={selectedEvent.raw || selectedEvent}
          onUpdate={handleUpdateSuccess}
        />
      )}

    </div>
  );
}