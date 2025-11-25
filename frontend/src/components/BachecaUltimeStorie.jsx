import React from 'react';
import { Camera } from 'lucide-react'; // Assicurati di avere lucide-react installato
import '../stylesheets/BachecaUltimeStorie.css';

const BachecaUltimeStorie = () => {
    return (
        <div className="stories-card">
            {/* Header: Bianco con testo Turchese scuro */}
            <div className="stories-header">
                <h3>ULTIME STORIE</h3>
            </div>
            
            {/* Corpo: Gradiente verde chiaro (preso dal tuo style.loginPage) */}
            <div className="stories-body">
                
                {/* Placeholder: Quando non ci sono storie */}
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <Camera size={32} color="#4AAFB8" />
                    </div>
                    <p>Non ci sono nuove storie</p>
                </div>

                {/* ESEMPIO DI COME APPARIRANNO LE STORIE (Decommenta per vedere) */}
                {/* <div className="story-item">
                    <div className="story-avatar"></div>
                    <div className="story-info">
                        <h4>Evento di Beneficenza</h4>
                        <span>2 ore fa</span>
                    </div>
                </div> 
                */}

            </div>
        </div>
    );
};

export default BachecaUltimeStorie;