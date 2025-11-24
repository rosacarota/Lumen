import React from 'react';
import '../stylesheets/EventCard.css';

export default function EventCard() {
  return (
    <div className="mini-card">
      <div className="mini-header">
        <div className="mini-avatar"></div>
        <div className="mini-user-info">
            <span className="mini-brand">UniClock</span>
            <span className="mini-role">ente</span>
        </div>
      </div>
      
      <h4 className="mini-title">Lorem Ipsum</h4>
      
      <div className="mini-pills">
        <div className="mini-pill">📅 15 ottobre 2025</div>
        <div className="mini-pill">🕒 19:00-23:00</div>
        <div className="mini-pill">📍 via batte la pesca, 66</div>
      </div>
    </div>
  );
}