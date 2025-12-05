import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';
import CronologiaEventi from '../components/CronologiaEventi';
import Footer from '../components/Footer';
import '../stylesheets/ProfiloVolontario.css';

import { fetchUserProfile } from '../services/UserServices';

const ProfiloVolontario = () => {
    const location = useLocation();
    
    const visitedUser = location.state?.visitedUser;

    const [isOwner, setIsOwner] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initProfile = async () => {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            const currentUser = userStr ? JSON.parse(userStr) : null;
            if (visitedUser && visitedUser.email !== currentUser?.email) {
                console.log("Modalità Visitatore: visualizzo", visitedUser.email);
                setProfileData(visitedUser);
                setIsOwner(false);
                setLoading(false);
            } 
            else {
                console.log("Modalità Owner: carico il mio profilo");
                setIsOwner(true);
                try {
                    const myData = await fetchUserProfile();
                    setProfileData(myData);
                } catch (error) {
                    console.error("Errore caricamento mio profilo", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        initProfile();
    }, [visitedUser]);

    if (loading) return <div style={{padding:'100px', textAlign:'center'}}>Caricamento...</div>;

    return (
        <div className="voluntary-page-wrapper">
            <Navbar />
            <div className="voluntary-container">
                
                <section className="profile-section-full">
                    <AccessoInfoProfilo 
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
            <Footer />
        </div>
    );
};

export default ProfiloVolontario;