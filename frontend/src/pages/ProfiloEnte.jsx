import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Trash2, Plus, Pencil, Calendar, Image as ImageIcon } from 'lucide-react';

// --- COMPONENTI UI ---
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import Footer from '../components/Footer.jsx';
import EventCard from '../components/EventCard.jsx';
import EventCardEnte from '../components/EventCardEnte.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';

// --- COMPONENTI MODALI STANDARD ---
import AddEvento from '../components/AddEvento.jsx';
import ModifyEvento from '../components/ModifyEvento.jsx';
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import RichiestaServizio from '../components/RichiestaServizio.jsx';

// --- COMPONENTI STORIE ---
import AddStory from '../components/AddStory.jsx';
import EditStory from '../components/EditStory.jsx';
import DeleteStory from '../components/DeleteStory.jsx';

// --- SERVIZI ---
import { fetchUserProfile } from '../services/UserServices.js';
import { getCronologiaEventi, rimuoviEvento } from '../services/EventoService.js';
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';
import { fetchStories, addStory, editStory, deleteStory } from '../services/StoriesService.js';

import '../stylesheets/ProfiloEnte.css';

// Wrapper per i modali standard
const ModalWrapper = ({ children, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div onClick={onClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
    <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'white', borderRadius: '12px', padding: '20px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
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
  const [isEnte, setIsEnte] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isBeneficiary, setIsBeneficiary] = useState(false);

  // --- STATI MODALI STANDARD ---
  const [showAffiliazioneModal, setShowAffiliazioneModal] = useState(false);
  const [showServizioModal, setShowServizioModal] = useState(false);
  const [showAddEventoModal, setShowAddEventoModal] = useState(false);
  const [showModifyEventoModal, setShowModifyEventoModal] = useState(false);
  const [showRaccoltaModal, setShowRaccoltaModal] = useState(false);
  const [eventoDaModificare, setEventoDaModificare] = useState(null);

  // --- STATI MODALI STORIE ---
  const [showAddStory, setShowAddStory] = useState(false);
  const [showEditStory, setShowEditStory] = useState(false);
  const [showDeleteStory, setShowDeleteStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  // --- STATI LISTE ---
  const [activeTab, setActiveTab] = useState('futuri'); // Default visualizza eventi futuri
  const [activeSideTab, setActiveSideTab] = useState('storie');
  
  const [eventiList, setEventiList] = useState([]);
  const [raccolteList, setRaccolteList] = useState([]);
  const [storieList, setStorieList] = useState([]);
  
  const [loadingEventi, setLoadingEventi] = useState(false);
  const [loadingRaccolte, setLoadingRaccolte] = useState(false);
  const [loadingStorie, setLoadingStorie] = useState(false);

  // 1. CARICAMENTO DATI UTENTE
  const loadData = async () => {
    try {
      const myData = await fetchUserProfile();
      setCurrentUser(myData);

      setIsEnte(false);
      setIsVolunteer(false);
      setIsBeneficiary(false);

      if (myData && myData.ruolo) {
        const ruolo = myData.ruolo.toLowerCase();
        if (ruolo === 'ente') setIsEnte(true);
        if (ruolo === 'volontario') setIsVolunteer(true);
        if (ruolo === 'beneficiario') setIsBeneficiary(true);
      }

      // Logica Owner
      if (!id || (myData && String(myData.id) === String(id))) {
        setIsOwner(true);
        setProfileData(myData);
        return myData;
      } else {
        setIsOwner(false);
        // Qui si dovrebbe implementare il fetch per un altro ente se necessario
        return null; 
      }
    } catch (error) { console.error(error); return null; }
  };

  // 2. FETCH EVENTI (Con formattazione data e parametri corretti)
  const loadEventi = async (targetProfile) => {
    setLoadingEventi(true);
    try {
      let data = [];
      let statoParam = '';

      // Mappatura Tab -> Parametri Backend
      switch (activeTab) {
        case 'futuri':
            statoParam = 'futuri';
            break;
        case 'corso':
            statoParam = 'attivi';
            break;
        case 'svolti':
            statoParam = 'terminati';
            break;
        default:
            statoParam = 'attivi';
      }

      // Chiamata API
      data = await getCronologiaEventi(statoParam);
      
      // Funzione helper per formattare la data (DD/MM/YYYY)
      const formattaData = (dataString) => {
        if (!dataString) return "";
        const d = new Date(dataString);
        return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      };

      const mapped = Array.isArray(data) ? data.map(ev => ({
        id_evento: ev.id || ev.idEvento,
        titolo: ev.titolo,
        descrizione: ev.descrizione,
        luogo: ev.indirizzo ? `${ev.indirizzo.citta}, ${ev.indirizzo.strada}` : (ev.luogo || "N/D"),
        
        // Passiamo la data grezza
        dataInizio: ev.dataInizio,
        dataFine: ev.dataFine,
        
        // Passiamo la data formattata esplicitamente come 'date' (perché molte card usano questo nome)
        date: formattaData(ev.dataInizio),
        data: formattaData(ev.dataInizio), // Alias per sicurezza
        
        maxpartecipanti: ev.maxPartecipanti,
        immagine: ev.immagine,
        ente: ev.enteNome || targetProfile?.nome || "Ente",
        rawData: ev
      })) : [];
      
      setEventiList(mapped);

    } catch (e) { 
        console.error("Errore fetch eventi:", e); 
        setEventiList([]); 
    } finally { 
        setLoadingEventi(false); 
    }
  };

  // 3. FETCH RACCOLTE
  const loadRaccolte = async (targetProfile) => {
    if (!targetProfile) return;
    setLoadingRaccolte(true);
    try {
      const responseData = await getRaccolteDiEnte();
      const listaVera = Array.isArray(responseData) ? responseData : (responseData.content || []);
      
      const mapped = listaVera.map(item => ({
        ...item,
        id_raccolta: item.id || item.idRaccolta || item.idRaccoltaFondi,
        ente: targetProfile.nome,
        data_apertura: item.dataApertura,
        data_chiusura: item.dataChiusura
      }));
      setRaccolteList(mapped);
    } catch (e) { console.error(e); }
    finally { setLoadingRaccolte(false); }
  };

  // 4. FETCH STORIE
  const loadStorie = async (targetProfile) => {
    if (!targetProfile) return;
    setLoadingStorie(true);
    try {
      const allStories = await fetchStories();
      const filteredStories = allStories.filter(story => {
          const storyAuthor = String(story.authorName || "").trim().toLowerCase();
          const profileName = String(targetProfile.nome || "").trim().toLowerCase();
          return storyAuthor === profileName;
      });
      filteredStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setStorieList(filteredStories);
    } catch (error) {
      console.error("Errore caricamento storie:", error);
    } finally {
      setLoadingStorie(false);
    }
  };

  // --- HANDLERS ---
  const handleAddStorySubmit = async (newStoryData) => {
    try {
        await addStory(newStoryData);
        setShowAddStory(false);
        await loadStorie(profileData); 
    } catch (error) {
        alert("Errore durante la pubblicazione: " + error.message);
    }
  };

  const handleEditStorySave = async (updatedStoryData) => {
    try {
        await editStory(updatedStoryData);
        setShowEditStory(false);
        setSelectedStory(null);
        await loadStorie(profileData); 
    } catch (error) {
        alert("Errore durante la modifica: " + error.message);
    }
  };

  const handleDeleteStoryConfirm = async () => {
    if (!selectedStory) return;
    try {
        await deleteStory(selectedStory.id);
        setShowDeleteStory(false);
        setSelectedStory(null);
        await loadStorie(profileData); 
    } catch (error) {
        alert("Errore durante l'eliminazione: " + error.message);
    }
  };

  const handleDeleteEvento = async (idEvento) => {
    const res = await Swal.fire({ title: 'Eliminare?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
      await rimuoviEvento(idEvento);
      loadEventi(profileData);
      Swal.fire('Eliminato', '', 'success');
    }
  };

  const handleTerminateRaccolta = async (idRaccolta) => {
    const raccolta = raccolteList.find(r => String(r.id_raccolta) === String(idRaccolta));
    if (!raccolta) return;
    const res = await Swal.fire({ title: 'Terminare?', text: raccolta.titolo, icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
      await terminaRaccolta({ ...raccolta, enteObj: profileData });
      loadRaccolte(profileData);
      Swal.fire('Terminata', '', 'success');
    }
  };

  // --- EFFETTI ---
  
  useEffect(() => {
    const init = async () => {
      const profile = await loadData();
      const dataToLoad = profile || profileData;
      
      if (dataToLoad) {
        await loadEventi(dataToLoad);
        await loadRaccolte(dataToLoad);
        await loadStorie(dataToLoad);
      }
    };
    init();
  }, [id]);

  useEffect(() => { 
    if(profileData) loadEventi(profileData); 
  }, [activeTab]);

  
  // --- RENDER ---
  if (!profileData && !currentUser) {
    return <div style={{padding:'40px', textAlign:'center'}}>Caricamento profilo...</div>;
  }

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <div className="main-container">

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
              {isOwner && isEnte ? (
                <>
                  <button className="btn-action" onClick={() => setShowAddEventoModal(true)}>CREA EVENTO</button>
                  <button className="btn-action" onClick={() => setShowRaccoltaModal(true)}>CREA RACCOLTA FONDI</button>
                </>
              ) : (
                <>
                  {isVolunteer && isOwner && <button className="btn-action btn-affiliation" onClick={() => setShowAffiliazioneModal(true)}>Richiedi affiliazione</button>}
                  {isBeneficiary && isOwner && <button className="btn-action btn-affiliation" onClick={() => setShowServizioModal(true)}>Richiedi Servizio</button>}
                </>
              )}
            </div>
          </div>

          <div className="split-layout">
            
            {/* COLONNA SINISTRA: EVENTI */}
            <div className="left-column">
              <div className="event-grid">
                {loadingEventi ? <p>Caricamento eventi...</p> : eventiList.length === 0 ? <p>Nessun evento presente in questa sezione.</p> :
                  eventiList.map(ev => (
                    (isOwner && isEnte) ?
                      <EventCardEnte 
                        key={ev.id_evento} {...ev} eventData={ev.rawData} 
                        onElimina={handleDeleteEvento} 
                        onModifica={(e) => { setEventoDaModificare(e); setShowModifyEventoModal(true); }} 
                      />
                      : <EventCard key={ev.id_evento} {...ev} showParticipate={true} />
                  ))
                }
              </div>
            </div>

            {/* COLONNA DESTRA: SIDEBAR (Storie & Raccolte) */}
            <div className="right-column">
              <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
              </div>
              
              <div className="sidebar-content">
                
                {/* --- TAB STORIE --- */}
                {activeSideTab === 'storie' && (
                  <div className="storie-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {isOwner && isEnte && (
                        <button 
                            onClick={() => setShowAddStory(true)}
                            className="btn-add-story-sidebar"
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px', 
                                border: '2px dashed #087886', backgroundColor: '#f0f5f5', 
                                color: '#087886', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Plus size={20} /> Aggiungi un racconto
                        </button>
                    )}

                    {loadingStorie ? (
                        <div style={{textAlign:'center', padding:'20px', color:'#888'}}>Caricamento...</div>
                    ) : storieList.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 10px', color: '#999', display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <ImageIcon size={40} style={{opacity:0.3, marginBottom:'10px'}} />
                            <p>Nessuna storia pubblicata.</p>
                        </div>
                    ) : (
                        storieList.map(storia => (
                          <div key={storia.id} className="story-card-sidebar" style={{ 
                                backgroundColor: 'white', borderRadius: '12px', padding: '15px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee',
                                display: 'flex', flexDirection: 'column', gap: '10px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                    width: '35px', height: '35px', borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, #087886, #4AAFB8)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '14px'
                                }}>
                                    {storia.authorName ? storia.authorName.charAt(0).toUpperCase() : 'E'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#333' }}>{storia.title}</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#999', display:'flex', alignItems:'center', gap:'4px' }}>
                                        <Calendar size={10} /> {new Date(storia.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                {isOwner && isEnte && (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                            onClick={() => { setSelectedStory(storia); setShowEditStory(true); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#087886', padding: '5px' }}
                                            title="Modifica"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedStory(storia); setShowDeleteStory(true); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', padding: '5px' }}
                                            title="Elimina"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p style={{ fontSize: '0.85rem', color: '#555', margin: 0, lineHeight: '1.4' }}>
                                {storia.content}
                            </p>

                            {storia.imageBase64 && (
                                <div style={{ width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', marginTop: '5px' }}>
                                    <img src={storia.imageBase64} alt="storia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                )}

                {/* --- TAB RACCOLTE --- */}
                {activeSideTab === 'raccolte' && (
                  <div className="raccolte-list">
                    {raccolteList.length === 0 && <p style={{textAlign:'center', marginTop:'20px'}}>Nessuna raccolta attiva.</p>}
                    {raccolteList.map(r => (
                        <RaccoltaFondiCard 
                            key={r.id_raccolta} 
                            {...r} 
                            isOwner={isOwner && isEnte} 
                            onTerminate={handleTerminateRaccolta} 
                        />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {/* --- MODALI --- */}
      {isOwner && isEnte && showAddEventoModal && <AddEvento onBack={() => setShowAddEventoModal(false)} onSubmit={() => { setShowAddEventoModal(false); loadEventi(profileData); }} isModal={true} enteId={profileData?.id} />}
      {isOwner && isEnte && showModifyEventoModal && <ModifyEvento isOpen={showModifyEventoModal} onClose={() => { setShowModifyEventoModal(false); setEventoDaModificare(null); }} eventToEdit={eventoDaModificare} onUpdate={() => loadEventi(profileData)} />}
      {isOwner && isEnte && showRaccoltaModal && <ModalWrapper onClose={() => setShowRaccoltaModal(false)}><AddRaccoltaFondi enteLogged={profileData} onClose={() => { setShowRaccoltaModal(false); loadRaccolte(profileData); }} isModal={true} /></ModalWrapper>}
      
      {!isOwner && showAffiliazioneModal && <RichiestaAffiliazione onClose={() => setShowAffiliazioneModal(false)} emailEnte={profileData?.email} isModal={true} />}
      {!isOwner && showServizioModal && <ModalWrapper onClose={() => setShowServizioModal(false)}><RichiestaServizio onClose={() => setShowServizioModal(false)} emailEnte={profileData?.email} /></ModalWrapper>}

      {isOwner && isEnte && showAddStory && <AddStory onBack={() => setShowAddStory(false)} onSubmit={handleAddStorySubmit} />}
      {isOwner && isEnte && showEditStory && selectedStory && <EditStory story={selectedStory} onCancel={() => { setShowEditStory(false); setSelectedStory(null); }} onSave={handleEditStorySave} />}
      {isOwner && isEnte && showDeleteStory && selectedStory && <DeleteStory story={selectedStory} onCancel={() => { setShowDeleteStory(false); setSelectedStory(null); }} onConfirm={handleDeleteStoryConfirm} />}

    </div>
  );
};

export default ProfiloEnte;