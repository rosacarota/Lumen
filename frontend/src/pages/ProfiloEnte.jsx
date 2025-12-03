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
import RichiestaServizio from '../components/RichiestaServizio.jsx'; 
import EventCard from '../components/EventCard.jsx';
import EventCardEnte from '../components/EventCardEnte.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx'; 

// Servizi
import { fetchUserProfile } from '../services/UserServices.js';
import { getCronologiaEventi, rimuoviEvento } from '../services/EventoService.js'; 
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';

import '../stylesheets/ProfiloEnte.css';

// --- Wrapper per i Modali ---
const ModalWrapper = ({ children, onClose }) => (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div onClick={onClose} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)'}} />
      <div style={{position: 'relative', zIndex: 10, backgroundColor: 'white', borderRadius: '12px', padding: '20px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
        <button onClick={onClose} style={{position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'}}>&times;</button>
        {children}
      </div>
    </div>
);

const ProfiloEnte = () => {
  const { id } = useParams();
  
  // --- STATI DATI ---
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // --- STATI RUOLI ---
  const [isEnte, setIsEnte] = useState(false);           // <--- FONDAMENTALE
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isBeneficiary, setIsBeneficiary] = useState(false); 
  
  // --- STATI MODALI ---
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [showServizioModal, setShowServizioModal] = useState(false);
  const [showAddEventoModal, setShowAddEventoModal] = useState(false);
  const [showModifyEventoModal, setShowModifyEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  
  const [eventoDaModificare, setEventoDaModificare] = useState(null);

  // --- STATI LISTE ---
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');
  const [eventiList, setEventiList] = useState([]);
  const [raccolteList, setRaccolteList] = useState([]);
  const [storieList, setStorieList] = useState([]); 
  const [loadingEventi, setLoadingEventi] = useState(false);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);
  const [loadingStorie, setLoadingStorie] = useState(false);

  // 1. CARICAMENTO DATI
  const loadData = async () => {
    try {
      const myData = await fetchUserProfile();
      setCurrentUser(myData);

      // A. RESETTIAMO I RUOLI PRIMA DI CONTROLLARE
      setIsEnte(false);
      setIsVolunteer(false);
      setIsBeneficiary(false);

      // B. CONTROLLO RUOLI (Case Insensitive)
      if (myData && myData.ruolo) {
          const ruolo = myData.ruolo.toLowerCase();
          
          if (ruolo === 'ente') setIsEnte(true);              // <--- Setto isEnte
          if (ruolo === 'volontario') setIsVolunteer(true);
          if (ruolo === 'beneficiario') setIsBeneficiary(true);
      }

      // C. CONTROLLO OWNER (Chi visita chi?)
      if (!id || (myData && String(myData.id) === String(id))) {
          // Sono sul MIO profilo
          setIsOwner(true);
          setProfileData(myData);
          return myData;
      } else {
          // Sono un VISITATORE
          setIsOwner(false);
          // TODO: Se avessi l'API getEnteById(id), la useresti qui:
          // const enteData = await getEnteById(id);
          // setProfileData(enteData);
          console.warn("Sei visitatore. Qui servirebbe caricare i dati dell'ente ID:", id);
          return null; 
      }
    } catch (error) { console.error(error); return null; }
  };

  // 2. FETCH DATI CONTENUTI
  const loadEventi = async (targetProfile) => {
    setLoadingEventi(true);
    try {
        let stato = activeTab === 'corso' ? 'IN_CORSO' : (activeTab === 'svolti' ? 'TERMINATO' : 'PROGRAMMATO');
        const data = await getCronologiaEventi(stato);
        const mapped = Array.isArray(data) ? data.map(ev => ({
            id_evento: ev.id || ev.idEvento,
            titolo: ev.titolo,
            descrizione: ev.descrizione,
            luogo: ev.indirizzo ? `${ev.indirizzo.citta}, ${ev.indirizzo.strada}` : (ev.luogo || "N/D"),
            dataInizio: ev.dataInizio, 
            data_inizio: ev.dataInizio,
            dataFine: ev.dataFine,
            maxpartecipanti: ev.maxPartecipanti,
            immagine: ev.immagine,
            ente: ev.enteNome || targetProfile?.nome || "Ente",
            rawData: ev 
        })) : [];
        setEventiList(mapped);
    } catch (e) { console.error(e); setEventiList([]); } 
    finally { setLoadingEventi(false); }
  };

  const loadRaccolte = async (targetProfile) => {
    if(!targetProfile) return;
    setLoadingRaccolte(true);
    try {
        const responseData = await getRaccolteDiEnte();
        const listaVera = Array.isArray(responseData) ? responseData : (responseData.content || []);
        const mapped = listaVera.map(item => ({
            ...item,
            id_raccolta: item.id || item.idRaccolta,
            ente: targetProfile.nome,
            data_apertura: item.dataApertura,
            data_chiusura: item.dataChiusura
        }));
        setRaccolteList(mapped);
    } catch(e) { console.error(e); } 
    finally { setLoadingRaccolte(false); }
  };

  const loadStorie = async (targetProfile) => {
    setLoadingStorie(true);
    setTimeout(() => {
        setStorieList([{ id: 1, titolo: "Benvenuti", contenuto: "Pagina ufficiale", data: "2024-01-01" }]);
        setLoadingStorie(false);
    }, 500);
  };

  // 3. EFFETTI
  useEffect(() => {
    const init = async () => {
      const profile = await loadData();
      const dataToLoad = profile || profileData; 
      if (dataToLoad || id) { 
          await loadEventi(dataToLoad);
          await loadRaccolte(dataToLoad);
          await loadStorie(dataToLoad);
      }
    };
    init();
  }, [id]);

  useEffect(() => { loadEventi(profileData); }, [activeTab]);

  // 4. HANDLERS
  const handleDeleteEvento = async (idEvento) => {
    const res = await Swal.fire({ title: 'Eliminare?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
        await rimuoviEvento(idEvento);
        loadEventi(profileData);
        Swal.fire('Eliminato', '', 'success');
    }
  };

  const handleTerminateRaccolta = async (idRaccolta) => {
    const raccolta = raccolteList.find(r => r.id_raccolta === idRaccolta);
    if(!raccolta) return;
    const res = await Swal.fire({ title: 'Terminare?', text: raccolta.titolo, icon: 'warning', showCancelButton: true });
    if(res.isConfirmed) {
        await terminaRaccolta({...raccolta, enteObj: profileData});
        loadRaccolte(profileData);
        Swal.fire('Terminata', '', 'success');
    }
  };

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">
        
        {/* Info Profilo */}
        <AccessoInfoProfilo userData={profileData} isOwner={isOwner} onUpdate={loadData} />
        
        <section className="event-section">
          {/* TABS & ACTIONS */}
          <div className="controll">
            <div className="tabs-left">
              <button className={activeTab === 'corso' ? 'active' : ''} onClick={() => setActiveTab('corso')}>IN CORSO</button>
              <button className={activeTab === 'futuri' ? 'active' : ''} onClick={() => setActiveTab('futuri')}>FUTURI</button>
              <button className={activeTab === 'svolti' ? 'active' : ''} onClick={() => setActiveTab('svolti')}>SVOLTI</button>
            </div>
            
            <div className="actions-right">
              
              {/* ------------------------------------------------------------- */}
              {/* QUI C'ERA L'ERRORE. ORA CONTROLLIAMO SIA OWNER CHE ENTE */}
              {/* ------------------------------------------------------------- */}
              
              {isOwner && isEnte ? (
                /* MOSTRA TASTI SOLO SE SONO OWNER **E** SONO UN ENTE */
                <>
                  <button className="btn-action" onClick={() => setShowAddEventoModal(true)}>CREA EVENTO</button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>CREA RACCOLTA FONDI</button>
                </>
              ) : (
                /* CASO VISITATORE (O BENEFICIARIO SUL PROPRIO PROFILO) */
                <>
                  {/* Se sono Volontario e NON è il mio profilo */}
                  {isVolunteer && isOwner && (
                    <button className="btn-action btn-affiliation" onClick={() => setShowAffiliazioneModal(true)}>
                        Richiedi affiliazione
                    </button>
                  )}

                  {/* Se sono Beneficiario e NON è il mio profilo */}
                  {isBeneficiary && isOwner && (
                    <button className="btn-action btn-affiliation" onClick={() => setShowServizioModal(true)}>
                        Richiedi Servizio
                    </button>
                  )}
                </>
              )}

            </div>
          </div>

          <div className="split-layout">
            <div className="left-column">
              <div className="event-grid">
                {loadingEventi ? <p>Caricamento...</p> : eventiList.length === 0 ? <p>Nessun evento.</p> : 
                    eventiList.map(ev => (
                        /* Anche le card possono essere modificate solo se Owner ED Ente */
                        (isOwner && isEnte) ? 
                        <EventCardEnte key={ev.id_evento} {...ev} eventData={ev.rawData} onElimina={handleDeleteEvento} onModifica={(e) => { setEventoDaModificare(e); setShowModifyEventoModal(true); }} /> 
                        : <EventCard key={ev.id_evento} {...ev} showParticipate={true} />
                    ))
                }
              </div>
            </div>

            <div className="right-column">
               <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
               </div>
               <div className="sidebar-content">
                 {activeSideTab === 'storie' && (
                    <div className="storie-list">
                        {storieList.map(storia => (
                             <div key={storia.id} className="card-sidebar-generic" style={{borderBottom:'1px solid #eee', padding:'15px 0'}}>
                                <h4 style={{margin:'0 0 5px 0', color:'#087886'}}>{storia.titolo}</h4>
                                <p style={{fontSize:'0.9rem', color:'#555'}}>{storia.contenuto}</p>
                            </div>
                        ))}
                    </div>
                 )}
                 {activeSideTab === 'raccolte' && (
                    <div className="raccolte-list">
                        {raccolteList.map(r => <RaccoltaFondiCard key={r.id_raccolta} {...r} isOwner={isOwner && isEnte} onTerminate={handleTerminateRaccolta} />)}
                    </div>
                 )}
               </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      
      {/* --- MODALI (Solo se Owner e Ente) --- */}
      {isOwner && isEnte && showAddEventoModal && <AddEvento onBack={() => setShowAddEventoModal(false)} onSubmit={() => {setShowAddEventoModal(false); loadEventi(profileData);}} isModal={true} enteId={profileData?.id} />}
      {isOwner && isEnte && showModifyEventoModal && <ModifyEvento isOpen={showModifyEventoModal} onClose={() => {setShowModifyEventoModal(false); setEventoDaModificare(null);}} eventToEdit={eventoDaModificare} onUpdate={() => loadEventi(profileData)} />}
      {isOwner && isEnte && showRaccoltaModal && <ModalWrapper onClose={() => setShowRaccoltaModal(false)}><AddRaccoltaFondi enteLogged={profileData} onClose={() => {setShowRaccoltaModal(false); loadRaccolte(profileData);}} isModal={true} /></ModalWrapper>}

      {/* --- MODALI (Visitatore) --- */}
      {!isOwner && showAffiliazioneModal && <ModalWrapper onClose={() => setShowAffiliazioneModal(false)}><RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={profileData?.email} /></ModalWrapper>}
      {!isOwner && showServizioModal && <ModalWrapper onClose={() => setShowServizioModal(false)}><RichiestaServizio onClose={() => setShowServizioModal(false)} emailEnte={profileData?.email} /></ModalWrapper>}

    </div>
  );
};

export default ProfiloEnte;