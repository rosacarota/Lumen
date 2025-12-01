import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

// COMPONENTI
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import Footer from '../components/Footer.jsx';

// Card
import EventCard from '../components/EventCard.jsx';
import EventCardEnte from '../components/EventCardEnte.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';

// Modali e Form
import AddEvento from '../components/AddEvento.jsx'; 
import ModifyEvento from '../components/ModifyEvento.jsx'; 
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';

// SERVIZI
import { fetchUserProfile } from '../services/UserServices.js';
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';
// AGGIUNTO 'rimuoviEvento' all'import
import { getCronologiaEventi, rimuoviEvento } from '../services/EventoService.js'; 
import { fetchEvents } from '../services/PartecipazioneEventoService.js';

import '../stylesheets/ProfiloEnte.css';

const THEME_COLORS = { primary: '#087886', secondary: '#4AAFB8', bg: '#ffffff', danger: '#d33' };

const MySwal = Swal.mixin({ 
  customClass: { popup: 'custom-swal-popup' },
  buttonsStyling: true
});

const ModalWrapper = ({ children, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div onClick={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', cursor: 'pointer' }} />
    <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'white', borderRadius: '12px', padding: '20px', width: '90%', maxWidth: '900px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', zIndex:20, color:'#666' }}>&times;</button>
      {children}
    </div>
  </div>
);

