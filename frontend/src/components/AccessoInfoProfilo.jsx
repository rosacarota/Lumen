import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import ModificaProfilo from '../components/ModificaProfilo';
import '../stylesheets/InfoProfilo.css';

const AccessoInfoProfilo = ({ 
    title = "UniCiock",
    subtitle = "ENTE",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stat1 = "4000 Followers",
    stat2 = "20 Eventi",
}) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <>
        <div className="hero-wrapper">
            <div className="hero-cover"></div>
            <div className="hero-info-bar">
                <div className="hero-content-inner">
                    <div className="avatar-container">
                        <span>LOGO</span>
                    </div>
                    <div className="ente-text">
                        <h1>{title}</h1>
                        <h3>{subtitle}</h3>
                        <p>{description}</p>
                        <div className="stats-row">
                            <span className="pill">{stat1}</span>
                            <span className="pill">{stat2}</span>
                            <button className="pill" id="edit-btn" onClick={() => setIsEditing(true)}>
                                <Pencil size={16} style={{ marginRight: '8px' }} />
                                MODIFICA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isEditing && (
                <ModificaProfilo 
                    isOpen={isEditing} 
                    onClose={() => setIsEditing(false)} 
                />
            )}
        </>
    );
};

export default AccessoInfoProfilo;