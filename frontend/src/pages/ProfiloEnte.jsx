import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

// Componenti
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import AddEvento from '../components/AddEvento.jsx'; 
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import Footer from '../components/Footer.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';
import EventCard from '../components/EventCard.jsx';
import EventCardEnte from '../components/EventCardEnte.jsx';

// Servizi
import { fetchUserProfile } from '../services/UserServices.js';
import AffiliazioneService from '../services/AffiliazioneService.js';
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';
import { getCronologiaEventi } from '../services/EventoService.js'; 

import '../stylesheets/ProfiloEnte.css';

// --- CONFIGURAZIONE STILI ---
const THEME_COLORS = {
  primary: '#087886', 
  secondary: '#4AAFB8', 
  text: '#1A2B3C',    
  danger: '#d33',     
  bg: '#ffffff'       
};

// Configurazione SweetAlert2
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

// --- ModalWrapper ---
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
  
  // Stati
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // NOTA: isVolunteer dovrebbe essere settato controllando il ruolo dell'utente loggato.
  // Per ora lo inizializziamo a true per farti vedere il bottone affiliazione.
  const [isVolunteer, setIsVolunteer] = useState(true); 
  
  // Modali
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  
  // Tabs e Dati
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  
  // Liste Dati
  const [raccolteList, setRaccolteList] = useState([]);
  const [eventiList, setEventiList] = useState([]);
  
  // Loading
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);
  const [loadingEventi, setLoadingEventi] = useState(false);

  // --- Verifica Proprietario ---
  const checkOwnership = (profileData) => {
    const token = localStorage.getItem('token');
    if (!token || !profileData) return false;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        const loggedInEmail = payload.sub; 

        return loggedInEmail === profileData.email;
    } catch (error) {
        console.error("Errore verifica token:", error);
        return false;
    }
  };

  // 1. Caricamento Profilo Ente
  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile(); 
      setUserProfile(data);

      const ownerStatus = checkOwnership(data);
      setIsOwner(ownerStatus);
      
      return data; 
    } catch (error) {
      console.error("Errore caricamento profilo:", error);
      return null;
    }
  };

  // 2. Caricamento Eventi
  const loadEventi = async (profileData = userProfile) => {
    setLoadingEventi(true);
    try {
        let statoBackend = 'PROGRAMMATO';
        if (activeTab === 'corso') statoBackend = 'IN_CORSO';
        if (activeTab === 'svolti') statoBackend = 'TERMINATO';

        const data = await getCronologiaEventi(statoBackend);
        
        const mappedEventi = Array.isArray(data) ? data.map(ev => ({
            id_evento: ev.id || ev.idEvento,
            titolo: ev.titolo,
            descrizione: ev.descrizione,
            luogo: ev.indirizzo ? `${ev.indirizzo.citta}, ${ev.indirizzo.strada}` : (ev.luogo || "Luogo da definire"),
            data_inizio: ev.dataInizio,
            data_fine: ev.dataFine,
            maxpartecipanti: ev.maxPartecipanti,
            immagine: ev.immagine,
            ente: ev.enteNome || profileData?.nome || "Nome Ente"
        })) : [];

        setEventiList(mappedEventi);
    } catch (error) {
        console.error("Errore caricamento eventi:", error);
        setEventiList([]);
    } finally {
        setLoadingEventi(false);
    }
  };

  // 3. Caricamento Raccolte
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
    } catch (error) { console.error(error); } finally { setLoadingRaccolte(false); }
  };

  // Init
  useEffect(() => {
    const init = async () => {
      const profile = await loadUserData();
      if (profile) {
          await loadRaccolte(profile);
          await loadEventi(profile);
      }
    };
    init();
  }, [id]);

  // Reload Eventi al cambio Tab
  useEffect(() => {
    if (userProfile) loadEventi(userProfile);
  }, [activeTab]);

  // Handlers
  const handleTerminate = async (idRaccolta) => {
    const raccoltaCompleta = raccolteList.find(r => r.id_raccolta === idRaccolta);
    if(!raccoltaCompleta) return;
    
    const result = await MySwal.fire({
      title: 'Terminare la raccolta?',
      text: `Sei sicuro di voler chiudere "${raccoltaCompleta.titolo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, termina',
      cancelButtonText: 'Annulla'
    });

    if (result.isConfirmed) {
        await terminaRaccolta({ ...raccoltaCompleta, enteObj: userProfile });
        MySwal.fire('Successo', 'Raccolta terminata.', 'success');
        loadRaccolte(userProfile);
    }
  };

  const handleEventoSucceess = () => {
      setShowEventoModal(false);
      MySwal.fire('Successo', 'Evento creato!', 'success');
      loadEventi(userProfile);
  };

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">
        
        {/* Info Profilo (con tasto Modifica se Owner) */}
        <AccessoInfoProfilo 
            userData={userProfile} 
            onUpdate={loadUserData} 
        />
        
        <section className="event-section">
          <div className="controll">
            <div className="tabs-left">
              <button className={activeTab === 'corso' ? 'active' : ''} onClick={() => setActiveTab('corso')}>IN CORSO</button>
              <button className={activeTab === 'futuri' ? 'active' : ''} onClick={() => setActiveTab('futuri')}>FUTURI</button>
              <button className={activeTab === 'svolti' ? 'active' : ''} onClick={() => setActiveTab('svolti')}>SVOLTI</button>
            </div>
            
            {/* LOGICA BOTTONI HEADER (Senza Segui) */}
            <div className="actions-right">
              {isOwner ? (
                /* VISTA PROPRIETARIO */
                <>
                  <button className="btn-action" onClick={() => setShowEventoModal(true)}>CREA EVENTO</button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>CREA RACCOLTA FONDI</button>
                </>
              ) : (
                /* VISTA VISITATORE (Solo Affiliazione se volontario) */
                <>
                  {isVolunteer && (
                    <button className="btn-action btn-affiliation" onClick={() => setShowAffiliazioneModal(true)}>
                      Richiedi affiliazione
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="split-layout">
            
            {/* COLONNA SINISTRA (EVENTI) */}
            <div className="left-column">
              <div className="event-grid">
                {loadingEventi ? (
                    <div style={{display:'flex', justifyContent:'center', padding:'20px'}}>
                        <p>Caricamento eventi...</p>
                    </div>
                ) : eventiList.length === 0 ? (
                    <p style={{margin: 'auto', color: '#666'}}>Nessun evento {activeTab} trovato.</p>
                ) : (
                    eventiList.map((evento) => (
                        /* LOGICA CARD EVENTO */
                        isOwner ? (
                            /* Ente vede: Card con Modifica/Elimina */
                            <EventCardEnte 
                                key={evento.id_evento} 
                                {...evento} 
                            />
                        ) : (
                            /* Utente vede: Card con Partecipa/Dettagli */
                            <EventCard 
                                key={evento.id_evento} 
                                {...evento} 
                                showParticipate={true} 
                            />
                        )
                    ))
                )}
              </div>
            </div>

            {/* COLONNA DESTRA (SIDEBAR) */}
            <div className="right-column">
              <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
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
                        <div className="placeholder-content"><p>Nessuna raccolta attiva.</p></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      
      {/* MODALI - Owner */}
      {isOwner && showEventoModal && (
        <AddEvento 
            onBack={() => setShowEventoModal(false)} 
            onSubmit={handleEventoSucceess} 
            isModal={true} 
            enteId={userProfile?.id}
        />
      )}

      {isOwner && showRaccoltaModal && (
        <ModalWrapper onClose={() => setShowRaccoltaModal(false)}>
            <AddRaccoltaFondi onClose={() => setShowRaccoltaModal(false)} isModal={true} />
        </ModalWrapper>
      )}

      {/* MODALE - Visitatore */}
      {!isOwner && showAffiliazioneModal && (
        <ModalWrapper onClose={() => setShowAffiliazioneModal(false)}>
            <RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={userProfile?.email} />
        </ModalWrapper>
      )}
    </div>
  );
};

export default ProfiloEnte;