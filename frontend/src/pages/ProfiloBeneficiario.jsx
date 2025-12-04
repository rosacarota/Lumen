import React from 'react';
import Navbar from '../components/Navbar';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';
import Footer from '../components/Footer';
import '../stylesheets/ProfiloBeneficiario.css';

const ProfiloBeneficiario = () => {
  return (
    <div className="beneficiary-page-wrapper">
      <Navbar />
      <div className="beneficiary-container">
        <section className="profile-section-full">
          <AccessoInfoProfilo />
        </section>
        <section className="beneficiary-stories-section">
          <BachecaRacconti />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProfiloBeneficiario;