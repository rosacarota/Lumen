import React from 'react';
import '../stylesheets/VolontarioProfile.css';

// --- COMPONENTE 1: StoryCard (Feed Centrale) ---
const StoryCard = ({ title, text, author, role, authorImg }) => {
  return (
    <div className="card-component">
      <div className="card-header">
        <img src={authorImg} alt={author} className="card-avatar" />
        <div>
          <h3 className="card-author-name">{author}</h3>
          <span className="card-role">{role}</span>
        </div>
      </div>
      <h3 className="card-body-title">{title}</h3>
      <p className="card-body-text">{text}</p>
      <button className="submit-button">LEGGI QUI</button>
    </div>
  );
};

// --- COMPONENTE 2: EventCard (Colonna Destra - Eventi Partecipati) ---
const EventCard = ({ orgName, title, date, time, location, orgImg }) => {
  return (
    <div className="card-component event-card">
      <div className="card-header">
        <img src={orgImg} alt={orgName} className="card-avatar" />
        <div>
          <h3 className="card-author-name">{orgName}</h3>
          <span className="card-role">Ente Organizzatore</span>
        </div>
      </div>
      
      <h3 className="card-body-title event-title">{title}</h3>
      
      <div className="event-details">
        <div className="event-row">
          <span className="icon">📅</span> <span>{date}</span>
        </div>
        <div className="event-row">
          <span className="icon">🕒</span> <span>{time}</span>
        </div>
        <div className="event-row">
          <span className="icon">📍</span> <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE 3: EntityMiniCard (Colonna Sinistra - Enti Affiliati) ---
const EntityMiniCard = ({ name, type }) => {
  return (
    <div className="entity-mini-card">
      <div className="entity-info">
        <div className="entity-avatar-placeholder"></div>
        <div>
          <h4 className="entity-name">{name}</h4>
          <span className="entity-type">{type}</span>
        </div>
      </div>
      <button className="small-button">VISUALIZZA</button>
    </div>
  );
};

// --- COMPONENTE PRINCIPALE ---
const VolontarioProfile = () => {
  
  // Dati fittizi del Volontario
  const volunteer = {
    name: "IlBuonLetto",
    role: "volontario",
    avatar: "https://i.pravatar.cc/150?img=68", 
    bio: "Appassionato di natura e assistenza sociale. Sempre pronto a dare una mano dove serve.",
    stats: {
      created: "11 settembre 2001",
      hours: "32h 49m",
      activities: 66
    }
  };

  return (
    <div className="Container">
      <div className="dashboard-grid">
        
        {/* --- 1. PROFILO + ENTI AFFILIATI (Sidebar Sinistra) --- */}
        <aside className="profile-panel">
          {/* Sezione Profilo */}
          <div className="profile-header">
            <img src={volunteer.avatar} alt="Profile" className="avatar" />
            <div className="user-info">
              <h2>{volunteer.name}</h2>
              <span>{volunteer.role}</span>
            </div>
          </div>

          <p className="user-bio">
            {volunteer.bio}
          </p>

          <div className="stats-group">
            <div className="stat-item">
              <h4>Creazione Account</h4>
              <p>{volunteer.stats.created}</p>
            </div>
            <div className="stat-item">
              <h4>Ore Volontario</h4>
              <p>{volunteer.stats.hours}</p>
            </div>
            <div className="stat-item">
              <h4>Attività Svolte</h4>
              <p>{volunteer.stats.activities}</p>
            </div>
          </div>

          <hr className="divider" />

          {/* Sezione Enti Affiliati (Integrata nella sidebar sinistra come da immagine) */}
          <h2 className="section-title-small">Enti Affiliati</h2>
          <div className="affiliates-list">
            <EntityMiniCard name="UniCiock" type="Ente Benefico" />
            <EntityMiniCard name="Croce Verde" type="Soccorso" />
          </div>
        </aside>

        {/* --- 2. STORIE (Centro - Scorribile) --- */}
        <main className="main-panel">
          <h2 className="panel-title">Ultime Storie</h2>

          <StoryCard 
            title="Raccolta Alimentare"
            text="Grazie a tutti quelli che hanno partecipato oggi! Abbiamo riempito 50 scatoloni per la mensa."
            author="IlBuonLetto"
            role="volontario"
            authorImg="https://i.pravatar.cc/150?img=68"
          />

          <StoryCard 
            title="Pulizia Parco"
            text="Sabato mattina ci ritroviamo ai giardini pubblici per la pulizia trimestrale. Chi viene?"
            author="Luca_Green"
            role="volontario"
            authorImg="https://i.pravatar.cc/150?img=33"
          />

          <StoryCard 
            title="Nuova convenzione"
            text="UniCiock ha stipulato una nuova convenzione per i volontari. Controllate la bacheca!"
            author="UniCiock"
            role="ente"
            authorImg="https://i.pravatar.cc/150?img=12"
          />
        </main>

        {/* --- 3. EVENTI PARTECIPATI (Destra - Scorribile) --- */}
        <aside className="action-panel">
          <h2 className="panel-title">Eventi Partecipati</h2>

          <EventCard 
            orgName="UniCiock"
            orgImg="https://i.pravatar.cc/150?img=12"
            title="Festa del Cioccolato"
            date="15 Ottobre 2025"
            time="12:00 - 23:00"
            location="Via Batti la Pesca, 66"
          />

          <EventCard 
            orgName="Comune"
            orgImg="https://i.pravatar.cc/150?img=50"
            title="Maratona Cittadina"
            date="02 Novembre 2025"
            time="08:00 - 14:00"
            location="Piazza Garibaldi"
          />

           <EventCard 
            orgName="Mensa Poveri"
            orgImg="https://i.pravatar.cc/150?img=8"
            title="Servizio Serale"
            date="10 Novembre 2025"
            time="19:00 - 22:00"
            location="Via Roma 22"
          />
        </aside>

      </div>
    </div>
  );
};

export default VolontarioProfile;