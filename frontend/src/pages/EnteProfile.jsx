import React, { useState } from 'react';
import '../stylesheets/EnteProfile.css';
import Navbar from '../components/Navbar.jsx';

const EnteProfile = () => {
    // STATI
    const [activeTab, setActiveTab] = useState('futuri');
    const [isFollowing, setIsFollowing] = useState(false);
    const [filters, setFilters] = useState({ data: '', orario: '', tipologia: '' });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            
            <div className="main-container">
                
                {/* --- 1. HERO SECTION (Layout a 2 Colori + Avatar Sovrapposto) --- */}
                <div className="hero-wrapper">
                    
                    {/* Parte Superiore Scura */}
                    <div className="hero-cover"></div>

                    {/* Parte Inferiore Verde Chiaro */}
                    <div className="hero-info-bar">
                        <div className="hero-content-inner">
                            
                            {/* Avatar che "esce" grazie al margine negativo nel CSS */}
                            <div className="avatar-container">
                                <span style={{color:'#ccc'}}>LOGO</span>
                            </div>

                            {/* Testo e Bottoni */}
                            <div className="ente-text">
                                <h1>UniCiock</h1>
                                <h3>ENTE</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                
                                <div className="stats-row">
                                    <span className="pill">4k followers</span>
                                    <span className="pill">20 eventi</span>
                                    <button 
                                        className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                        onClick={() => setIsFollowing(!isFollowing)}
                                    >
                                        {isFollowing ? 'Seguito' : 'Segui'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


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
                            <button className="btn-action">DONA</button>
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

export default EnteProfile;