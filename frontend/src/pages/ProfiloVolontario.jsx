import React from 'react';
import Navbar from '../components/Navbar';
import AccessoInfoProfilo from '../components/AccessoInfoProfilo';
import BachecaUltimeStorie from '../components/BachecaUltimeStorie';
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
        <section className="voluntary-stories-section">
          <BachecaUltimeStorie />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProfiloVolontario;