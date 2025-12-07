import React from 'react';
import Navbar from '../components/Navbar';
import InfoProfilo from '../components/InfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';
import Footer from '../components/Footer';
import '../stylesheets/ProfiloBeneficiario.css';

const ProfiloBeneficiario = () => {

  const searchEmail = localStorage.getItem('searchEmail');
  const currentUserEmail = localStorage.getItem('email');

  // Se c'è una mail di ricerca, usiamo quella, altrimenti quella dell'utente loggato
  const targetEmail = searchEmail || currentUserEmail;

  // isOwner è true se NON c'è searchEmail oppure se coincidono
  const isOwner = !searchEmail || (currentUserEmail && searchEmail.toLowerCase() === currentUserEmail.toLowerCase());

  return (
    <div className="beneficiary-page-wrapper">
      <Navbar />
      <div className="beneficiary-container">
        <section className="profile-section-full">
          <InfoProfilo />
        </section>
        <section className="beneficiary-stories-section">
          <BachecaRacconti isOwner={isOwner} targetEmail={targetEmail} />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProfiloBeneficiario;