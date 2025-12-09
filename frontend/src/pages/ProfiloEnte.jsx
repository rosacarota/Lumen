import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Trash2, Plus, Pencil, Calendar, Image as ImageIcon } from 'lucide-react';


import InfoProfilo from '../components/InfoProfilo.jsx';

import EventCard from '../components/EventCard.jsx';
import RaccoltaFondiCard from '../components/RaccoltaFondiCard.jsx';

import AddEvento from '../components/AddEvento.jsx';
import AddRaccoltaFondi from '../components/AddRaccoltaFondi.jsx';
import RichiestaAffiliazione from '../components/RichiestaAffiliazione.jsx';
import RichiestaServizio from '../components/RichiestaServizio.jsx';
import AddStory from '../components/AddStory.jsx';
import EditStory from '../components/EditStory.jsx';
import DeleteStory from '../components/DeleteStory.jsx';

import { fetchUserProfile, fetchUserPublicProfile } from '../services/UserServices.js';
import { getCronologiaEventi } from '../services/EventoService.js';
import { getRaccolteDiEnte, terminaRaccolta, getRaccolteDiEnteEsterno } from '../services/RaccoltaFondiService.js';
import { fetchFilteredStories } from '../services/StoriesService.js';

import '../stylesheets/ProfiloEnte.css';

const ModalWrapper = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose} style={modalStyles.overlay}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalStyles.content}>
      <button onClick={onClose} style={modalStyles.closeBtn}>&times;</button>
      {children}
    </div>
  </div>
);

