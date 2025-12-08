import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Loader2, Mail, Phone, MapPin, HandHeart, UserPlus } from 'lucide-react';
import ModificaProfilo from './ModificaProfilo.jsx';
import '../stylesheets/InfoProfilo.css';
import { fetchUserProfile, fetchUserPublicProfile } from '../services/UserServices.js';

import RichiestaAffiliazione from './RichiestaAffiliazione.jsx';
import RichiestaServizio from './RichiestaServizio.jsx';

const InfoProfilo = ({ userData: propsData, onUpdate }) => {

    const [userData, setUserData] = useState(propsData || null);
    const [loading, setLoading] = useState(!propsData);
    const [isEditing, setIsEditing] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showAffiliationModal, setShowAffiliationModal] = useState(false);

    const currentUserEmail = localStorage.getItem('email');
    const currentUserRole = localStorage.getItem('ruolo');

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

    const handleCloseModal = (saved = false) => {
        setIsEditing(false);
        if (saved) {
            if (onUpdate) onUpdate();
            window.location.reload();
        }
    };

    const renderActionButton = () => {
        if (isOwner) {
            return (
                <button className="pill edit-btn" onClick={handleEditClick}>
                    <Pencil size={16} />
                    <span>MODIFICA PROFILO</span>
                </button>
            );
        }
        if (!userData || !currentUserRole) return null;

        const visitorRole = currentUserRole.toLowerCase();
        const targetRole = userData.ruolo.toLowerCase();

        if (visitorRole === 'ente') {
            return null;
        }

        if (visitorRole === 'beneficiario') {
            if (targetRole === 'ente' || targetRole === 'volontario') {
                return (
                    <button className="pill edit-btn" onClick={() => setShowServiceModal(true)}>
                        <HandHeart size={16} />
                        <span>RICHIEDI SERVIZIO</span>
                    </button>
                );
            }
            return null;
        }

        if (visitorRole === 'volontario') {
            if (targetRole === 'ente') {
                return (
                    <button className="pill edit-btn" onClick={() => setShowAffiliationModal(true)}>
                        <UserPlus size={16} />
                        <span>RICHIEDI AFFILIAZIONE</span>
                    </button>
                );
            }
            return null;
        }

        return null;
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
                        <div className="profile-main-info">
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
                                </div>
                            </div>
                        </div>
                        <div className="profile-actions-right">
                            {renderActionButton()}
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
            {!isOwner && showServiceModal && (
                <RichiestaServizio
                    isModal={true}
                    onClose={() => setShowServiceModal(false)}
                    enteDestinatarioEmail={userData.email}
                />
            )}
            {!isOwner && showAffiliationModal && (
                <RichiestaAffiliazione
                    isModal={true}
                    onClose={() => setShowAffiliationModal(false)}
                    emailEnte={userData.email}
                />
            )}
        </>
    );
};

export default InfoProfilo;