import React, { useState, useEffect } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import ModificaProfilo from '../components/ModificaProfilo'; 
import '../stylesheets/InfoProfilo.css';

// Importiamo la funzione per scaricare i dati
import { fetchUserProfile } from '../services/UserServices.js';

const AccessoInfoProfilo = ({ userData: initialData, onUpdate }) => {
    
    // 1. STATO LOCALE DEI DATI
    // Se ci arrivano dati dal padre (initialData) li usiamo subito, altrimenti null
    const [currentUser, setCurrentUser] = useState(initialData || null);
    const [isLoadingData, setIsLoadingData] = useState(!initialData); // Caricamento se non abbiamo dati iniziali
    
    // Stati per la modalità modifica
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);

    // 2. EFFETTO: SCARICA DATI ALL'AVVIO
    useEffect(() => {
        loadData();
    }, []);

    // Funzione per scaricare/aggiornare i dati dal backend
    const loadData = async () => {
        try {
            const data = await fetchUserProfile();
            if (data) {
                setCurrentUser(data);
            }
        } catch (error) {
            console.error("Errore caricamento profilo:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    // 3. LOGICA DI VISUALIZZAZIONE
    // Usiamo 'currentUser' (che contiene i dati scaricati o quelli iniziali)
    const displayTitle = currentUser 
        ? (currentUser.ruolo === 'Ente' ? currentUser.nome : `${currentUser.nome} ${currentUser.cognome}`)
        : "Caricamento...";
    
    const displaySubtitle = currentUser?.ruolo?.toUpperCase() || "";
    const displayDescription = currentUser?.descrizione || "Nessuna descrizione.";
    const displayImage = currentUser?.immagine;

    // --- GESTIONE CLICK "MODIFICA" ---
    const handleEditClick = async () => {
        setIsLoadingEdit(true);
        // Per sicurezza, rinfreschiamo i dati prima di aprire il modale
        // (anche se currentUser dovrebbe essere già aggiornato)
        await loadData();
        setIsEditing(true);
        setIsLoadingEdit(false);
    };

    // --- CHIUSURA MODALE ---
    const handleCloseModal = () => {
        setIsEditing(false);
        
        // Appena chiudiamo il modale, ricarichiamo i dati PER VEDERE SUBITO LE MODIFICHE
        loadData(); 

        // Avvisiamo anche il componente padre se necessario
        if (onUpdate) onUpdate(); 
    };

    if (isLoadingData && !currentUser) {
        return <div className="hero-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>
            <Loader2 className="animate-spin" /> Caricamento profilo...
        </div>;
    }

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
                            // Placeholder grigio se non c'è immagine
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

        {/* Passiamo currentUser al modale */}
        {isEditing && currentUser && (
            <ModificaProfilo 
                isOpen={isEditing} 
                onClose={handleCloseModal} 
                currentUser={currentUser} 
            />
        )}
        </>
    );
};

export default AccessoInfoProfilo;