const ProfiloEnte = () => {

  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('futuri');
  const [activeSideTab, setActiveSideTab] = useState('storie');


  const currentUserEmail = localStorage.getItem('email');

  const isOwner = useMemo(() => {

    if (!profileData?.email || !currentUserEmail) return false;

    return profileData.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase();
  }, [profileData, currentUserEmail]);



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

  const [lists, setLists] = useState({ eventi: [], raccolte: [], storie: [] });
  const [loading, setLoading] = useState({ eventi: false, raccolte: false, storie: false });

  const userRole = localStorage.getItem('ruolo');

  const toggleModal = (modalName, value) => {
    setModals(prev => ({ ...prev, [modalName]: value }));
  };

  const loadData = async () => {
    let data = null;
    const searchEmail = localStorage.getItem('searchEmail');
    try {
      if (searchEmail) {
        data = await fetchUserPublicProfile(searchEmail);
        if (currentUserEmail && data?.email && data.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase()) {
          data = await fetchUserProfile();
        }
      } else if (currentUserEmail) {
        data = await fetchUserProfile();
      }
      setProfileData(data);
      return data;
    } catch (error) {
      console.error("Errore caricamento dati:", error);
    }
  };

  const loadEventi = async (targetProfile) => {
    setLoading(prev => ({ ...prev, eventi: true }));
    try {
      const statoParam = activeTab === 'corso' ? 'attivi' : (activeTab === 'svolti' ? 'terminati' : 'futuri');
      // Passiamo l'email del profilo caricato per evitare di ripescarla dallo storage
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
      let res;
      if (isOwner) {
        res = await getRaccolteDiEnte();
      } else {
        res = await getRaccolteDiEnteEsterno(targetProfile.email);
      }
      const rawList = Array.isArray(res) ? res : (res.content || []);
      const mapped = rawList.map(item => ({
        ...item,
        id_raccolta: item.id || item.idRaccolta || item.idRaccoltaFondi,
        ente: targetProfile.nome,
        enteFoto: targetProfile.immagine
      }));
      setLists(prev => ({ ...prev, raccolte: mapped }));
    } catch (e) { console.error(e); }
    finally { setLoading(prev => ({ ...prev, raccolte: false })); }
  };

  const loadStorie = async (targetProfile) => {
    if (!targetProfile) return;
    setLoading(prev => ({ ...prev, storie: true }));
    try {
      // Usiamo la fetch filtrata per email, passando quella del profilo
      const filtered = await fetchFilteredStories(targetProfile.email);

      const cachedImage = localStorage.getItem('userImage');

      const enrichedStories = filtered.map(st => {
        let avatarSource = st.authorAvatar || targetProfile.immagine || cachedImage;
        if (avatarSource && !avatarSource.startsWith('http') && !avatarSource.startsWith('data:')) {
          avatarSource = `${avatarSource}`;
        }
        return {
          ...st,
          authorAvatar: avatarSource
        };
      });

      setLists(prev => ({ ...prev, storie: enrichedStories }));
    } catch (e) { console.error(e); }
    finally { setLoading(prev => ({ ...prev, storie: false })); }
  };

  // 1. Load Profile Data ONLY ONCE on mount
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Load related data only when profile is available or changes identity
  useEffect(() => {
    if (profileData) {
      // Parallel fetch of related entities
      Promise.all([loadEventi(profileData), loadRaccolte(profileData), loadStorie(profileData)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.email]);


  useEffect(() => {
    if (profileData) loadEventi(profileData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // --- HANDLERS ---
  const handleStoryAction = async (action) => {
    try {
      // Le operazioni API sono ora gestite dentro i componenti
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
        loadRaccolte(profileData);
      } catch (error) {
        console.error("Errore terminazione:", error);
      }
    }
  };

  if (!profileData) return <div className="loading-screen">Caricamento profilo...</div>;

  return (
    <div className="ente-page-wrapper">

      <InfoProfilo userData={profileData} isOwner={isOwner} onUpdate={loadData} />
      <div className="main-container">
        <section className="event-section">
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
              {isOwner && userRole === 'ente' && (
                <>
                  <button className="btn-action" onClick={() => toggleModal('addStory', true)}>CREA STORIA</button>
                  <button className="btn-action" onClick={() => toggleModal('raccolta', true)}>CREA RACCOLTA FONDI</button>
                </>
              )}
            </div>
          </div>
          <div className="split-layout">
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
                                {storia.authorAvatar ? (
                                  <img
                                    src={storia.authorAvatar}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  storia.authorName ? storia.authorName.charAt(0).toUpperCase() : 'E'
                                )}
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
                  <div className="raccolte-list-container">
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


      {isOwner && userRole === 'ente' && modals.addEvento && <AddEvento onBack={() => toggleModal('addEvento', false)} onSubmit={() => { toggleModal('addEvento', false); loadEventi(profileData); }} isModal={true} enteId={profileData?.id} />}
      {isOwner && userRole === 'ente' && modals.raccolta && <ModalWrapper onClose={() => toggleModal('raccolta', false)}><AddRaccoltaFondi enteLogged={profileData} onClose={() => { toggleModal('raccolta', false); loadRaccolte(profileData); }} isModal={true} /></ModalWrapper>}
      {!isOwner && userRole === 'volontario' && modals.affiliazione && <RichiestaAffiliazione onClose={() => toggleModal('affiliazione', false)} emailEnte={profileData?.email} isModal={true} />}
      {!isOwner && userRole === 'beneficiario' && modals.servizio && <ModalWrapper onClose={() => toggleModal('servizio', false)}><RichiestaServizio onClose={() => toggleModal('servizio', false)} emailEnte={profileData?.email} /></ModalWrapper>}
      {isOwner && userRole === 'ente' && modals.addStory && <AddStory onBack={() => toggleModal('addStory', false)} onSubmit={() => handleStoryAction('add')} />}
      {isOwner && userRole === 'ente' && modals.editStory && selectedStory && <EditStory story={selectedStory} onCancel={() => { toggleModal('editStory', false); setSelectedStory(null); }} onSave={() => handleStoryAction('edit')} />}
      {isOwner && userRole === 'ente' && modals.deleteStory && selectedStory && <DeleteStory story={selectedStory} onCancel={() => { toggleModal('deleteStory', false); setSelectedStory(null); }} onConfirm={() => handleStoryAction('delete')} />}
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