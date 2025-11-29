import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Serve per leggere l'ID dall'URL
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SchedaVolontario from '../components/SchedaVolontario';
import '../stylesheets/EventsPage.css'; 

// Importiamo la nuova funzione dal service
import { fetchPartecipanti } from '../services/PartecipazioneEventiService';

export default function VisualizzaPartecipantiEvento() {
  
  // Legge l'id dall'URL (es. se sei su /partecipanti/1, idEvento sarà 1)
  const { idEvento } = useParams(); 
  
  const [listaVolontari, setListaVolontari] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Se non c'è ID (es. test manuale), fermati o usa un default
      if (!idEvento) return; 

      setLoading(true);
      const data = await fetchPartecipanti(idEvento);
      setListaVolontari(data);
      setLoading(false);
    };

    loadData();
  }, [idEvento]); // Ricarica se cambia l'ID evento

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <div className="content-box">
          
          <div className="box-header">
            <div className="header-text">
              <h1>Partecipanti</h1>
              <p>Volontari iscritti all'evento #{idEvento}</p>
            </div>
            
            {/* Contatore Iscritti */}
            {!loading && (
                <div style={{
                    backgroundColor: '#ecfdf5', 
                    color: '#0e7490', 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    fontWeight: 'bold'
                }}>
                    {listaVolontari.length} Iscritti
                </div>
            )}
          </div>

          {/* Griglia Volontari */}
          <div className="events-grid">
            
            {loading && <p>Caricamento partecipanti...</p>}
            
            {!loading && listaVolontari.length === 0 && (
                <p>Nessun volontario iscritto a questo evento.</p>
            )}

            {!loading && listaVolontari.map((volontario) => (
              <SchedaVolontario 
                key={volontario.email} // L'email è chiave primaria in Utente.java
                utente={volontario} 
              />
            ))}
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}