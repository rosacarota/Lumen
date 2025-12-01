import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import '../stylesheets/BachecaUltimeStorie.css';
import AggiungiStoria from './AddStory';

const BachecaUltimeStorie = () => {
    const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
    return (
        <>
        <div className="stories-card">
            <div className="stories-header">
                <h3>STORIE DELL'ACCOUNT</h3>
            </div>
            <div className="stories-body">
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <Camera size={32} color="#4AAFB8" />
                    </div>
                    <p>Non ci sono storie attive.</p>
                    <div className="empty-icon-wrapper add-action" 
                         onClick={() => setIsAddStoryOpen(true)}
                         title="Crea una nuova storia"
                    >
                        <Plus size={32} color="#4AAFB8" />
                        </div>
                    <p>Aggiungi storia</p>
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
        {isAddStoryOpen && (
            <AggiungiStoria onClose={() => setIsAddStoryOpen(false)} />
        )}
        </>
    );
};

export default BachecaUltimeStorie;