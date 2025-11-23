import React from 'react';
import EventCard from '../components/EventCard';

export default function ProfiloEnte() {
  return (
    <div className="profile-page">
      <div className="container">
        

        <div className="page-title-wrapper">
          <h1>Profilo</h1>
        </div>


        <div className="cards-grid">
          <EventCard />
          <EventCard />
          <EventCard />
        </div>

      </div>
    </div>
  );
}