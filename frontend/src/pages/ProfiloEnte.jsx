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
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';

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
  const [userProfile, setUserProfile] = useState(null); // Contiene i dati dell'Ente
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);

  const [raccolteList, setRaccolteList] = useState([]);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);

  // 1. Carica Utente
  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile();
      setUserProfile(data);
      return data; 
    } catch (error) {
      console.error("Errore caricamento profilo:", error);
      return null;
    }
  };

  // 2. Carica Raccolte
  const loadRaccolte = async (profileData = userProfile) => {
    setLoadingRaccolte(true);
    try {
      const responseData = await getRaccolteDiEnte();
      const listaVera = Array.isArray(responseData) ? responseData : (responseData.content || []);

      const mappedData = listaVera.map(item => ({
         id_raccolta: item.id || item.idRaccolta || item.idRaccoltaFondi, 
         titolo: item.titolo,
         descrizione: item.descrizione,
         obiettivo: item.obiettivo,
         totale_raccolto: item.totaleRaccolto || 0,
         data_apertura: item.dataApertura,
         data_chiusura: item.dataChiusura,
         ente: profileData?.nome || "Nome Ente"
      }));

      setRaccolteList(mappedData);
    } catch (error) {
      console.error("Errore caricamento raccolte:", error);
    } finally {
      setLoadingRaccolte(false);
    }
  };

  // 3. GESTIONE TERMINA (Fix Frontend per soddisfare il Backend)
  const handleTerminate = async (idRaccolta) => {
    if (!idRaccolta) return alert("Errore ID");

    // Troviamo i dati della raccolta
    const raccoltaCompleta = raccolteList.find(r => r.id_raccolta === idRaccolta);
    if (!raccoltaCompleta) return alert("Dati mancanti.");

    // Se userProfile non è caricato, non possiamo terminare perché serve l'Ente
    if (!userProfile) return alert("Profilo ente non caricato, impossibile terminare.");

    const confirm = window.confirm(`Vuoi terminare: "${raccoltaCompleta.titolo}"?`);
    if (!confirm) return;

    try {
      // PREPARIAMO IL PACCHETTO COMPLETO
      // Uniamo i dati della raccolta con i dati dell'utente (Ente)
      const datiPerIlBackend = {
        ...raccoltaCompleta,
        enteObj: userProfile // Passiamo tutto il profilo utente come "ente"
      };

      await terminaRaccolta(datiPerIlBackend);
      
      alert("Raccolta terminata con successo.");
      loadRaccolte(userProfile);
    } catch (error) {
      console.error("Errore terminazione:", error);
      alert("Errore: " + error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsOwner(true); 
      const profile = await loadUserData();
      await loadRaccolte(profile);
    };
    init();
  }, [id]);

  const handleFollowClick = () => setIsFollowing(!isFollowing);
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleRichiestaAffiliazione = async () => {
    const token = localStorage.getItem('token');
    const emailEnte = userProfile?.email;
    if (!emailEnte) return alert("Impossibile recuperare l'email.");
    try {
      const isAffiliated = await AffiliazioneService.checkAffiliazione(emailEnte, token);
      if (isAffiliated) alert("Hai già un ente affiliato.");
      else setShowAffiliazioneModal(true);
    } catch (error) { console.error(error); }
  };
  const handleCloseRaccoltaModal = () => {
    setShowRaccoltaModal(false);
    loadRaccolte(userProfile); 
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
                  <button className="btn-action" onClick={() => setShowEventoModal(true)}>CREA EVENTO</button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>CREA RACCOLTA</button>
                </>
              ) : (
                <>
                  <button className="btn-action" onClick={handleFollowClick}>
                    {isFollowing ? 'SEGUITO' : 'SEGUI'}
                  </button>
                  {isVolunteer && <button className="btn-action btn-affiliation" onClick={handleRichiestaAffiliazione}>Richiedi affiliazione</button>}
                </>
              )}
            </div>
          </div>

          <div className="split-layout">
            <div className="left-column">
               <div className="event-search">
                <h3 className="search-title">CERCA</h3>
                <div className="search-inputs">
                  <div className="input-group"><label>DATA</label><input type="date" name="data" className="custom-input" onChange={handleFilterChange} /></div>
                  <div className="input-group"><label>ORARIO</label><input type="time" name="orario" className="custom-input" onChange={handleFilterChange} /></div>
                  <div className="input-group"><label>TIPO</label><select name="tipologia" className="custom-input" onChange={handleFilterChange}><option value="">Tutti</option><option value="conf">Conferenza</option></select></div>
                </div>
              </div>
              <div className="event-grid"><p>Nessun evento {activeTab} trovato.</p></div>
            </div>

            <div className="right-column">
              <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE</button>
              </div>
              <div className="sidebar-content">
                {activeSideTab === 'storie' ? (
                  <div className="placeholder-content"><div className="story-circle"></div><p>Nessuna storia recente.</p></div>
                ) : (
                  <div className="raccolte-list-container">
                    {loadingRaccolte ? <p>Caricamento...</p> : raccolteList.length > 0 ? (
                      raccolteList.map((raccolta, index) => (
                        <RaccoltaFondiCard 
                          key={raccolta.id_raccolta || index} 
                          {...raccolta}
                          isOwner={isOwner}
                          onTerminate={handleTerminate}
                        />
                      ))
                    ) : (
                      <div className="placeholder-content"><p>Nessuna raccolta.</p></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      {showEventoModal && <ModalWrapper onClose={() => setShowEventoModal(false)}><AddEvento onClose={() => setShowEventoModal(false)} isModal={true} /></ModalWrapper>}
      {showRaccoltaModal && <ModalWrapper onClose={handleCloseRaccoltaModal}><AddRaccoltaFondi onClose={handleCloseRaccoltaModal} isModal={true} /></ModalWrapper>}
      {showAffiliazioneModal && <ModalWrapper onClose={() => setShowAffiliazioneModal(false)}><RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={userProfile?.email} /></ModalWrapper>}
    </div>
  );
};

export default ProfiloEnte;