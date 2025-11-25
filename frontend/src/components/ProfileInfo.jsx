import React from 'react';
import '../stylesheets/ProfileInfo.css';

const ProfileInfo = ({ 
    // Valori di default
    title = "UniCiock",
    subtitle = "ENTE",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stat1 = "4k followers",
    stat2 = "20 eventi",
    
    // --- I COLLEGAMENTI (PROPS) ---
    isFollowing, // Riceve lo stato (vero/falso) da EnteProfile
    onToggle     // Riceve la funzione handleFollowClick da EnteProfile
}) => {
    return (
        <div className="hero-wrapper">
            
            {/* Parte Superiore Scura */}
            <div className="hero-cover"></div>

            {/* Parte Inferiore Verde Chiaro */}
            <div className="hero-info-bar">
                <div className="hero-content-inner">
                    
                    {/* Avatar */}
                    <div className="avatar-container">
                        <span style={{color:'#ccc'}}>LOGO</span>
                    </div>

                    {/* Testo e Bottoni */}
                    <div className="ente-text">
                        <h1>{title}</h1>
                        <h3>{subtitle}</h3>
                        <p>{description}</p>
                        
                        <div className="stats-row">
                            <span className="pill">{stat1}</span>
                            <span className="pill">{stat2}</span>
                            
                            {/* --- IL BOTTONE ORA È COLLEGATO --- */}
                            <button 
                                // Cambia classe se è seguito (diventa scuro) o no
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                
                                // Quando clicchi, chiama la funzione del padre
                                onClick={onToggle}
                            >
                                {/* Cambia testo */}
                                {isFollowing ? 'Seguito' : 'Segui'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;