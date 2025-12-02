import React, { useState, useEffect } from 'react';
// Importiamo le icone necessarie: Pencil/Loader per il bottone, Mail/Phone/MapPin per i dati
import { Pencil, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import ModificaProfilo from '../components/ModificaProfilo'; 
import '../stylesheets/InfoProfilo.css';

// Servizio per ricaricare i dati se modificati
import { fetchUserProfile } from '../services/UserServices.js';

const AccessoInfoProfilo = ({ userData: initialData, onUpdate }) => {
    
    // 1. STATI
    const [currentUser, setCurrentUser] = useState(initialData || null);
    const [isLoadingData, setIsLoadingData] = useState(!initialData);
    
    // Stati per la modalità modifica
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    
    // Stato per sapere se l'utente che guarda è il proprietario
    const [isOwner, setIsOwner] = useState(false);

    // 2. EFFETTO: GESTIONE DATI E PERMESSI
    useEffect(() => {
        // Se arrivano dati dal padre (es. ProfiloEnte), li impostiamo
        if (initialData) {
            setCurrentUser(initialData);
            checkOwnership(initialData);
            setIsLoadingData(false);
        } else {
            // Se non arrivano dati, li scarichiamo (significa che siamo sul "mio" profilo dashboard)
            loadData();
        }
    }, [initialData]);

    // Funzione per capire se l'utente loggato è il proprietario del profilo visualizzato
    const checkOwnership = (profileData) => {
        const token = localStorage.getItem('token');
        if (!token || !profileData) {
            setIsOwner(false);
            return;
        }

        try {
            // Decodifica manuale del token JWT per prendere l'email (sub)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            const loggedInEmail = payload.sub; // 'sub' contiene l'email dell'utente loggato

            // Confrontiamo l'email del token con l'email del profilo visualizzato
            if (loggedInEmail === profileData.email) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }

        } catch (error) {
            console.error("Errore decodifica token:", error);
            setIsOwner(false);
        }
    };

    // Funzione per scaricare i dati dal backend (usata se non passati o dopo modifica)
    const loadData = async () => {
        try {
            const data = await fetchUserProfile();
            if (data) {
                setCurrentUser(data);
                // Se scarico i miei dati tramite fetchUserProfile, sono per forza il proprietario
                setIsOwner(true); 
            }
        } catch (error) {
            console.error("Errore caricamento profilo:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    // 3. LOGICA DI VISUALIZZAZIONE
    const displayTitle = currentUser 
        ? (currentUser.ruolo === 'Ente' ? currentUser.nome : `${currentUser.nome} ${currentUser.cognome}`)
        : "Caricamento...";
    
    const displaySubtitle = currentUser?.ruolo?.toUpperCase() || "";
    const displayDescription = currentUser?.descrizione || "Nessuna descrizione.";
    const displayImage = currentUser?.immagine;

    // Gestione Apertura Modale
    const handleEditClick = async () => {
        setIsLoadingEdit(true);
        await loadData(); // Rinfresca i dati per sicurezza
        setIsEditing(true);
        setIsLoadingEdit(false);
    };

    // Gestione Chiusura Modale
    const handleCloseModal = () => {
        setIsEditing(false);
        loadData(); // Ricarica i dati aggiornati
        if (onUpdate) onUpdate(); // Avvisa il padre
    };

    if (isLoadingData && !currentUser) {
        return (
            <div className="hero-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>
                <Loader2 className="animate-spin" /> Caricamento...
            </div>
        );
    }

    return (
        <>
        <div className="hero-wrapper">
            <div className="hero-cover"></div>
            <div className="hero-info-bar">
                <div className="hero-content-inner">
                    
                    {/* AVATAR */}
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

                    {/* TESTI E INFO */}
                    <div className="ente-text">
                        <h1>{displayTitle}</h1>
                        <h3>{displaySubtitle}</h3>
                        <p>{displayDescription}</p>
                        
                        {/* --- BOX DATI PERSONALI (Visibile solo all'Owner) --- */}
                        {isOwner && currentUser && (
                            <div className="owner-details-grid">
                                
                                {/* Email */}
                                <div className="detail-item">
                                    <Mail size={16} strokeWidth={2.5} />
                                    <span>{currentUser.email || "Email non presente"}</span>
                                </div>

                                {/* Telefono */}
                                <div className="detail-item">
                                    <Phone size={16} strokeWidth={2.5} />
                                    <span>{currentUser.telefono || "Nessun telefono"}</span>
                                </div>

                                {/* Città (Gestiamo se indirizzo è null o oggetto) */}
                                <div className="detail-item">
                                    <MapPin size={16} strokeWidth={2.5} />
                                    <span>
                                        {currentUser.indirizzo?.citta 
                                            ? `${currentUser.indirizzo.citta} (${currentUser.indirizzo.provincia || ''})` 
                                            : "Città non specificata"}
                                    </span>
                                </div>
                            </div>
                        )}
                        {/* --------------------------------------------------- */}
                        
                        {/* BOTTONE MODIFICA (Visibile solo all'Owner) */}
                        {isOwner && (
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
                                        {isLoadingEdit ? "CARICAMENTO..." : "MODIFICA PROFILO"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* MODALE DI MODIFICA */}
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