import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import AddEvento from '../components/AddEvento.jsx';
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import Footer from '../components/Footer.jsx';
import '../stylesheets/ProfiloEnte.css';
import { fetchUserProfile } from '../services/UserServices.js';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import AffiliazioneService from '../services/AffiliazioneService.js';

const ModalWrapper = ({ children, onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer'
      }} />
      <div style={{
        position: 'relative', zIndex: 10, backgroundColor: 'white',
        borderRadius: '12px', padding: '20px', width: '90%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '10px', right: '15px', background: 'none',
          border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666', zIndex: 20
        }}>&times;</button>
        {children}
      </div>
    </div>
  );
};

const ProfiloEnte = () => {
  const { id } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  const loadData = async () => {
    try {
      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error("Errore caricamento profilo:", error);
      setUserProfile({
        title: "Nome Ente (Demo)",
        subtitle: "ENTE",
        description: "Descrizione temporanea in attesa del backend...",
        stat1: "0 Followers",
        stat2: "0 Eventi"
      });
    }
  };
  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      try {
        const currentUser = JSON.parse(storedUserStr);
        if (!id || String(currentUser.id) === String(id)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsOwner(true);
          loadData();
        } else {
          setIsOwner(false);
        }
        if (currentUser.ruolo === 'volontario') {
          setIsVolunteer(true);
        } else {
          setIsVolunteer(false);
        }
      } catch (error) {
        console.error("Errore parsing user", error);
        setIsOwner(false);
      }
    } else {
      // Se non c'è utente loggato ma stiamo sviluppando, forziamo owner per test grafico
      // (Rimuovi questo else in produzione)
      setIsOwner(true);
      loadData();
    }
  }, [id]);
  const handleFollowClick = () => setIsFollowing(!isFollowing);
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRichiestaAffiliazione = async () => {
    const token = localStorage.getItem('token');
    // Assuming userProfile contains the Ente's data.
    const emailEnte = userProfile?.email;

    if (!emailEnte) {
      alert("Impossibile recuperare l'email dell'ente. Assicurati che il profilo sia caricato correttamente.");
      return;
    }

    try {
      const isAffiliated = await AffiliazioneService.checkAffiliazione(emailEnte, token);
      if (isAffiliated) {
        alert("Non puoi effettuare la richiesta di affiliazione perché hai già un ente affiliato.");
      } else {
        setShowAffiliazioneModal(true);
      }
    } catch (error) {
      console.error("Errore check affiliazione:", error);
      alert("Errore durante il controllo dell'affiliazione.");
    }
  };
  const profileProps = userProfile ? {
    title: userProfile.nome || "Nome Ente",
    subtitle: "ENTE",
    description: userProfile.descrizione || "Nessuna descrizione",
    stat1: "123 Followers",
    stat2: "10 Eventi",
  } : undefined;

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">
        <AccessoInfoProfilo
          {...profileProps} // Passa i dati scaricati
        // Se non è owner, nascondiamo i tasti modifica nel componente figlio (se gestito internamente)
        // Oppure, se AccessoInfoProfilo gestisce l'essere owner, passagli una prop isOwner={isOwner}
        />
        <section className="event-section">
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
                    CREA RACCOLTA
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-action" onClick={handleFollowClick}>
                    {isFollowing ? 'SEGUITO' : 'SEGUI'}
                  </button>
                  {isVolunteer && (
                    <button className="btn-action btn-affiliation" onClick={handleRichiestaAffiliazione}>
                      Richiedi affiliazione all'ente
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="split-layout">
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
            <div className="right-column">
              <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE</button>
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
      <Footer />
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
      {showAffiliazioneModal && (
        <ModalWrapper onClose={() => setShowAffiliazioneModal(false)}>
          <RichiestaAffiliazione
            onClose={() => setShowAffiliazioneModal(false)}
            emailEnte={userProfile?.email}
          />
        </ModalWrapper>
      )}

    </div>
  );
};

export default ProfiloEnte;