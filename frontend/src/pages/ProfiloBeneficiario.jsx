import React from 'react';
import Navbar from '../components/Navbar';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo';
import BachecaUltimeStorie from '../components/BachecaUltimeStorie';
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
          <BachecaUltimeStorie />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProfiloBeneficiario;