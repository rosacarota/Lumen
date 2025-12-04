import React from 'react';
import Navbar from '../components/Navbar';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';
import CronologiaEventi from '../components/CronologiaEventi';
import Footer from '../components/Footer';
import '../stylesheets/ProfiloVolontario.css';

const ProfiloVolontario = () => {
    return (
        <div className="voluntary-page-wrapper">
            <Navbar />
            <div className="voluntary-container">
                <section className="profile-section-full">
                    <AccessoInfoProfilo />
                </section>
                <div className="voluntary-split-layout">
                    <section className="voluntary-stories-section">
                        <BachecaRacconti />
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