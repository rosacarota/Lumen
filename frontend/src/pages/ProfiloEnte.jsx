import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Trash2, Plus, Pencil, Calendar, Image as ImageIcon } from 'lucide-react';

// --- COMPONENTI UI ---
import Navbar from '../components/Navbar.jsx';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo.jsx';
import Footer from '../components/Footer.jsx';
import EventCard from '../components/EventCard.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';

// --- MODALI ---
import AddEvento from '../components/AddEvento.jsx';
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import RichiestaServizio from '../components/RichiestaServizio.jsx';
import AddStory from '../components/AddStory.jsx';
import EditStory from '../components/EditStory.jsx';
import DeleteStory from '../components/DeleteStory.jsx';

// --- SERVIZI ---
import { fetchUserProfile, fetchUserPublicProfile } from '../services/UserServices.js';
import { getCronologiaEventi } from '../services/EventoService.js';
import { getRaccolteDiEnte, terminaRaccolta } from '../services/RaccoltaFondiService.js';
import { fetchStories, addStory, editStory, deleteStory } from '../services/StoriesService.js';

import '../stylesheets/ProfiloEnte.css';

// --- COMPONENTI INTERNI ---

// Wrapper generico per i modali
const ModalWrapper = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose} style={modalStyles.overlay}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalStyles.content}>
      <button onClick={onClose} style={modalStyles.closeBtn}>&times;</button>
      {children}
    </div>
  </div>
);

