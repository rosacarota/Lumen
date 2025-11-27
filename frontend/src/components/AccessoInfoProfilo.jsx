import React, { useState } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import ModificaProfilo from '../components/ModificaProfilo'; // Assicurati che il percorso sia giusto
import '../stylesheets/InfoProfilo.css';

// Importiamo la funzione corretta dal Service che abbiamo appena creato
import { fetchUserProfile } from '../services/UserServices.js';

const AccessoInfoProfilo = ({ userData, onUpdate }) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [dataForModal, setDataForModal] = useState(null);

    // --- VISUALIZZAZIONE ---
    // Usiamo i dati passati dal padre (userData) per mostrare il profilo
    const displayTitle = userData 
        ? (userData.ruolo === 'Ente' ? userData.nome : `${userData.nome} ${userData.cognome}`)
        : "Caricamento...";
    
    const displaySubtitle = userData?.ruolo?.toUpperCase() || "";
    const displayDescription = userData?.descrizione || "Nessuna descrizione.";
    const displayImage = userData?.immagine;

    // --- GESTIONE CLICK "MODIFICA" ---
    const handleEditClick = async () => {
        setIsLoadingEdit(true);
        try {
            // 1. Scarichiamo i dati freschi dal server usando la funzione corretta
            const freshData = await fetchUserProfile();
            
            // 2. Uniamo i dati (quelli freschi hanno la precedenza)
            const mergedData = {
                ...(userData || {}), // Dati attuali come base
                ...(freshData || {}) // Dati nuovi sovrascrivono
            };

            console.log("Dati pronti per il modale:", mergedData);
            setDataForModal(mergedData);
            setIsEditing(true);

        } catch (error) {
            console.error("Errore recupero dati per modifica:", error);
            // Fallback: se la fetch fallisce, apriamo il modale con i dati che abbiamo già in pagina
            setDataForModal(userData || {}); 
            setIsEditing(true);
        } finally {
            setIsLoadingEdit(false);
        }
    };

    // --- CHIUSURA MODALE ---
    const handleCloseModal = () => {
        setIsEditing(false);
        // Chiamiamo onUpdate (passato dal genitore) per ricaricare la pagina principale
        // e mostrare subito le modifiche appena salvate
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
                            <img 
                                src={displayImage} 
                                alt="Profile" 
                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} 
                            />
                        ) : (
                            <div style={{width:'100%', height:'100%', background:'#ccc', borderRadius:'50%'}}></div>
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
                                {isLoadingEdit ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Pencil size={16} />
                                )}
                                <span style={{marginLeft:'8px'}}>
                                    {isLoadingEdit ? "CARICAMENTO..." : "MODIFICA"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Renderizziamo il modale solo quando serve e se abbiamo i dati */}
        {isEditing && dataForModal && (
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