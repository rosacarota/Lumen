import React from 'react';
import '../stylesheets/BeneficiarioProfile.css';
import Navbar from '../components/Navbar';

// --- COMPONENTE 1: StoryCard (Turchese) ---
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

// --- COMPONENTE 2: RequestCard (Turchese) ---
const RequestCard = ({ title, text }) => {
  return (
    <div className="card-component">
      <h3 className="card-body-title" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        {title}
      </h3>
      <p className="card-body-text" style={{ marginTop: '10px' }}>
        {text}
      </p>
      <button className="submit-button">AIUTA</button>
    </div>
  );
};

// --- COMPONENTE PRINCIPALE ---
const BeneficiarioProfile = () => {
  
  // Dati utente fittizi
  const user = {
    name: "Paky89",
    role: "beneficiario",
    avatar: "https://i.pravatar.cc/150?img=11", 
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: {
      created: "23 ottobre 2018",
      hours: "54h 38m",
      activities: 18
    }
  };

  return (
    <div className="Container">
         <Navbar></Navbar>
      <div className="dashboard-grid">
        
        {/* --- 1. PROFILO (Sidebar Fissa) --- */}
        <aside className="profile-panel">
          <div className="profile-header">
            <img src={user.avatar} alt="Profile" className="avatar" />
            <div className="user-info">
              <h2>{user.name}</h2>
              <span>{user.role}</span>
            </div>
          </div>

          <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {user.bio}
          </p>

          <div className="stats-group">
            <div className="stat-item">
              <h4>Creazione Account</h4>
              <p>{user.stats.created}</p>
            </div>
            <div className="stat-item">
              <h4>Ore Volontario</h4>
              <p>{user.stats.hours}</p>
            </div>
            <div className="stat-item">
              <h4>Attività Svolte</h4>
              <p>{user.stats.activities}</p>
            </div>
          </div>
        </aside>

        {/* --- 2. STORIE (Scorribile) --- */}
        <main className="main-panel">
          <h2 className="panel-title">Ultime Storie</h2>

          <StoryCard 
            title="Giornata di raccolta"
            text="Oggi è stata una giornata fantastica. Abbiamo raccolto fondi per la nuova struttura e incontrato tantissime persone disponibili."
            author="Paky89"
            role="beneficiario"
            authorImg="https://i.pravatar.cc/150?img=11"
          />

          <StoryCard 
            title="Nuovo progetto"
            text="Stiamo preparando qualcosa di speciale per il prossimo mese. Restate sintonizzati per maggiori dettagli."
            author="Maria_V"
            role="volontario"
            authorImg="https://i.pravatar.cc/150?img=5"
          />

          <StoryCard 
            title="Ringraziamento"
            text="Volevo ringraziare pubblicamente l'associazione per l'aiuto ricevuto la scorsa settimana."
            author="Giovanni_R"
            role="beneficiario"
            authorImg="https://i.pravatar.cc/150?img=3"
          />
          
          <StoryCard 
            title="Evento Domenica"
            text="Non dimenticatevi della fiera di beneficenza questa domenica in piazza centrale!"
            author="Admin_Luca"
            role="admin"
            authorImg="https://i.pravatar.cc/150?img=8"
          />
        </main>

        {/* --- 3. RICHIESTE (Scorribile) --- */}
        <aside className="action-panel">
          <h2 className="panel-title">Richieste Servizio</h2>

          <RequestCard 
            title="Supporto Spesa"
            text="C'è bisogno di un volontario per consegnare la spesa a due famiglie nel quartiere centro. Disponibilità: Martedì mattina."
          />

          <RequestCard 
            title="Trasporto Medico"
            text="Richiesta di accompagnamento per visita medica presso l'ospedale locale. Urgente."
          />

          <RequestCard 
            title="Lezioni di Italiano"
            text="Cerchiamo insegnanti volontari per corso base di italiano per stranieri. Mercoledì sera."
          />

          <RequestCard 
            title="Piccoli Traslochi"
            text="Serve una mano per spostare alcuni mobili in sede. Richiesta forza fisica."
          />
        </aside>

      </div>
    </div>
  );
};

export default BeneficiarioProfile;