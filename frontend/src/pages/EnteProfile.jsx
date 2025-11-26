import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../stylesheets/EnteProfile.css';

// --- IMPORT COMPONENTI ---
import Navbar from '../components/Navbar.jsx';
import InfoProfilo from '../components/InfoProfilo.jsx';
import AccessoProfileInfo from '../components/AccessoInfoProfilo.jsx';

// --- IMPORT COMPONENTI PER I POPUP ---
import AddEvento from '../components/AddEvento.jsx';
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';

// --- COMPONENTE WRAPPER PER IL MODALE (STRUTTURA A STRATI) ---
const ModalWrapper = ({ children, onClose }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999, // Z-index altissimo per stare sopra a tutto
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 1. STRATO SFONDO (BACKDROP) 
        Questo div è separato dal contenuto. Se clicchi qui, DEVE chiudersi.
      */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          cursor: 'pointer'
        }}
      />

      {/* 2. STRATO CONTENUTO (BOX BIANCO)
        Questo sta "sopra" lo sfondo (z-index relativo) e non eredita il click dello sfondo.
      */}
      <div 
        style={{
          position: 'relative', // Importante: lo rende indipendente dallo sfondo assoluto
          zIndex: 10, // Assicura che stia sopra lo sfondo scuro
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          width: '90%', 
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}
      >
        {/* Tasto Chiudi (X) */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            zIndex: 20
          }}
        >
          &times;
        </button>

        {/* Contenuto del form */}
        {children}
      </div>
    </div>
  );
};

const EnteProfile = () => {
  // --- 1. LOGICA DI ACCESSO ---
  const { id } = useParams();
  const [isOwner, setIsOwner] = useState(false);

  // --- 2. STATI UI PAGINA ---
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });

  // --- 3. STATI PER I POPUP (MODALI) ---
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);

  // --- 4. EFFETTO CONTROLLO UTENTE ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && id) {
      try {
        const currentUser = JSON.parse(storedUser);
        if (String(currentUser.id) === String(id)) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error("Errore localStorage", error);
        setIsOwner(false);
      }
    }
  }, [id]);

  // --- HANDLERS ---
  const handleFollowClick = () => setIsFollowing(!isFollowing);
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        {/* --- HEADER DINAMICO --- */}
        {isOwner ? (
          <AccessoProfileInfo isFollowing={isFollowing} onToggle={handleFollowClick} />
        ) : (
          <InfoProfilo isFollowing={isFollowing} onToggle={handleFollowClick} />
        )}

        <section className="event-section">
          {/* --- CONTROLLI E BOTTONI --- */}
          <div className="controll">
            <div className="tabs-left">
              <button className={activeTab === 'corso' ? 'active' : ''} onClick={() => setActiveTab('corso')}>IN CORSO</button>
              <button className={activeTab === 'futuri' ? 'active' : ''} onClick={() => setActiveTab('futuri')}>FUTURI</button>
              <button className={activeTab === 'svolti' ? 'active' : ''} onClick={() => setActiveTab('svolti')}>SVOLTI</button>
            </div>
            <div className="actions-right">
              {isOwner ? (
                <>
                  <button className="btn-action" onClick={() => setShowEventoModal(true)}>
                    CREA EVENTO
                  </button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>
                    CREA RACCOLTA FONDI
                  </button>
                </>
              ) : (
                <button className="btn-action">AFFILIATI</button>
              )}
            </div>
          </div>

          {/* --- LAYOUT SPLIT --- */}
          <div className="split-layout">
            {/* COLONNA SX */}
            <div className="left-column">
              <div className="event-search">
                <h3 className="search-title">CERCA</h3>
                <div className="search-inputs">
                  <div className="input-group">
                    <label>DATA</label>
                    <input type="date" name="data" className="custom-input" onChange={handleFilterChange} />
                  </div>
                  <div className="input-group">
                    <label>ORARIO</label>
                    <input type="time" name="orario" className="custom-input" onChange={handleFilterChange} />
                  </div>
                  <div className="input-group">
                    <label>TIPO</label>
                    <select name="tipologia" className="custom-input" onChange={handleFilterChange}>
                      <option value="">Tutti</option>
                      <option value="conf">Conferenza</option>
                      <option value="party">Festa</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="event-grid">
                <p>Nessun evento {activeTab} trovato.</p>
              </div>
            </div>

            {/* COLONNA DX */}
            <div className="right-column">
              <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
              </div>
              <div className="sidebar-content">
                {activeSideTab === 'storie' ? (
                  <div className="placeholder-content">
                    <div className="story-circle"></div>
                    <p>Nessuna storia recente.</p>
                  </div>
                ) : (
                  <div className="placeholder-content">
                    <p>Nessuna raccolta attiva.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- MODALI (POPUP) --- */}
      {showEventoModal && (
        <ModalWrapper onClose={() => setShowEventoModal(false)}>
          <AddEvento onClose={() => setShowEventoModal(false)} isModal={true} />
        </ModalWrapper>
      )}

      {showRaccoltaModal && (
        <ModalWrapper onClose={() => setShowRaccoltaModal(false)}>
          <AddRaccoltaFondi onClose={() => setShowRaccoltaModal(false)} isModal={true} />
        </ModalWrapper>
      )}

    </>
  );
};

export default EnteProfile;