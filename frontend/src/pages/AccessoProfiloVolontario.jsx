import React from 'react';
import Navbar from '../components/Navbar';
import ProfileInfo from '../components/ProfileInfo';
import Footer from '../components/Footer';
import '../stylesheets/AccessoProfiloVolontario.css';

const ProfiloVolontario = () => {
  return (
    <div className="voluntary-page-wrapper">
      <Navbar />
      <div className="voluntary-container">
        <section className="profile-section-full">
          <ProfileInfo />
        </section>
        <section className="future-content-section">
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProfiloVolontario;