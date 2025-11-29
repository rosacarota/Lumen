import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SchedaVolontario from '../components/SchedaVolontario'; // <--- Assicurati che questo file esista!
import '../stylesheets/EventsPage.css'; // Usiamo lo stesso CSS della griglia eventi

export default function VisualizzaPartecipantiEvento() {
  
  // DATI FINTI (Mock) basati sul tuo Utente.java
  const listaVolontari = [
    {
      email: "mario.rossi@test.com",
      nome: "Mario",
      cognome: "Rossi",
      ruolo: "Volontario",
      descrizione: "Sono un appassionato di ecologia.",
      recapitoTelefonico: "3331234567",
      immagine: null 
    },
    {
      email: "luigi.verdi@test.com",
      nome: "Luigi",
      cognome: "Verdi",
      ruolo: "Volontario",
      descrizione: "Esperto in primo soccorso.",
      recapitoTelefonico: "3339876543",
      immagine: null
    }
  ];

  return (
    <>
      <div className="page-wrapper">
        <Navbar />

        <div className="main-container">
          <div className="content-box">
            
            <div className="box-header">
              <div className="header-text">
                <h1>Partecipanti</h1>
                <p>Volontari iscritti all'evento</p>
              </div>
            </div>

            {/* Griglia Volontari */}
            <div className="events-grid">
              {listaVolontari.map((volontario) => (
                <SchedaVolontario 
                  key={volontario.email} 
                  utente={volontario} 
                />
              ))}
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}