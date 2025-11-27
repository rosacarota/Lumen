import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Heart, Users, ShieldCheck } from 'lucide-react';
import '../stylesheets/Home.css';

const Home = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const revealOnScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      const windowHeight = window.innerHeight;
      const elementVisible = 100;

      reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <section className="hero-section">
          <div className="hero-container">

            <div className="hero-content">
              <span className="hero-badge">Benvenuti su Lumen</span>
              <h1 className="hero-title">
                Insieme per un futuro <span className="highlight">luminoso</span>.
              </h1>
              <p className="hero-description">
                La piattaforma che connette volontari, enti e beneficiari.
                Gestisci eventi, donazioni e servizi in un unico ecosistema digitale semplice e trasparente.
              </p>

              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Inizia ora <ArrowRight size={18} />
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/chisiamo')}>
                  Scopri di più
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <strong>2k+</strong> <span>Volontari</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <strong>150+</strong> <span>Enti</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <strong>500+</strong> <span>Eventi</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              {/* Usa un'immagine reale o questo placeholder di Unsplash */}
              <div className="image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Volontariato e comunità"
                />
              </div>
            </div>

          </div>
        </section>

        {/* 3. FEATURES SECTION (Breve panoramica) */}
        <section className="features-section reveal fade-up">
          <div className="features-grid">

            <div className="feature-card">
              <div className="icon-box"><Users size={24} /></div>
              <h3>Connettiti</h3>
              <p>Trova le associazioni più vicine a te e unisciti a una community attiva.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box"><ShieldCheck size={24} /></div>
              <h3>Sicurezza</h3>
              <p>Ogni ente e volontario è verificato per garantire un aiuto sicuro e trasparente.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box"><Heart size={24} /></div>
              <h3>Dona</h3>
              <p>Supporta le cause che ti stanno a cuore con donazioni semplici e tracciate.</p>
            </div>

          </div>
        </section>

        {/* 4. STORIES SECTION */}
        <section className="stories-section reveal fade-left">
          <div className="section-content">
            <h2>Storie di Cambiamento</h2>
            <p>
              Ogni giorno, volontari ed enti lavorano insieme per creare un impatto reale.
              Leggi le loro esperienze e lasciati ispirare dalle storie di chi sta facendo la differenza.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/storie')}>
              Vai alla Bacheca Storie <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* 5. EVENTS SECTION */}
        <section className="events-section reveal fade-right">
          <div className="section-content">
            <h2>Partecipa agli Eventi</h2>
            <p>
              Non perdere l'occasione di contribuire attivamente.
              Scopri gli eventi, le raccolte fondi e le iniziative in programma vicino a te.
            </p>
            <button className="btn btn-secondary" onClick={() => navigate('/eventi')}>
              Esplora Eventi <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Home;