const ProfiloEnte = () => {

  // --- STATI DATI ---
  const [profileData, setProfileData] = useState(null);
  // --- STATI UI ---
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');


  const currentUserEmail = localStorage.getItem('email'); // O dal tuo context/token

  const isOwner = useMemo(() => {

    if (!profileData?.email || !currentUserEmail) return false;

    return profileData.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase();
  }, [profileData, currentUserEmail]);



  // --- STATI MODALI ---
  const [modals, setModals] = useState({
    affiliazione: false,
    servizio: false,
    addEvento: false,
    raccolta: false,
    addStory: false,
    editStory: false,
    deleteStory: false
  });
  const [selectedStory, setSelectedStory] = useState(null);

  // --- DATI LISTE ---
  const [lists, setLists] = useState({ eventi: [], raccolte: [], storie: [] });
  const [loading, setLoading] = useState({ eventi: false, raccolte: false, storie: false });

  // --- LOGICA RUOLI (Derivati) ---
  const userRole = localStorage.getItem('ruolo');



  // --- HELPER AGGIORNAMENTO MODALI ---
  const toggleModal = (modalName, value) => {
    setModals(prev => ({ ...prev, [modalName]: value }));
  };

  const loadData = async () => {
    setProfileData(await fetchUserPublicProfile(localStorage.getItem('searchEmail')));
    if (isOwner) {
      setProfileData(await fetchUserProfile());
    }
  };

  const loadEventi = async (targetProfile) => {
    setLoading(prev => ({ ...prev, eventi: true }));
    try {
      const statoParam = activeTab === 'corso' ? 'attivi' : (activeTab === 'svolti' ? 'terminati' : 'futuri');
      const data = await getCronologiaEventi(statoParam);

      const mapped = Array.isArray(data) ? data.map(ev => ({
        ...ev,
        id_evento: ev.id || ev.idEvento,
        luogo: ev.indirizzo ? `${ev.indirizzo.citta}, ${ev.indirizzo.strada}` : (ev.luogo || "N/D"),
        date: new Date(ev.dataInizio).toLocaleDateString('it-IT'),
        ente: ev.enteNome || targetProfile?.nome || "Ente",
        raw: ev
      })) : [];

      setLists(prev => ({ ...prev, eventi: mapped }));
    } catch (e) {
      console.error(e);
      setLists(prev => ({ ...prev, eventi: [] }));
    } finally {
      setLoading(prev => ({ ...prev, eventi: false }));
    }
  };

  const loadRaccolte = async (targetProfile) => {
    if (!targetProfile) return;
    setLoading(prev => ({ ...prev, raccolte: true }));
    try {
      const res = await getRaccolteDiEnte();
      const rawList = Array.isArray(res) ? res : (res.content || []);
      const mapped = rawList.map(item => ({
        ...item,
        id_raccolta: item.id || item.idRaccolta || item.idRaccoltaFondi,
        ente: targetProfile.nome
      }));
      setLists(prev => ({ ...prev, raccolte: mapped }));
    } catch (e) { console.error(e); }
    finally { setLoading(prev => ({ ...prev, raccolte: false })); }
  };

  const loadStorie = async (targetProfile) => {
    if (!targetProfile) return;
    setLoading(prev => ({ ...prev, storie: true }));
    try {
      const allStories = await fetchStories();
      const filtered = allStories
        .filter(s => String(s.authorName || "").trim().toLowerCase() === String(targetProfile.nome || "").trim().toLowerCase())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLists(prev => ({ ...prev, storie: filtered }));
    } catch (e) { console.error(e); }
    finally { setLoading(prev => ({ ...prev, storie: false })); }
  };

  // --- INIT EFFECT ---
  useEffect(() => {
    const init = async () => {
      const profile = await loadData();
      const target = profile || profileData;
      if (target) {
        await Promise.all([loadEventi(target), loadRaccolte(target), loadStorie(target)]);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.email]);


  useEffect(() => {
    if (profileData) loadEventi(profileData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // --- HANDLERS ---
  const handleStoryAction = async (action, data) => {
    try {
      if (action === 'add') await addStory(data);
      if (action === 'edit') await editStory(data);
      if (action === 'delete') await deleteStory(data.id);

      toggleModal(action === 'add' ? 'addStory' : action === 'edit' ? 'editStory' : 'deleteStory', false);
      setSelectedStory(null);
      await loadStorie(profileData);
    } catch (error) {
      console.error("Errore operazione storia: " + error.message);
    }
  };

  const handleTerminateRaccolta = async (idRaccolta) => {
    const raccolta = lists.raccolte.find(r => String(r.id_raccolta) === String(idRaccolta));
    if (!raccolta) return;

    // Manteniamo solo il controllo di sicurezza
    const res = await Swal.fire({
      title: 'Sei sicuro?',
      text: "Vuoi terminare la raccolta fondi? L'azione è irreversibile.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#087886',
      confirmButtonText: 'Sì, termina',
      cancelButtonText: 'Annulla'
    });

    if (res.isConfirmed) {
      try {
        await terminaRaccolta({ ...raccolta, enteObj: profileData });
        // Ricarichiamo solo i dati senza mostrare popup di successo "inutili"
        loadRaccolte(profileData);
      } catch (error) {
        console.error("Errore terminazione:", error);
      }
    }
  };

  if (!profileData) return <div className="loading-screen">Caricamento profilo...</div>;

  return (
    <div className="ente-page-wrapper">
      <Navbar />
      <AccessoInfoProfilo userData={profileData} isOwner={isOwner} onUpdate={loadData} />
      <div className="main-container">

        <section className="event-section">
          {/* BARRA DI CONTROLLO SUPERIORE */}
          <div className="controll">
            <div className="tabs-left">
              {['attivi', 'futuri', 'svolti'].map(tab => (
                <button
                  key={tab}
                  className={activeTab === (tab === 'attivi' ? 'corso' : tab) ? 'active' : ''}
                  onClick={() => setActiveTab(tab === 'attivi' ? 'corso' : tab)}
                >
                  {tab === 'attivi' ? 'IN CORSO' : tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="actions-right">
              {isOwner && userRole === 'ente' ? (
                <>
                  <button className="btn-action" onClick={() => toggleModal('addStory', true)}>CREA STORIA</button>
                  <button className="btn-action" onClick={() => toggleModal('raccolta', true)}>CREA RACCOLTA FONDI</button>
                </>
              ) : (
                <>
                  {userRole === 'volontario' && !isOwner && <button className="btn-action btn-affiliation" onClick={() => toggleModal('affiliazione', true)}>Richiedi affiliazione</button>}
                  {userRole === 'beneficiario' && !isOwner && <button className="btn-action btn-affiliation" onClick={() => toggleModal('servizio', true)}>Richiedi Servizio</button>}
                </>
              )}
            </div>
          </div>

          <div className="split-layout">

            {/* COLONNA SINISTRA: EVENTI */}
            <div className="left-column">
              {isOwner && userRole === 'ente' && (
                <div onClick={() => toggleModal('addEvento', true)} style={styles.createEventBtn}>
                  <div style={styles.plusIconWrapper}><Plus size={20} /></div>
                  <span style={styles.createEventText}>Crea Nuovo Evento</span>
                </div>
              )}

              <div className="event-grid">
                {loading.eventi ? <p>Caricamento eventi...</p> : lists.eventi.map(ev => (
                  <EventCard key={ev.id_evento} event={ev} showParticipate={true} />
                ))}
                {!loading.eventi && lists.eventi.length === 0 && (
                  <p className="no-data-msg">Nessun evento presente in questa sezione.</p>
                )}
              </div>
            </div>

            {/* COLONNA DESTRA: SIDEBAR */}
            <div className="right-column">
              <div className="sidebar-header">
                <button className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} onClick={() => setActiveSideTab('storie')}>STORIE</button>
                <button className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} onClick={() => setActiveSideTab('raccolte')}>RACCOLTE FONDI</button>
              </div>

              <div className="sidebar-content">
                {activeSideTab === 'storie' && (
                  <div className="storie-container">
                    {loading.storie ? <div className="loading-text">Caricamento...</div> :
                      lists.storie.length === 0 ? (
                        <div className="empty-state">
                          <ImageIcon size={40} style={{ opacity: 0.3 }} />
                          <p>Nessuna storia pubblicata.</p>
                        </div>
                      ) : (
                        lists.storie.map(storia => (
                          <div key={storia.id} className="story-card-sidebar" style={styles.storyCard}>
                            <div className="story-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={styles.storyAvatar}>
                                {storia.authorName ? storia.authorName.charAt(0).toUpperCase() : 'E'}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{storia.title}</h4>
                                <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                  <Calendar size={10} style={{ marginRight: 4 }} />
                                  {new Date(storia.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {isOwner && userRole === 'ente' && (
                                <div className="story-actions">
                                  <button onClick={() => { setSelectedStory(storia); toggleModal('editStory', true); }} style={styles.iconBtn}><Pencil size={16} /></button>
                                  <button onClick={() => { setSelectedStory(storia); toggleModal('deleteStory', true); }} style={{ ...styles.iconBtn, color: '#ff4d4d' }}><Trash2 size={16} /></button>
                                </div>
                              )}
                            </div>
                            <p style={styles.storyText}>{storia.content}</p>
                            {storia.imageBase64 && (
                              <img src={storia.imageBase64} alt="storia" style={styles.storyImage} />
                            )}
                          </div>
                        ))
                      )}
                  </div>
                )}

                {activeSideTab === 'raccolte' && (
                  <div className="raccolte-list">
                    {lists.raccolte.length === 0 && <p className="no-data-msg">Nessuna raccolta attiva.</p>}
                    {lists.raccolte.map(r => (
                      <RaccoltaFondiCard key={r.id_raccolta} {...r} isOwner={isOwner && userRole === 'ente'} onTerminate={handleTerminateRaccolta} />
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
      {isOwner && userRole === 'ente' && modals.addEvento && <AddEvento onBack={() => toggleModal('addEvento', false)} onSubmit={() => { toggleModal('addEvento', false); loadEventi(profileData); }} isModal={true} enteId={profileData?.id} />}
      {isOwner && userRole === 'ente' && modals.raccolta && <ModalWrapper onClose={() => toggleModal('raccolta', false)}><AddRaccoltaFondi enteLogged={profileData} onClose={() => { toggleModal('raccolta', false); loadRaccolte(profileData); }} isModal={true} /></ModalWrapper>}

      {!isOwner && userRole === 'volontario' && modals.affiliazione && <RichiestaAffiliazione onClose={() => toggleModal('affiliazione', false)} emailEnte={profileData?.email} isModal={true} />}
      {!isOwner && userRole === 'beneficiario' && modals.servizio && <ModalWrapper onClose={() => toggleModal('servizio', false)}><RichiestaServizio onClose={() => toggleModal('servizio', false)} emailEnte={profileData?.email} /></ModalWrapper>}

      {isOwner && userRole === 'ente' && modals.addStory && <AddStory onBack={() => toggleModal('addStory', false)} onSubmit={(d) => handleStoryAction('add', d)} />}
      {isOwner && userRole === 'ente' && modals.editStory && selectedStory && <EditStory story={selectedStory} onCancel={() => { toggleModal('editStory', false); setSelectedStory(null); }} onSave={(d) => handleStoryAction('edit', d)} />}
      {isOwner && userRole === 'ente' && modals.deleteStory && selectedStory && <DeleteStory story={selectedStory} onCancel={() => { toggleModal('deleteStory', false); setSelectedStory(null); }} onConfirm={() => handleStoryAction('delete', selectedStory)} />}
    </div>
  );
};

// --- STYLES OBJECTS (per pulire il JSX) ---
const styles = {
  createEventBtn: {
    width: '100%', marginBottom: '15px', padding: '10px',
    borderRadius: '8px', border: '2px dashed #087886',
    backgroundColor: '#f0f5f5', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '10px', cursor: 'pointer',
    transition: 'all 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  plusIconWrapper: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#087886',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  createEventText: { color: '#087886', fontWeight: '600', fontSize: '1rem', letterSpacing: '0.5px' },
  storyCard: {
    backgroundColor: 'white', borderRadius: '12px', padding: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee',
    display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px'
  },
  storyAvatar: {
    width: '35px', height: '35px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #087886, #4AAFB8)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: '14px'
  },
  storyText: { fontSize: '0.85rem', color: '#555', margin: 0, lineHeight: '1.4' },
  storyImage: { width: '100%', height: '150px', borderRadius: '8px', objectFit: 'cover', marginTop: '5px' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#087886', padding: '5px' }
};

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  content: { position: 'relative', zIndex: 10, backgroundColor: 'white', borderRadius: '12px', padding: '20px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
  closeBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }
};

export default ProfiloEnte;