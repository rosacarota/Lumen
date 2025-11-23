import React, { useState } from 'react';
import '../stylesheets/EnteProfile.css';

const EnteProfile = () => {
    // 1. STATO TAB: Gestisce quale scheda è attiva
    const [activeTab, setActiveTab] = useState('futuri');

    // 2. STATO FILTRI: Gestisce i valori degli input di ricerca
    const [filters, setFilters] = useState({
        data: '',
        orario: '',
        tipologia: ''
    });

    // 3. STATO FOLLOW: Gestisce il bottone "Segui" / "Seguito"
    const [isFollowing, setIsFollowing] = useState(false);

    // Funzione per aggiornare gli input
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Funzione per il toggle del "Segui"
    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <div className='Container'>
            {/* --- HEADER --- */}
            <header className='page-header'>
                <h1>PROFILO</h1>
            </header>

            {/* --- HERO SECTION (Profilo Ente) --- */}
            <section className='social-section'>
                <div className='profile-container'>
                    <div className='avatar-wrapper'>
                        <img src="" alt="UniCiock Logo" />
                    </div>
                    
                    <h2>Uniciock</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                    <div className='profile-stats'>
                        {/* Simulazione cambio numero follower */}
                        <span className='pill'>
                            {isFollowing ? 46 : 45} Followers
                        </span>
                        <span className='pill'>20 Eventi</span>
                        
                        {/* Bottone Segui con logica e classi dinamiche */}
                        <button 
                            className={`pill follow-btn ${isFollowing ? 'following' : ''}`} 
                            onClick={toggleFollow}
                        >
                            {isFollowing ? 'Seguito' : 'Segui'}
                        </button>
                    </div>
                </div>
            </section>

            {/* --- SEZIONE EVENTI --- */}
            <section className='event-section'>
                <div className='grid'>
                    
                    {/* NAVIGAZIONE E BOTTONI AZIONE */}
                    <div className='controll'>
                        <div className='tabs-left'>
                            <button 
                                className={activeTab === 'corso' ? 'active' : ''} 
                                onClick={() => setActiveTab('corso')}
                            >
                                EVENTI IN CORSO
                            </button>
                            <button 
                                className={activeTab === 'futuri' ? 'active' : ''} 
                                onClick={() => setActiveTab('futuri')}
                            >
                                EVENTI FUTURI
                            </button>
                            <button 
                                className={activeTab === 'svolti' ? 'active' : ''} 
                                onClick={() => setActiveTab('svolti')}
                            >
                                EVENTI SVOLTI
                            </button>
                        </div>
                        
                        <div className='actions-right'>
                            <button className='btn-action'>AFFILIATI</button>
                            <button className='btn-action'>DONA</button>
                        </div>
                    </div>

                    {/* BARRA DI RICERCA */}
                    <div className='event-search'>
                        <h3 className='search-title'>CERCA EVENTI</h3>
                        
                        <div className='search-inputs'>
                            <div className='input-group'>
                                <label>DATA</label>
                                <input 
                                    type="date" 
                                    name="data"
                                    className='custom-input'
                                    value={filters.data}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            
                            <div className='input-group'>
                                <label>ORARIO</label>
                                <input 
                                    type="time" 
                                    name="orario"
                                    className='custom-input' 
                                    value={filters.orario}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            
                            <div className='input-group'>
                                <label>TIPOLOGIA</label>
                                <select 
                                    name="tipologia"
                                    className='custom-input'
                                    value={filters.tipologia}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Tutti</option>
                                    <option value="conferenza">Conferenza</option>
                                    <option value="party">Festa</option>
                                    <option value="seminario">Seminario</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* GRIGLIA EVENTI (Contenitore Bianco) */}
                    <div className='event-grid'>
                        <p>
                            Visualizzazione eventi: <strong>{activeTab.toUpperCase()}</strong>
                        </p>
                        {/* Qui verranno mappate le Card in futuro */}
                    </div>

                </div>
            </section>
        </div>
    )
}

export default EnteProfile;