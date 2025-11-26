import React, { useState } from 'react';
import '../stylesheets/EnteProfile.css';
import Navbar from '../components/Navbar.jsx';
// Assicurati che il percorso sia corretto
import InfoProfilo from '../components/InfoProfilo.jsx'; 

const EnteProfile = () => {
    // --- STATI ---
    
    // 1. Stato per il bottone SEGUI (Passato a ProfileInfo)
    const [isFollowing, setIsFollowing] = useState(false);
    
    // 2. Stato Tab Eventi (Colonna Sinistra)
    const [activeTab, setActiveTab] = useState('futuri');
    
    // 3. Stato Tab Sidebar (Colonna Destra)
    const [activeSideTab, setActiveSideTab] = useState('storie');

    // 4. Stato Filtri Ricerca
    const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });

    // --- HANDLERS (LOGICA) ---

    // Funzione che gestisce il click su "Segui"
    const handleFollowClick = () => {
        setIsFollowing(!isFollowing); // Inverte vero/falso
        console.log("Stato Segui cambiato:", !isFollowing); // Debug per vedere se funziona
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            
            <div className="main-container">
                
                {/* --- 1. HERO SECTION (PROFILE INFO) --- */}
                {/* Qui passiamo lo stato e la funzione al componente figlio */}
                <ProfileInfo 
                    isFollowing={isFollowing} 
                    onToggle={handleFollowClick} 
                />

                <section className="event-section">
                    
                    {/* --- 2. ZONA CONTROLLI (Tab e Affiliati) --- */}
                    <div className="controll">
                        <div className="tabs-left">
                            <button className={activeTab === 'corso' ? 'active' : ''} onClick={() => setActiveTab('corso')}>IN CORSO</button>
                            <button className={activeTab === 'futuri' ? 'active' : ''} onClick={() => setActiveTab('futuri')}>FUTURI</button>
                            <button className={activeTab === 'svolti' ? 'active' : ''} onClick={() => setActiveTab('svolti')}>SVOLTI</button>
                        </div>
                        <div className="actions-right">
                            <button className="btn-action">AFFILIATI</button>
                        </div>
                    </div>

                    {/* --- 3. ZONA SPLIT (Search+Griglia | Toggles+Storie) --- */}
                    <div className="split-layout">
                        
                        {/* COLONNA SINISTRA */}
                        <div className="left-column">
                            
                            {/* Barra di Ricerca */}
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

                            {/* Griglia Eventi */}
                            <div className="event-grid">
                                <p>Nessun evento {activeTab} trovato.</p>
                            </div>
                        </div>

                        {/* COLONNA DESTRA */}
                        <div className="right-column">
                            
                            {/* Switch Storie/Raccolte */}
                            <div className="sidebar-header">
                                <button 
                                    className={`side-tab-btn ${activeSideTab === 'storie' ? 'active' : ''}`} 
                                    onClick={() => setActiveSideTab('storie')}
                                >
                                    STORIE
                                </button>
                                <button 
                                    className={`side-tab-btn ${activeSideTab === 'raccolte' ? 'active' : ''}`} 
                                    onClick={() => setActiveSideTab('raccolte')}
                                >
                                    RACCOLTE FONDI
                                </button>
                            </div>
                            
                            {/* Contenuto Sidebar */}
                            <div className="sidebar-content">
                                {activeSideTab === 'storie' ? (
                                    <div className="placeholder-content">
                                        <div className="story-circle"></div>
                                        <p>Nessuna storia recente.</p>
                                    </div>
                                ) : (
                                    <div className="placeholder-content">
                                        <p>Nessuna raccolta attiva.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </>
    );
};

export default EnteProfile;