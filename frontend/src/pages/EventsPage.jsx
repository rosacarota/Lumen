import React from 'react';
import '../stylesheets/EventsPage.css';
import Navbar from '../components/Navbar'; 
import EventCard from '../components/EventCard';
import StatsCard from '../components/StatsCard';

export default function EventsPage() {
  return (
    <div className="eventi-page">
      <div className="page-container">
        
        {/* 1. Header (Menu in alto) */}
        <Navbar />

        {/* 2. Titolo Pagina */}
        <div className="main-title-box">
          <h1>EVENTI</h1>
        </div>

        {/* 3. Sezione "I TUOI EVENTI" */}
        <section className="grey-section">
          <h3 className="section-title">I TUOI EVENTI</h3>
          <div className="dashboard-row">
            <EventCard />
            <StatsCard />
          </div>
        </section>

        {/* 4. Tabs (Passati / Futuri) */}
        <div className="tabs-bar">
           <span className="tab-link active">EVENTI PASSATI</span>
           <span className="tab-separator">|</span>
           <span className="tab-link underline">EVENTI FUTURI</span>
        </div>

        {/* 5. Sezione "EVENTI CONSIGLIATI" */}
        <section className="grey-section">
          <h3 className="section-title">EVENTI CONSIGLIATI</h3>
          <div className="recommended-container">
            {/* Qui riutilizziamo la card grande creata in precedenza */}
            <EventCard />
          </div>
        </section>

      </div>
    </div>
  );
}