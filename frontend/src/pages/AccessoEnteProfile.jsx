import React, { useState } from 'react';
import '../stylesheets/AccessoEnteProfile.css';
import Navbar from '../components/Navbar.jsx';
import ProfileInfo from '../components/ProfileInfo.jsx';

const AccessoEnteProfile = () => {
    // --- STATI ---
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('futuri');
    
    // Aggiunto questo stato per evitare errori nei campi di ricerca
    const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });

    // --- HANDLERS (LOGICA) ---

    // Funzione che inverte lo stato (Segui <-> Seguito)
    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
    };

    // Funzione per gestire gli input della ricerca
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            
            <div className="main-container">
                
                {/* --- 1. HERO SECTION (Ora collegata alla logica) --- */}
                <ProfileInfo 
                    title="UniCiock"
                    subtitle="ENTE"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    stat1="4k followers"
                    stat2="20 eventi"
                    
                    // PROPS FONDAMENTALI PER IL FUNZIONAMENTO DEL BOTTONE
                    isFollowing={isFollowing} 
                    onToggle={handleFollowClick}
                />

                {/* --- 2. SEZIONE EVENTI --- */}
                <section className="event-section">
                    
                    {/* TAB E BOTTONI */}
                    <div className="controll">
                        <div className="tabs-left">
                            <button className={activeTab === 'corso' ? 'active' : ''} onClick={() => setActiveTab('corso')}>EVENTI IN CORSO</button>
                            <button className={activeTab === 'futuri' ? 'active' : ''} onClick={() => setActiveTab('futuri')}>EVENTI FUTURI</button>
                            <button className={activeTab === 'svolti' ? 'active' : ''} onClick={() => setActiveTab('svolti')}>EVENTI SVOLTI</button>
                        </div>
                        <div className="actions-right">
                            <button className="btn-action">AFFILIATI</button>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="event-search">
                        <h3 className="search-title">CERCA EVENTI</h3>
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
                                <label>TIPOLOGIA</label>
                                <select name="tipologia" className="custom-input" onChange={handleFilterChange}>
                                    <option value="">Tutti</option>
                                    <option value="conf">Conferenza</option>
                                    <option value="party">Festa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* GRIGLIA */}
                    <div className="event-grid">
                        <p>Nessun evento {activeTab} trovato.</p>
                    </div>

                </section>
            </div>
        </>
    );
};

export default AccessoEnteProfile;