import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import InfoProfilo from '../components/InfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';
import CronologiaEventi from '../components/CronologiaEventi';

import '../stylesheets/ProfiloVolontario.css';

import { fetchUserProfile, fetchUserPublicProfile } from '../services/UserServices';

const ProfiloVolontario = () => {
    const location = useLocation();

    const visitedUser = location.state?.visitedUser;

    const [isOwner, setIsOwner] = useState(false);
    const [profileData, setProfileData] = useState(null);
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
            
            const searchEmail = localStorage.getItem('searchEmail');

            if (searchEmail) {
                console.log("Modalità Ricerca: visualizzo", searchEmail);
                try {
                    const publicProfile = await fetchUserPublicProfile(searchEmail);
                    setProfileData(publicProfile);
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
                setIsOwner(false);
                setLoading(false);
            }
            else {
                console.log("Modalità Owner: carico il mio profilo");
                setIsOwner(true);
                try {
                    const myData = currentUser || await fetchUserProfile();
                    setProfileData(myData);
                    if (myData?.email) {
                        localStorage.setItem("searchEmail", myData.email);
                    }
                } catch (error) {
                    console.error("Errore caricamento mio profilo", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        initProfile();
    }, [visitedUser]);

    if (loading) return <div className="loading-text">Caricamento...</div>;

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