import React from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; // Le tue card esistenti
import Footer from '../components/Footer';

export default function EventsPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        {/* Il Riquadro Bianco Principale (ex "Storie", ora "Eventi") */}
        <div className="content-box">
          
          {/* Intestazione del Riquadro */}
          <div className="box-header">
            <div className="header-text">
              <h1>Eventi</h1>
              <p>Scopri le attività della community e partecipa.</p>
            </div>
          </div>

          {/* Griglia delle EventCard */}
          <div className="events-grid">
            {/* Qui inseriamo le tue card. Puoi metterne quante ne vuoi */}
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}