import React, { useState, useEffect } from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; // Le tue card esistenti
import Footer from '../components/Footer';
import { fetchEvents } from '../services/PartecipazioneEventiService';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <>
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <div className="content-box">
          <div className="box-header">
            <div className="header-text">
              <h1>Eventi</h1>
              <p>Scopri le attività della community e partecipa.</p>
            </div>
          </div>

          <div className="events-grid">
            {loading && <p>Caricamento eventi...</p>}
            {!loading && events.length === 0 && <p>Nessun evento disponibile.</p>}

            {!loading && events.map((event) => (
              <EventCard 
                key={event.idEvento} // Backend Java usa idEvento
                id_evento={event.idEvento} // Passo esplicitamente l'ID
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