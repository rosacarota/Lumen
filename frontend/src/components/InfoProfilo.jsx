import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import ModificaProfilo from './ModificaProfilo.jsx';
import '../stylesheets/InfoProfilo.css';

// Servizio
import { fetchUserProfile, fetchUserPublicProfile } from '../services/UserServices.js';

const InfoProfilo = ({ userData: propsData, onUpdate }) => {


    const [userData, setUserData] = useState(propsData || null);
    const [loading, setLoading] = useState(!propsData);
    const [isEditing, setIsEditing] = useState(false);

    const currentUserEmail = localStorage.getItem('email');

    const isOwner = useMemo(() => {
        if (!userData?.email || !currentUserEmail) return false;
        return userData.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase();
    }, [userData, currentUserEmail]);

    useEffect(() => {
        if (propsData) {
            setUserData(propsData);
            setLoading(false);
            return;
        }

        const getData = async () => {
            try {
                const searchEmail = localStorage.getItem('searchEmail');
                if (!searchEmail) {
                    // Fallback to current user if no search email? Or handle error?
                    // Assuming fallback to current user based on user intent history, or just load nothing.
                    // But let's check if we have a searchEmail, if not maybe we are viewing own profile?
                    // Original code had logic for this.
                    // For now, let's assume searchEmail is target if propsData missing.
                }

                let profile = null;
                if (!searchEmail && currentUserEmail) {
                    profile = await fetchUserProfile();
                } else {
                    profile = await fetchUserPublicProfile(searchEmail);
                    if (profile && currentUserEmail && profile.email.toLowerCase() === currentUserEmail.toLowerCase()) {
                        profile = await fetchUserProfile();
                    }
                }

                setUserData(profile);
            } catch (error) {
                console.error("Errore caricamento profilo:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [propsData, currentUserEmail]);

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

export default InfoProfilo;