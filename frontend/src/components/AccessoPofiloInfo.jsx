import React from 'react';
import { Pencil } from 'lucide-react'; // Importiamo l'icona
import '../stylesheets/ProfileInfo.css'; // O '../stylesheets/EnteProfile.css' a seconda della tua struttura

const AccessoProfileInfo = ({ 
    // Valori di default
    title = "UniCiock",
    subtitle = "ENTE",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stat1 = "4k followers",
    stat2 = "20 eventi",
    
    // --- NUOVO PROP ---
    onEdit // Funzione per gestire il click su Modifica
}) => {
    return (
        <div className="hero-wrapper">
            
            <div className="hero-cover"></div>

            <div className="hero-info-bar">
                <div className="hero-content-inner">
                    
                    {/* Avatar */}
                    <div className="avatar-container">
                        <span>LOGO</span>
                    </div>

                    {/* Testo e Bottoni */}
                    <div className="ente-text">
                        <h1>{title}</h1>
                        <h3>{subtitle}</h3>
                        <p>{description}</p>
                        
                        <div className="stats-row">
                            <span className="pill">{stat1}</span>
                            <span className="pill">{stat2}</span>
                            
                            {/* --- PULSANTE MODIFICA (Sostituisce Segui) --- */}
                            <button className="edit-btn" onClick={onEdit}>
                                <Pencil size={16} style={{ marginRight: '8px' }} />
                                MODIFICA
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessoProfileInfo;