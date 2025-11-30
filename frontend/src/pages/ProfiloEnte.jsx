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
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';

// --- NUOVO IMPORT DEL SERVICE --
import { getRaccolteDiEnte } from '../services/RaccoltaFondiService.js';

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
  
  // Stati Utente e UI
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  
  // Stati Modali e Tab
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);

  // --- STATO DINAMICO PER LE RACCOLTE ---
  const [raccolteList, setRaccolteList] = useState([]);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);

  // 1. Caricamento Dati Utente
  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error("Errore caricamento profilo:", error);
      // Fallback in caso di errore
      setUserProfile({
        title: "Ente (Errore Caricamento)",
        subtitle: "ENTE",
        description: "Impossibile recuperare i dati.",
        stat1: "-", stat2: "-"
      });
    }
  };

  // 2. Caricamento Raccolte Fondi (DAL NUOVO SERVICE)
  const loadRaccolte = async () => {
    setLoadingRaccolte(true);
    try {
      const data = await getRaccolteDiEnte();
      
      // MAPPING: Adattiamo i dati del Backend alle props della Card
      // Il backend potrebbe mandare 'dataApertura' (camelCase), la card vuole 'data_apertura'
      const mappedData = Array.isArray(data) ? data.map(item => ({
         id_raccolta: item.id || item.idRaccolta, 
         titolo: item.titolo,
         descrizione: item.descrizione,
         obiettivo: item.obiettivo,
         totale_raccolto: item.totaleRaccolto || item.totale_raccolto || 0,
         data_apertura: item.dataApertura || item.data_apertura,
         data_chiusura: item.dataChiusura || item.data_chiusura,
         ente: userProfile?.nome || "Mio Ente" 
      })) : [];

      setRaccolteList(mappedData);
    } catch (error) {
      console.error("Errore caricamento raccolte:", error);
    } finally {
      setLoadingRaccolte(false);
    }
  };

  useEffect(() => {
    // Logica di inizializzazione
    const storedUserStr = localStorage.getItem('user');
    setIsOwner(true); // Forzato true per sviluppo, ripristina logica ID se necessario
    
    // Carichiamo tutto
    loadUserData();
    loadRaccolte(); 
    
  }, [id]);

  const handleFollowClick = () => setIsFollowing(!isFollowing);
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRichiestaAffiliazione = async () => {
    const token = localStorage.getItem('token');
    const emailEnte = userProfile?.email;
    if (!emailEnte) return alert("Impossibile recuperare l'email dell'ente.");
    
    try {
      const isAffiliated = await AffiliazioneService.checkAffiliazione(emailEnte, token);
      if (isAffiliated) {
        alert("Hai già un ente affiliato.");
      } else {
        setShowAffiliazioneModal(true);
      }
    } catch (error) {
      console.error(error);
      alert("Errore controllo affiliazione.");
    }
  };

  // Funzione chiamata quando si chiude il modale "Crea Raccolta"
  // Ricarica la lista per mostrare quella nuova appena creata
  const handleCloseRaccoltaModal = () => {
    setShowRaccoltaModal(false);
    loadRaccolte(); 
  };

  const profileProps = userProfile ? {
    title: userProfile.nome || "Nome Ente",
    subtitle: "ENTE",
    description: userProfile.descrizione || "Nessuna descrizione",
    stat1: "123 Followers",
    stat2: "10 Eventi",
    userData: userProfile 
  } : undefined;

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">
        
        <AccessoInfoProfilo {...profileProps} onUpdate={loadUserData} />
        
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
                      Richiedi affiliazione
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
                  // --- LISTA RACCOLTE DINAMICA ---
                  <div className="raccolte-list-container">
                    {loadingRaccolte ? (
                      <p>Caricamento raccolte...</p>
                    ) : raccolteList.length > 0 ? (
                      raccolteList.map((raccolta) => (
                        <RaccoltaFondiCard 
                          key={raccolta.id_raccolta}
                          {...raccolta} 
                        />
                      ))
                    ) : (
                      <div className="placeholder-content">
                         <p>Nessuna raccolta fondi attiva.</p>
                         {isOwner && <p style={{fontSize:'0.8rem'}}>Clicca "Crea Raccolta" per iniziare.</p>}
                      </div>
                    )}
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
        <ModalWrapper onClose={handleCloseRaccoltaModal}>
          {/* Assumiamo che AddRaccoltaFondi chiami onClose quando ha finito */}
          <AddRaccoltaFondi onClose={handleCloseRaccoltaModal} isModal={true} />
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