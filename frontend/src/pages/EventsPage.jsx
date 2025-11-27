import React, { useState, useEffect } from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; 
import Footer from '../components/Footer';

// IMPORTIAMO ENTRAMBI I SERVIZI
import { fetchEvents } from '../services/PartecipazioneEventiService'; // Funzionalità originale
import { getCronologiaEventi } from '../services/CronologiaEventiService'; // Nuova funzionalità

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stato per gestire quale "vista" è attiva: 'tutti' o 'cronologia'
  const [viewMode, setViewMode] = useState('tutti'); 

  // Funzione per caricare TUTTI gli eventi (Funzionalità Originale)
  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setViewMode('tutti');
    } catch (error) {
      console.error("Errore caricamento eventi generali:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per caricare la CRONOLOGIA (Nuova Funzionalità)
  const loadHistoryEvents = async () => {
    setLoading(true);
    try {
      // Passo null per avere tutta la cronologia, oppure uno stato specifico se serve
      const data = await getCronologiaEventi(null); 
      setEvents(data);
      setViewMode('cronologia');
    } catch (error) {
      console.error("Errore caricamento cronologia:", error);
    } finally {
      setLoading(false);
    }
  };

  // Al caricamento della pagina, mostriamo di default gli eventi generali (come prima)
  useEffect(() => {
    loadAllEvents();
  }, []);

  return (
    <>
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <div className="content-box">
          <div className="box-header">
            <div className="header-text">
              <h1>{viewMode === 'tutti' ? 'Tutti gli Eventi' : 'La tua Cronologia'}</h1>
              <p>Scopri le attività della community e partecipa.</p>
            </div>
            
            {/* --- NUOVA SEZIONE: Bottoni per cambiare funzionalità --- */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={loadAllEvents}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: viewMode === 'tutti' ? '#087886' : '#e0e0e0',
                  color: viewMode === 'tutti' ? 'white' : '#333'
                }}
              >
                Tutti gli Eventi
              </button>
              
              <button 
                onClick={loadHistoryEvents}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: viewMode === 'cronologia' ? '#087886' : '#e0e0e0',
                  color: viewMode === 'cronologia' ? 'white' : '#333'
                }}
              >
                La mia Cronologia
              </button>
            </div>
            {/* ----------------------------------------------------- */}

          </div>

          <div className="events-grid">
            {loading && <p>Caricamento in corso...</p>}
            
            {!loading && events.length === 0 && (
              <p>Nessun evento da mostrare.</p>
            )}

            {!loading && events.map((event) => (
              <EventCard 
                key={event.idEvento} 
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
              />
            ))}
          </div>

        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}