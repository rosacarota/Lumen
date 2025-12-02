import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

// Componenti
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import AddEvento from '../components/AddEvento.jsx'; 
import ModifyEvento from '../components/ModifyEvento.jsx'; 
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import Footer from '../components/Footer.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import EventCard from '../components/EventCard.jsx';
import EventCardEnte from '../components/EventCardEnte.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx'; 

// Servizi
import { fetchUserProfile } from '../services/UserServices.js';
import { getCronologiaEventi, rimuoviEvento } from '../services/EventoService.js'; 
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';
// import { getStorieEnte } from '../services/StoriaService.js'; 

import '../stylesheets/ProfiloEnte.css';

const ProfiloEnte = () => {
  const { id } = useParams();
  
  // --- STATI UTENTE ---
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(false);
  
  // --- STATI MODALI ---
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [showAddEventoModal, setShowAddEventoModal] = useState(false);
  const [showModifyEventoModal, setShowModifyEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  
  // Stato Modifica Evento
  const [eventoDaModificare, setEventoDaModificare] = useState(null);

  // --- STATI TABS E LISTE ---
  const [activeTab, setActiveTab] = useState('futuri');       // Tab Eventi
  const [activeSideTab, setActiveSideTab] = useState('storie'); // Tab Sidebar: 'storie' o 'raccolte'

  const [eventiList, setEventiList] = useState([]);
  const [raccolteList, setRaccolteList] = useState([]);
  const [storieList, setStorieList] = useState([]); // Lista Storie

  // --- LOADING ---
  const [loadingEventi, setLoadingEventi] = useState(false);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);
  const [loadingStorie, setLoadingStorie] = useState(false);

  // 1. CARICAMENTO UTENTE
  const loadUserData = async () => {
    try {
      const myProfile = await fetchUserProfile();
      if (myProfile?.ruolo === 'Volontario') setIsVolunteer(true);

      if (!id || (myProfile && String(myProfile.id) === String(id))) {
          setUserProfile(myProfile);
          setIsOwner(true); 
          return myProfile;
      } else {
          setIsOwner(false);
          return null; 
      }
    } catch (error) { console.error(error); return null; }
  };

  // 2. FETCH DATI
  const loadEventi = async (profileData = userProfile) => {
    setLoadingEventi(true);
    try {
        let stato = activeTab === 'corso' ? 'IN_CORSO' : (activeTab === 'svolti' ? 'TERMINATO' : 'PROGRAMMATO');
        const data = await getCronologiaEventi(stato);
        const mapped = Array.isArray(data) ? data.map(ev => ({
            id_evento: ev.id || ev.idEvento,
            titolo: ev.titolo,
            descrizione: ev.descrizione,
            luogo: ev.indirizzo ? `${ev.indirizzo.citta}, ${ev.indirizzo.strada}` : (ev.luogo || "N/D"),
            data_inizio: ev.dataInizio,
            data_fine: ev.dataFine,
            maxpartecipanti: ev.maxPartecipanti,
            immagine: ev.immagine,
            ente: ev.enteNome || profileData?.nome || "Ente",
            rawData: ev 
        })) : [];
        setEventiList(mapped);
    } catch (e) { console.error(e); setEventiList([]); } 
    finally { setLoadingEventi(false); }
  };

  const loadRaccolte = async (profileData) => {
    if(!profileData) return;
    setLoadingRaccolte(true);
    try {
        const responseData = await getRaccolteDiEnte(); 
        const listaVera = Array.isArray(responseData) ? responseData : (responseData.content || []);
        const mapped = listaVera.map(item => ({
            ...item,
            id_raccolta: item.id || item.idRaccolta || item.idRaccoltaFondi,
            ente: profileData.nome
        }));
        setRaccolteList(mapped);
    } catch(e) { console.error(e); } 
    finally { setLoadingRaccolte(false); }
  };

  const loadStorie = async (profileData) => {
    if(!profileData) return;
    setLoadingStorie(true);
    try {
        // TODO: Sostituire con API reale await getStorieEnte(profileData.id);
        const mockStorie = [
            { id: 1, titolo: "Grazie a tutti!", contenuto: "La raccolta è andata benissimo...", data: "2023-11-05" },
            { id: 2, titolo: "Nuovo Inizio", contenuto: "Abbiamo aperto la nuova sede.", data: "2023-10-20" }
        ];
        setStorieList(mockStorie);
    } catch (e) { console.error(e); } 
    finally { setLoadingStorie(false); }
  };

  // 3. EFFETTI
  useEffect(() => {
    const init = async () => {
      const profile = await loadUserData();
      if (profile) {
          await loadEventi(profile);
          await loadRaccolte(profile);
          await loadStorie(profile);
      }
    };
    init();
  }, [id]);

  useEffect(() => { if (userProfile) loadEventi(userProfile); }, [activeTab]);

  // 4. HANDLERS
  const handleDeleteEvento = async (idEvento) => {
    const res = await Swal.fire({ title: 'Eliminare?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
        await rimuoviEvento(idEvento);
        loadEventi(userProfile);
        Swal.fire('Eliminato', '', 'success');
    }
  };

  const handleTerminateRaccolta = async (idRaccolta) => {
    const raccolta = raccolteList.find(r => r.id_raccolta === idRaccolta);
    if(!raccolta) return;
    const res = await Swal.fire({ title: 'Terminare?', text: raccolta.titolo, icon: 'warning', showCancelButton: true });
    if(res.isConfirmed) {
        await terminaRaccolta({...raccolta, enteObj: userProfile});
        loadRaccolte(userProfile);
        Swal.fire('Terminata', '', 'success');
    }
  };

  const handleOpenModify = (ev) => {
      setEventoDaModificare(ev);
      setShowModifyEventoModal(true);
  };

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">
        <AccessoInfoProfilo userData={userProfile} isOwner={isOwner} onUpdate={loadUserData} />
        
        <section className="event-section">
          {/* HEADER TABS & ACTIONS */}
          <div className="controll">
            <div className="tabs-left">
              <button className={activeTab === 'corso' ? 'active' : ''} onClick={() => setActiveTab('corso')}>IN CORSO</button>
              <button className={activeTab === 'futuri' ? 'active' : ''} onClick={() => setActiveTab('futuri')}>FUTURI</button>
              <button className={activeTab === 'svolti' ? 'active' : ''} onClick={() => setActiveTab('svolti')}>SVOLTI</button>
            </div>
            
            <div className="actions-right">
              {isOwner ? (
                <>
                  <button className="btn-action" onClick={() => setShowAddEventoModal(true)}>CREA EVENTO</button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>CREA RACCOLTA</button>
                  {/* NOTA: Tasto "CREA STORIA" Rimosso come richiesto */}
                </>
              ) : (
                <>
                  {isVolunteer && <button className="btn-action btn-affiliation" onClick={() => setShowAffiliazioneModal(true)}>Richiedi affiliazione</button>}
                </>
              )}
            </div>
          </div>

          <div className="split-layout">
            {/* SINISTRA: EVENTI */}
            <div className="left-column">
              <div className="event-grid">
                {loadingEventi ? <p>Caricamento...</p> : eventiList.length === 0 ? <p>Nessun evento.</p> : 
                    eventiList.map(ev => (
                        isOwner ? 
                        <EventCardEnte key={ev.id_evento} {...ev} eventData={ev.rawData} onElimina={handleDeleteEvento} onModifica={handleOpenModify} /> 
                        : <EventCard key={ev.id_evento} {...ev} showParticipate={true} />
                    ))
                }
              </div>
            </div>

            {/* DESTRA: SIDEBAR CON TABS */}
            <div className="right-column">
               <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
               </div>

               <div className="sidebar-content">
                 {/* TAB STORIE */}
                 {activeSideTab === 'storie' && (
                    <div className="storie-list">
                        {loadingStorie ? <p>Caricamento...</p> : storieList.length > 0 ? (
                            storieList.map(storia => (
                                <div key={storia.id} className="card-sidebar-generic" style={{borderBottom:'1px solid #eee', padding:'15px 0'}}>
                                    <h4 style={{margin:'0 0 5px 0', color:'#087886'}}>{storia.titolo}</h4>
                                    <p style={{fontSize:'0.9rem', color:'#555', margin:'0 0 5px 0'}}>{storia.contenuto}</p>
                                    <small style={{color:'#999'}}>{storia.data}</small>
                                </div>
                            ))
                        ) : <p className="placeholder-text">Nessuna storia.</p>}
                    </div>
                 )}

                 {/* TAB RACCOLTE */}
                 {activeSideTab === 'raccolte' && (
                    <div className="raccolte-list">
                        {loadingRaccolte ? <p>Caricamento...</p> : raccolteList.length > 0 ? (
                            raccolteList.map(r => (
                                <RaccoltaFondiCard key={r.id_raccolta} {...r} isOwner={isOwner} onTerminate={handleTerminateRaccolta} />
                            ))
                        ) : <p className="placeholder-text">Nessuna raccolta.</p>}
                    </div>
                 )}
               </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      
      {/* MODALI */}
      {isOwner && showAddEventoModal && <AddEvento onBack={() => setShowAddEventoModal(false)} onSubmit={() => {setShowAddEventoModal(false); loadEventi(userProfile);}} isModal={true} enteId={userProfile?.id} />}
      
      {isOwner && showModifyEventoModal && <ModifyEvento isOpen={showModifyEventoModal} onClose={() => {setShowModifyEventoModal(false); setEventoDaModificare(null);}} eventToEdit={eventoDaModificare} onUpdate={() => loadEventi(userProfile)} />}
      
      {/* ADD RACCOLTA: Passiamo enteLogged per sicurezza */}
      {isOwner && showRaccoltaModal && (
          <div className="custom-modal-wrapper" onClick={() => setShowRaccoltaModal(false)}>
            <div onClick={e => e.stopPropagation()}>
                <AddRaccoltaFondi enteLogged={userProfile} onClose={() => {setShowRaccoltaModal(false); loadRaccolte(userProfile);}} isModal={true} />
            </div>
          </div>
      )}

      {!isOwner && showAffiliazioneModal && <div className="custom-modal-wrapper" onClick={() => setShowAffiliazioneModal(false)}><div onClick={e => e.stopPropagation()}><RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={userProfile?.email} /></div></div>}
    </div>
  );
};

export default ProfiloEnte;