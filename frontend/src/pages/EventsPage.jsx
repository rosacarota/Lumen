import React, { useState, useEffect } from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; 
import Footer from '../components/Footer';

// Servizi
import { fetchEvents } from '../services/PartecipazioneEventoService'; 
import { getCronologiaEventi } from '../services/CronologiaEventiService'; 

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tutti'); 

  // Funzione unica per caricare i dati
  const loadData = async (mode) => {
    setLoading(true);
    try {
      let data = [];
      if (mode === 'tutti') {
        data = await fetchEvents();
      } else {
        data = await getCronologiaEventi(null);
      }
      setEvents(data);
      setViewMode(mode);
    } catch (error) {
      console.error("Errore caricamento:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData('tutti');
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
             
             <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => loadData('tutti')} 
                  className="btn-new"
                  style={{ 
                    backgroundColor: viewMode === 'tutti' ? '#087886' : '#e0e0e0', 
                    color: viewMode === 'tutti' ? 'white' : '#333',
                    border: 'none', cursor: 'pointer' 
                  }}
                >Tutti</button>
                <button 
                  onClick={() => loadData('cronologia')} 
                  className="btn-new"
                  style={{ 
                    backgroundColor: viewMode === 'cronologia' ? '#087886' : '#e0e0e0', 
                    color: viewMode === 'cronologia' ? 'white' : '#333',
                    border: 'none', cursor: 'pointer'
                  }}
                >Cronologia</button>
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
                
                // NOTA: Ho rimosso onOpenDetails perché ora la Card si gestisce da sola!
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