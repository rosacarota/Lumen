import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import InfoProfilo from '../components/InfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';
import CronologiaEventi from '../components/CronologiaEventi';

import '../stylesheets/ProfiloVolontario.css';

import { fetchUserProfile, fetchUserPublicProfile } from '../services/UserServices';
import AffiliazioneService from '../services/AffiliazioneService';
import RicercaService from '../services/RicercaService';
import { Building2 } from 'lucide-react';


const ProfiloVolontario = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const visitedUser = location.state?.visitedUser;

    const [isOwner, setIsOwner] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [affiliante, setAffiliante] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initProfile = async () => {
            setLoading(true);
            let currentUser = null;
            try {
                currentUser = await fetchUserProfile();
            } catch {
                const userStr = localStorage.getItem('user');
                currentUser = userStr ? JSON.parse(userStr) : null;
            }

            let finalProfileStr = null;
            const searchEmail = localStorage.getItem('searchEmail');

            if (searchEmail) {
                console.log("Modalità Ricerca: visualizzo", searchEmail);
                try {
                    const publicProfile = await fetchUserPublicProfile(searchEmail);
                    setProfileData(publicProfile);
                    finalProfileStr = publicProfile;
                    const isMe = currentUser && (currentUser.email === searchEmail);
                    setIsOwner(isMe);
                } catch (error) {
                    console.error("Errore caricamento profilo ricercato", error);
                } finally {
                    setLoading(false);
                }
            }
            else if (visitedUser && visitedUser.email !== currentUser?.email) {
                console.log("Modalità Visitatore: visualizzo", visitedUser.email);
                setProfileData(visitedUser);
                finalProfileStr = visitedUser;
                setIsOwner(false);
                setLoading(false);
            }
            else {
                console.log("Modalità Owner: carico il mio profilo");
                setIsOwner(true);
                try {
                    const myData = currentUser || await fetchUserProfile();
                    setProfileData(myData);
                    finalProfileStr = myData;
                    if (myData?.email) {
                        localStorage.setItem("searchEmail", myData.email);
                    }
                } catch (error) {
                    console.error("Errore caricamento mio profilo", error);
                } finally {
                    setLoading(false);
                }
            }

            if (finalProfileStr?.email) {
                try {
                    let response = await AffiliazioneService.getAffiliante(finalProfileStr.email);
                    console.log("RESPONSE GET AFFILIANTE:", response);
                    if (response && response.email === finalProfileStr.email && response.nome) {
                        try {
                            console.log("Tentativo recupero email ente via ricerca per nome:", response.nome);
                            const searchResults = await RicercaService.cercaUtenti(response.nome);
                            const foundEnte = searchResults.find(u => u.nome === response.nome && u.ruolo === 'Ente');
                            if (foundEnte) {
                                console.log("Ente trovato:", foundEnte);
                                response = { ...response, email: foundEnte.email };
                            }
                        } catch (searchErr) {
                            console.error("Errore ricerca ente fallback:", searchErr);
                        }
                    }

                    if (response && response.email) {
                        setAffiliante(response);
                    }
                } catch (err) {
                    console.error("Impossibile caricare affiliante:", err);
                }
            }
        };

        initProfile();
    }, [visitedUser]);

    if (loading) return <div className="loading-text">Caricamento...</div>;

    const handleAffiliateClick = (emailEnte) => {
        console.log("Navigazione verso profilo ente:", emailEnte);
        localStorage.setItem('searchEmail', emailEnte);
        navigate('/profiloente');
    };

    return (
        <div className="voluntary-page-wrapper">
            <div className="voluntary-container">
                <section className="profile-section-v">
                    <InfoProfilo
                        userData={profileData}
                        isOwner={isOwner}
                    />
                </section>
                <div className="voluntary-split-layout">
                    <section className="voluntary-left-sidebar">
                        {affiliante && (
                            <div
                                onClick={() => handleAffiliateClick(affiliante.email)}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                    marginBottom: '24px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className="affiliation-header">
                                    <h3>Affiliazione</h3>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#4F46E5'
                                        }}>
                                            <Building2 size={24} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1F2937' }}>{affiliante.nome}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280' }}>{affiliante.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                    <section className="voluntary-stories-section">
                        <BachecaRacconti
                            isOwner={isOwner}
                            targetEmail={profileData ? profileData.email : null}
                        />
                    </section>
                    <section className="voluntary-events-section">
                        <CronologiaEventi />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfiloVolontario;