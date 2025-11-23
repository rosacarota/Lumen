import React from 'react';
import '../stylesheets/EventCard.css';

const EventCard = () => {
  return (
    <article className="event-card">
      <div className="card-header">
        <div className="avatar-circle"></div>
        <div className="text-group">
          <span className="brand-name">UniClock</span>
          <span className="brand-role">ente</span>
        </div>
      </div>

      <h3 className="event-title">Nome evento</h3>
      <p className="event-desc">descrizione</p>

      <div className="event-details">
        <div className="detail-item">Data</div>
        <div className="detail-item">ora</div>
        <div className="detail-item">luogo</div>
      </div>

      <div className="card-footer">
        <button className="btn-partecipa">PARTECIPA</button>
      </div>
      
    </article>
  );
}

export default EventCard;