import React, { useState } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import ModificaProfilo from '../components/ModificaProfilo';
import '../stylesheets/InfoProfilo.css';

import { fetchUserForEditing } from '../services/UserService.js'; 

const AccessoInfoProfilo = ({ userData, onUpdate }) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [dataForModal, setDataForModal] = useState(null);

    // Visualizzazione (Fallback se i dati non sono pronti)
    const displayTitle = userData 
        ? (userData.ruolo === 'Ente' ? userData.nome : `${userData.nome} ${userData.cognome}`)
        : "Caricamento...";
    
    // Se userData è null, proviamo a mostrare qualcosa di generico
    const displaySubtitle = userData?.ruolo?.toUpperCase() || "";
    const displayDescription = userData?.descrizione || "Nessuna descrizione.";
    const displayImage = userData?.immagine;

    // --- CLICK GENERICO SU MODIFICA ---
    const handleEditClick = async () => {
        setIsLoadingEdit(true);
        try {
            // 1. Chiamiamo il service SENZA parametri. 
            // Lui prenderà il token, leggerà il ruolo e chiederà i dati al server.
            const freshData = await fetchUserForEditing();
            
            // 2. Se abbiamo dei dati visualizzati parziali, li uniamo per sicurezza
            const mergedData = {
                ...(userData || {}), // Dati vecchi (paracadute)
                ...freshData         // Dati nuovi dal server (vincono loro)
            };

            console.log("Dati pronti per il modale:", mergedData);
            setDataForModal(mergedData);
            setIsEditing(true);

        } catch (error) {
            console.error("Errore recupero dati:", error);
            // Fallback: apriamo comunque con quello che abbiamo
            setDataForModal(userData || {}); 
            setIsEditing(true);
        } finally {
            setIsLoadingEdit(false);
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        if (onUpdate) onUpdate(); 
    };

    return (
        <>
        <div className="hero-wrapper">
            <div className="hero-cover"></div>
            <div className="hero-info-bar">
                <div className="hero-content-inner">
                    <div className="avatar-container">
                        {displayImage ? (
                            <img src={displayImage} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
                        ) : (
                            <span>LOGO</span>
                        )}
                    </div>
                    <div className="ente-text">
                        <h1>{displayTitle}</h1>
                        <h3>{displaySubtitle}</h3>
                        <p>{displayDescription}</p>
                        <div className="stats-row">
                            <button 
                                className="pill" 
                                id="edit-btn" 
                                onClick={handleEditClick} 
                                disabled={isLoadingEdit}
                            >
                                {isLoadingEdit ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}
                                <span style={{marginLeft:'8px'}}>
                                    {isLoadingEdit ? "CARICAMENTO..." : "MODIFICA"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {isEditing && (
            <ModificaProfilo 
                isOpen={isEditing} 
                onClose={handleCloseModal} 
                currentUser={dataForModal} 
            />
        )}
        </>
    );
};

export default AccessoInfoProfilo;