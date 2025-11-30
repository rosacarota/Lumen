import React, { useState, useEffect } from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; 
import Footer from '../components/Footer';
import DettagliEvento from '../components/DettagliEvento'; // <--- IMPORTA IL MODALE

import { fetchEvents } from '../services/PartecipazioneEventoService'; 
import { getCronologiaEventi } from '../services/CronologiaEventiService'; 

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tutti'); 

  // --- STATO PER IL MODALE ---
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Funzione chiamata dalla CARD quando clicchi "Dettagli"
  const handleOpenDetails = (evento) => {
    setSelectedEvent(evento);
  };

  // Funzione per chiudere il modale
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // ... (loadAllEvents e loadHistoryEvents restano uguali) ...
  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setViewMode('tutti');
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const loadHistoryEvents = async () => {
    setLoading(true);
    try {
      const data = await getCronologiaEventi(null); 
      setEvents(data);
      setViewMode('cronologia');
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { loadAllEvents(); }, []);

  return (
    <>
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <div className="content-box">
          
          {/* ... Header e bottoni cambio vista (restano uguali) ... */}
          <div className="box-header">
             <div className="header-text">
                <h1>{viewMode === 'tutti' ? 'Tutti gli Eventi' : 'La tua Cronologia'}</h1>
                <p>Scopri le attività della community e partecipa.</p>
             </div>
             <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={loadAllEvents} style={{/*...*/}}>Tutti</button>
                <button onClick={loadHistoryEvents} style={{/*...*/}}>Cronologia</button>
             </div>
          </div>
          {/* ... fine header ... */}

          <div className="events-grid">
            {loading && <p>Caricamento...</p>}
            
            {!loading && events.map((event) => (
              <EventCard 
                key={event.idEvento} 
                
                // Passiamo tutto l'oggetto evento, serve per passarlo al modale
                eventData={event} 
                
                // Passiamo le singole prop per la visualizzazione della card
                id_evento={event.idEvento} 
                titolo={event.titolo}
                descrizione={event.descrizione}
                luogo={event.luogo}
                data_inizio={event.dataInizio}
                data_fine={event.dataFine}
                ente={event.ente}
                maxpartecipanti={event.maxPartecipanti}
                immagine={event.immagine}
                showParticipate={true}
                
                // --- PASSIAMO LA FUNZIONE PER APRIRE IL MODALE ---
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
    <Footer />

    {/* --- IL MODALE (Appare solo se selectedEvent esiste) --- */}
    {selectedEvent && (
      <DettagliEvento 
        evento={selectedEvent} 
        onClose={handleCloseModal} 
      />
    )}
    </>
  );
}