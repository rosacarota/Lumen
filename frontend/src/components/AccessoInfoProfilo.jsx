import React, { useState, useEffect } from 'react';
import { Pencil, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import ModificaProfilo from '../components/ModificaProfilo'; 
import '../stylesheets/InfoProfilo.css';

// Servizio
import { fetchUserProfile } from '../services/UserServices.js';

const AccessoInfoProfilo = ({ userData: propsData, isOwner: propsIsOwner, onUpdate }) => {
    
    const [userData, setUserData] = useState(propsData || null);
    const [isOwner, setIsOwner] = useState(propsIsOwner || false);
    const [loading, setLoading] = useState(!propsData); 
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (propsData) {
            setLoading(false);
            return;
        }

        const getData = async () => {
            try {
                const data = await fetchUserProfile(); 
                setUserData(data);
                setIsOwner(true); 
            } catch (error) {
                console.error("Errore caricamento profilo:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [propsData]); 

    const displayTitle = userData 
        ? (userData.ruolo === 'Ente' ? userData.nome : `${userData.nome} ${userData.cognome}`)
        : "Caricamento...";
    
    const displaySubtitle = userData?.ruolo?.toUpperCase() || "";
    const displayDescription = userData?.descrizione || "Nessuna descrizione disponibile.";
    const displayImage = userData?.immagine;

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        if (onUpdate) onUpdate(); 
        window.location.reload(); 
    };

    if (loading) {
        return <div className="hero-wrapper"><Loader2 className="animate-spin" /></div>;
    }

    if (!userData) {
        return <div className="hero-wrapper"><p>Impossibile caricare il profilo.</p></div>;
    }

    return (
        <>
        <div className="hero-wrapper">
             <div className="hero-cover"></div>
             <div className="hero-info-bar">
                <div className="hero-content-inner">
                    <div className="avatar-container">
                        {displayImage ? (
                            <img src={displayImage} alt="Profile" className="profile-img" />
                        ) : (
                            <div className="profile-img-placeholder"></div>
                        )}
                    </div>
                    <div className="ente-text">
                        <h1>{displayTitle}</h1>
                        <h3>{displaySubtitle}</h3>
                        <p>{displayDescription}</p>
                        
                        {isOwner && (
                            <div className="owner-dashboard">
                                <div className="owner-details-grid">
                                    <div className="detail-item">
                                        <Mail size={16} /> <span>{userData.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Phone size={16} /> <span>{userData.recapitoTelefonico || "N/A"}</span>
                                    </div>
                                    <div className="detail-item">
                                        <MapPin size={16} /> 
                                        <span>
                                            {userData.citta ? `${userData.strada}, ${userData.citta}` : "Indirizzo non completo"}
                                        </span>
                                    </div>
                                </div>
                                <button className="pill edit-btn" onClick={handleEditClick}>
                                    <Pencil size={16} />
                                    <span>MODIFICA PROFILO</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {isOwner && isEditing && (
            <ModificaProfilo 
                isOpen={isEditing} 
                onClose={handleCloseModal} 
                currentUser={userData} 
            />
        )}
        </>
    );
};

export default AccessoInfoProfilo;