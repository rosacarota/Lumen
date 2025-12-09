import React, { useState, useEffect } from 'react'; // Aggiungi useState
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, ShieldCheck, BookOpen } from 'lucide-react';
import '../stylesheets/Home.css';

// --- COMPONENTE PER L'ANIMAZIONE DEI NUMERI ---
const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const start = 0;
    
    // Funzione di Easing per rendere l'animazione più naturale (rallenta alla fine)
    const easeOutExpo = (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Calcola il numero corrente basato sull'easing
      const currentCount = Math.floor(easeOutExpo(progress) * (end - start) + start);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

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
    revealOnScroll(); 

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <>
      <div className="page-wrapper">

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
                {!localStorage.getItem('token') && (
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Inizia ora <ArrowRight size={18} />
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => navigate('/chisiamo')}>
                  Scopri di più
                </button>
              </div>

              {/* --- STATISTICHE ANIMATE --- */}
              <div className="hero-stats">
                <div className="stat-item">
                  <strong>
                    {/* Target numero da raggiungere */}
                    <CountUp end={2} suffix="k+" duration={800} />
                  </strong> 
                  <span>Volontari</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <strong>
                    <CountUp end={150} suffix="+" duration={2500} />
                  </strong> 
                  <span>Enti</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <strong>
                    <CountUp end={500} suffix="+" duration={2200} />
                  </strong> 
                  <span>Eventi</span>
                </div>
              </div>
              {/* --------------------------- */}

            </div>

            <div className="hero-visual">
              <div className="image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Volontariato e comunità"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ... (Il resto delle sezioni FEATURES, STORIES, EVENTS rimangono uguali) ... */}
        
        <section className="features-section reveal fade-up">
           {/* ... Contenuto Features ... */}
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
              <div className="icon-box"><BookOpen size={24} /></div>
              <h3>Racconta</h3>
              <p>Condividi la tua esperienza e ispira la community.</p>
            </div>
          </div>
        </section>

        <section className="stories-section reveal fade-left">
           {/* ... Contenuto Storie ... */}
           <div className="section-content">
            <h2>Storie di Cambiamento</h2>
            <p>Ogni giorno, volontari ed enti lavorano insieme per creare un impatto reale...</p>
            <button className="btn btn-primary" onClick={() => navigate('/storie')}>
              Vai alla Bacheca Storie <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <section className="events-section reveal fade-right">
           {/* ... Contenuto Eventi ... */}
           <div className="section-content">
            <h2>Partecipa agli Eventi</h2>
            <p>Non perdere l'occasione di contribuire attivamente...</p>
            <button className="btn btn-secondary" onClick={() => navigate('/eventi')}>
              Esplora Eventi <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;