const ProfiloEnte = () => {
  const { id } = useParams();
  
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false); 
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null); 
  
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);

  const [activeTab, setActiveTab] = useState('futuri'); 
  const [activeSideTab, setActiveSideTab] = useState('storie'); 
  
  const [eventsList, setEventsList] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [raccolteList, setRaccolteList] = useState([]);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);

  // 1. CARICAMENTO DATI UTENTE
  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile();
      if (data) {
        setUserProfile(data);
        if (!id || parseInt(id) === data.id) {
           setIsOwner(true);
        }
      }
      return data;
    } catch (error) {
      console.error("Errore profilo:", error);
      return null;
    }
  };

  // 2. CARICAMENTO EVENTI
  const loadEvents = async () => {
    setLoadingEvents(true);
    setEventsList([]);
    try {
      let rawData = [];
      if (isOwner) {
        rawData = await getCronologiaEventi(null);
      } else {
        const allEvents = await fetchEvents();
        if (Array.isArray(allEvents)) {
           const targetId = userProfile?.id;
           rawData = allEvents.filter(e => e.ente && e.ente.id === targetId);
        }
      }

      const safeArray = Array.isArray(rawData) ? rawData : [];

      const mapped = safeArray.map(evt => {
        let luogo = "Da definire";
        if (evt.indirizzo) {
            luogo = `${evt.indirizzo.citta || ''} (${evt.indirizzo.provincia || ''})`;
        }

        return {
          id_evento: evt.idEvento || evt.id,
          titolo: evt.titolo || "Senza Titolo",
          descrizione: evt.descrizione || "",
          data_inizio: evt.dataInizio,
          data_fine: evt.dataFine,
          maxpartecipanti: evt.maxPartecipanti,
          immagine: evt.immagine,
          ente: evt.ente?.nome || "Ente",
          luogo: luogo,
          eventData: evt 
        };
      });

      setEventsList(mapped);
    } catch (e) {
      console.error("Errore loadEvents:", e);
    } finally {
      setLoadingEvents(false);
    }
  };

  // 3. CARICAMENTO RACCOLTE
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

  useEffect(() => {
    if (userProfile) loadEvents();
  }, [userProfile, isOwner, activeTab]); 


  // --- HANDLER MODIFICA ---
  const handleOpenModify = (eventData) => {
    setSelectedEventForEdit(eventData);
    setShowModifyModal(true);
  };

  const handleModifySuccess = () => {
    setShowModifyModal(false);
    setSelectedEventForEdit(null);
    MySwal.fire('Successo', 'L\'evento è stato modificato correttamente.', 'success');
    loadEvents(); 
  };

  // --- HANDLER ELIMINA (NUOVO) ---
  const handleDeleteEvento = async (idEvento) => {
      // 1. Chiedi conferma
      const result = await MySwal.fire({
          title: 'Sei sicuro?',
          text: "L'evento verrà eliminato definitivamente. Non potrai tornare indietro.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: THEME_COLORS.danger,
          cancelButtonColor: THEME_COLORS.primary,
          confirmButtonText: 'Sì, elimina',
          cancelButtonText: 'Annulla'
      });

      // 2. Se confermato, chiama il service
      if (result.isConfirmed) {
          try {
              await rimuoviEvento(idEvento);
              
              await MySwal.fire(
                  'Eliminato!',
                  'L\'evento è stato rimosso.',
                  'success'
              );
              
              // 3. Ricarica la lista
              loadEvents();

          } catch (error) {
              console.error(error);
              MySwal.fire(
                  'Errore!',
                  'Non è stato possibile eliminare l\'evento.',
                  'error'
              );
          }
      }
  };

  // --- ALTRI HANDLER ---
  const handleSuccessEvento = () => {
    setShowEventoModal(false);
    loadEvents();
    MySwal.fire('Ottimo!', 'Il tuo evento è stato pubblicato.', 'success');
  };

  const handleTerminateRaccolta = async (idRaccolta) => {
      const confirm = await MySwal.fire({
          title: 'Sei sicuro?',
          text: "Vuoi terminare questa raccolta fondi anticipatamente?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: THEME_COLORS.danger,
          confirmButtonText: 'Sì, termina'
      });
      if(confirm.isConfirmed) {
         try {
             await terminaRaccolta({ id: idRaccolta, enteObj: userProfile }); 
             MySwal.fire('Terminata!', 'La raccolta è stata chiusa.', 'success');
             loadRaccolte(userProfile);
         } catch(e) {
             MySwal.fire('Errore', 'Impossibile terminare la raccolta.', 'error');
         }
      }
  };

  const handleFollowClick = () => setIsFollowing(!isFollowing);
  const handleRichiestaAffiliazione = () => { if(userProfile?.email) setShowAffiliazioneModal(true); };
  const handleCloseRaccoltaModal = () => { setShowRaccoltaModal(false); loadRaccolte(userProfile); };

  const profileProps = userProfile ? {
    title: userProfile.nome || "Ente",
    subtitle: "ENTE",
    description: userProfile.descrizione || "Nessuna descrizione disponibile.",
    stat1: "123 Followers", 
    stat2: `${eventsList.length} Eventi`,
    userData: userProfile
  } : null;

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">
        
        {profileProps && <AccessoInfoProfilo {...profileProps} onUpdate={loadUserData} />}
        
        <section className="event-section">
          <div className="controll">
            <div className="tabs-left">
              {['corso', 'futuri', 'svolti'].map(t => (
                  <button key={t} className={activeTab === t ? 'active' : ''} onClick={() => setActiveTab(t)}>
                    {t.toUpperCase()}
                  </button>
              ))}
            </div>
            <div className="actions-right">
              {isOwner ? (
                <>
                  <button className="btn-action" onClick={() => setShowEventoModal(true)}>Crea Evento</button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>Crea Raccolta</button>
                </>
              ) : (
                <>
                   <button className="btn-action" onClick={handleFollowClick}>
                     {isFollowing ? 'SEGUITO' : 'SEGUI'}
                   </button>
                   <button className="btn-action btn-affiliation" onClick={handleRichiestaAffiliazione}>Richiedi affiliazione</button>
                </>
              )}
            </div>
          </div>

          <div className="split-layout">
            <div className="left-column">
              <div className="event-grid">
                {loadingEvents ? <p style={{padding:'20px', textAlign:'center'}}>Caricamento eventi...</p> : eventsList.length > 0 ? (
                    eventsList.map(evt => (
                        isOwner ? (
                            <EventCardEnte 
                                key={evt.id_evento} 
                                {...evt} 
                                eventData={evt.eventData} 
                                onModifica={handleOpenModify} 
                                // Qui colleghiamo la funzione di eliminazione vera
                                onElimina={handleDeleteEvento} 
                            />
                        ) : (
                            <EventCard key={evt.id_evento} {...evt} showParticipate={false} />
                        )
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding:'20px' }}>Nessun evento trovato in questa categoria.</p>
                )}
              </div>
            </div>

            <div className="right-column">
              <div className="sidebar-header">
                 <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                 <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
              </div>
              
              <div className="sidebar-content">
                 {activeSideTab === 'storie' && (
                    <div className="placeholder-content">
                        <div className="story-circle"></div>
                        <p>Nessuna storia recente.</p>
                    </div>
                 )}
                 {activeSideTab === 'raccolte' && (
                    <div className="raccolte-list-container">
                        {loadingRaccolte ? <p>Caricamento...</p> : raccolteList.length > 0 ? (
                            raccolteList.map((r, idx) => (
                                <RaccoltaFondiCard 
                                    key={r.id_raccolta || idx} 
                                    {...r} 
                                    isOwner={isOwner}
                                    onTerminate={handleTerminateRaccolta}
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
      
      {/* MODALI */}
      {showEventoModal && (
        <AddEvento isModal={true} onBack={() => setShowEventoModal(false)} onSubmit={handleSuccessEvento} enteId={userProfile?.id} />
      )}

      {showModifyModal && selectedEventForEdit && (
        <ModalWrapper onClose={() => setShowModifyModal(false)}>
            <ModifyEvento isModal={true} initialData={selectedEventForEdit} onBack={() => setShowModifyModal(false)} onSubmit={handleModifySuccess} />
        </ModalWrapper>
      )}

      {showRaccoltaModal && (
        <ModalWrapper onClose={handleCloseRaccoltaModal}>
            <AddRaccoltaFondi onClose={handleCloseRaccoltaModal} isModal={true} />
        </ModalWrapper>
      )}

      {showAffiliazioneModal && (
        <ModalWrapper onClose={() => setShowAffiliazioneModal(false)}>
            <RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={userProfile?.email} />
        </ModalWrapper>
      )}
    </div>
  );
};

export default ProfiloEnte;