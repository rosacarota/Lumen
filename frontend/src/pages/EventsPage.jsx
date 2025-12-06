import React, { useState, useEffect } from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; 
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

// Servizi
import { fetchEvents } from '../services/PartecipazioneEventoService'; 

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    // USIAMO LA CLASSE DEL NUOVO CSS
    <div className="page-wrapper-inner">
      <Navbar />

      <div className="main-container">
        <div className="content-box">
          
          <div className="box-header">
             <div className="header-text">
                <h1>Tutti gli Eventi</h1>
                <p>Scopri le attività della community e partecipa.</p>
             </div>
          </div>

          <div className="events-grid">
            {loading && <p style={{gridColumn:'1/-1', textAlign:'center', color:'#666'}}>Caricamento in corso...</p>}
            
            {!loading && events.length === 0 && (
              <p style={{gridColumn:'1/-1', textAlign:'center', color:'#666'}}>Nessun evento disponibile.</p>
            )}

            {!loading && events.map((event, index) => (
              <EventCard 
                // Usiamo l'ID se c'è, altrimenti l'indice come fallback per evitare errori di key
                key={event.id || event.idEvento || index} 
                
                // Passiamo l'intero oggetto "pulito" dal service
                event={event}  
                
                showParticipate={true}
              />
            ))}
          </div>

        </div>
      </div>
      
      {/* IL FOOTER ORA È DENTRO IL WRAPPER, COSÌ VIENE SPINTO GIÙ */}
      <Footer />
    </div>
  );
}