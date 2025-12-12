import React from 'react';

import InfoProfilo from '../components/InfoProfilo';
import BachecaRacconti from '../components/BachecaRacconti';

import '../stylesheets/ProfiloBeneficiario.css';

const ProfiloBeneficiario = () => {

  const searchEmail = localStorage.getItem('searchEmail');
  const currentUserEmail = localStorage.getItem('email');
  const targetEmail = searchEmail || currentUserEmail;
  const isOwner = !searchEmail || (currentUserEmail && searchEmail.toLowerCase() === currentUserEmail.toLowerCase());

  return (
    <div className="beneficiary-page-wrapper">

      <div className="beneficiary-container">
        <section className="profile-section-b">
          <InfoProfilo />
        </section>
        <section className="beneficiary-stories-section">
          <BachecaRacconti isOwner={isOwner} targetEmail={targetEmail} />
        </section>
      </div>

    </div>
  );
};

export default ProfiloBeneficiario;