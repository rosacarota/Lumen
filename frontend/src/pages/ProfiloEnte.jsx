import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 1. IMPORT DI SWEETALERT2
import Swal from 'sweetalert2';

// Componenti
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import AddEvento from '../components/AddEvento.jsx'; // Make sure this path is correct
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import Footer from '../components/Footer.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';

// Servizi
import { fetchUserProfile } from '../services/UserServices.js';
import AffiliazioneService from '../services/AffiliazioneService.js';
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';

// Stili
import '../stylesheets/ProfiloEnte.css';

// --- CONFIGURAZIONE STILI E COLORI ---
const THEME_COLORS = {
  primary: '#087886', 
  secondary: '#4AAFB8', 
  text: '#1A2B3C',    
  danger: '#d33',     
  bg: '#ffffff'       
};

// Configurazione base per SweetAlert2
const MySwal = Swal.mixin({
  customClass: {
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    content: 'custom-swal-content'
  },
  background: THEME_COLORS.bg,
  color: THEME_COLORS.text,
  buttonsStyling: true 
});


// --- ModalWrapper (Used for other modals like RaccoltaFondi) ---
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

// --- Componente Principale ---
const ProfiloEnte = () => {
  const { id } = useParams();
  
  // Stati Utente
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  
  // Stati UI
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  
  // Dati
  const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });
  const [raccolteList, setRaccolteList] = useState([]);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);

  // 1. Caricamento Dati Utente
  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile();
      setUserProfile(data);
      setIsOwner(true); 
      return data; 
    } catch (error) {
      console.error("Errore caricamento profilo:", error);
      return null;
    }
  };

  // 2. Caricamento Raccolte
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
         ente: item.enteNome || profileData?.nome || "Nome Ente"
      }));

      setRaccolteList(mappedData);
    } catch (error) {
      console.error("Errore caricamento raccolte:", error);
    } finally {
      setLoadingRaccolte(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const profile = await loadUserData();
      await loadRaccolte(profile);
    };
    init();
  }, [id]);

  // 3. GESTIONE TERMINA CON STYLE CUSTOM
  const handleTerminate = async (idRaccolta) => {
    if (!idRaccolta) return;

    const raccoltaCompleta = raccolteList.find(r => r.id_raccolta === idRaccolta);
    
    if (!raccoltaCompleta) {
      return MySwal.fire({
        icon: 'error',
        title: 'Errore',
        text: 'Dati della raccolta non trovati.',
        confirmButtonColor: THEME_COLORS.primary
      });
    }

    if (!userProfile) {
      return MySwal.fire({
        icon: 'error',
        title: 'Errore',
        text: 'Profilo ente non caricato.',
        confirmButtonColor: THEME_COLORS.primary
      });
    }

    // Popup di conferma STILIZZATO
    const result = await MySwal.fire({
      title: 'Terminare la raccolta?',
      text: `Sei sicuro di voler chiudere anticipatamente "${raccoltaCompleta.titolo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: THEME_COLORS.danger,   
      cancelButtonColor: THEME_COLORS.primary,   
      confirmButtonText: 'Sì, termina',
      cancelButtonText: 'Annulla',
      reverseButtons: true 
    });

    if (!result.isConfirmed) return;

    try {
      const datiPerIlBackend = {
        ...raccoltaCompleta,
        enteObj: userProfile 
      };

      await terminaRaccolta(datiPerIlBackend);
      
      // Popup Successo STILIZZATO
      await MySwal.fire({
        icon: 'success',
        title: 'Terminata!',
        text: 'La raccolta fondi è stata chiusa correttamente.',
        confirmButtonColor: THEME_COLORS.primary 
      });
      
      await loadRaccolte(userProfile);
      
    } catch (error) {
      console.error("Errore terminazione:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Errore!',
        text: error.message || "Impossibile terminare la raccolta.",
        confirmButtonColor: THEME_COLORS.primary
      });
    }
  };

  // 4. Handlers UI
  const handleFollowClick = () => setIsFollowing(!isFollowing);
  
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRichiestaAffiliazione = async () => {
    const token = localStorage.getItem('token');
    const emailEnte = userProfile?.email;
    
    if (!emailEnte) {
        return MySwal.fire('Errore', "Impossibile recuperare l'email dell'ente.", 'error');
    }

    try {
      const isAffiliated = await AffiliazioneService.checkAffiliazione(emailEnte, token);
      if (isAffiliated) {
        MySwal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Hai già un ente affiliato.',
          confirmButtonColor: THEME_COLORS.primary
        });
      } else {
        setShowAffiliazioneModal(true);
      }
    } catch (error) { 
        console.error(error);
        MySwal.fire('Errore', 'Errore durante la verifica affiliazione.', 'error');
    }
  };

  const handleCloseRaccoltaModal = () => {
    setShowRaccoltaModal(false);
    loadRaccolte(userProfile); 
  };

  // --- Handler per Evento ---
  const handleCloseEventoModal = () => {
    setShowEventoModal(false);
    // Qui potresti ricaricare la lista eventi se necessario
  };

  const handleSubmitEvento = (nuovoEvento) => {
      
  };


  const profileProps = userProfile ? {
    title: userProfile.nome || "Nome Ente",
    subtitle: "ENTE",
    description: userProfile.descrizione || "Nessuna descrizione",
    stat1: "123 Followers",
    stat2: "10 Eventi",
    userData: userProfile 
  } : undefined;

  // --- Render JSX ---
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
            {/* Colonna Sinistra */}
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

            {/* Colonna Destra (Sidebar) */}
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
                          onTerminate={handleTerminate} // Passaggio funzione al figlio
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
      
      {/* Modali */}
      
      {/* MODAL EVENTO: Renderizzato direttamente senza ModalWrapper perché ha il suo overlay */}
      {showEventoModal && (
        <AddEvento 
            onBack={handleCloseEventoModal} 
            onSubmit={handleSubmitEvento}
            isModal={true} 
            enteId={userProfile?.id} // Passa l'ID dell'ente se serve
        />
      )}

      {showRaccoltaModal && <ModalWrapper onClose={handleCloseRaccoltaModal}><AddRaccoltaFondi onClose={handleCloseRaccoltaModal} isModal={true} /></ModalWrapper>}
      {showAffiliazioneModal && <ModalWrapper onClose={() => setShowAffiliazioneModal(false)}><RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={userProfile?.email} /></ModalWrapper>}
    </div>
  );
};

export default ProfiloEnte;