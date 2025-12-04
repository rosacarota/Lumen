import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Briefcase, User, Building2, ArrowRight, Heart, Map, Search } from 'lucide-react';
import '../stylesheets/RisultatiRicerca.css'; // Assicurati che questo file esista

// MOCK DATA
const MOCK_USERS = [
  {
    id: 1,
    nome: "Croce Rossa Italiana", 
    cognome: null,
    descrizione: "Ci impegniamo quotidianamente per l'assistenza sanitaria e il supporto.",
    ruolo: "Ente",
    ambito: "Sanitario",
    immagine: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=100&q=80",
    indirizzo: { citta: "Milano" }
  },
  {
    id: 2,
    nome: "Mario",
    cognome: "Rossi",
    descrizione: "Studente di psicologia, offro supporto per doposcuola.",
    ruolo: "Volontario",
    ambito: "Sociale",
    immagine: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
    indirizzo: { citta: "Roma" }
  },
  {
    id: 3,
    nome: "Green Earth",
    cognome: null,
    descrizione: "Promuoviamo la sostenibilità ambientale.",
    ruolo: "Ente",
    ambito: "Ambientale",
    immagine: null,
    indirizzo: { citta: "Torino" }
  },
  {
    id: 4,
    nome: "Giulia",
    cognome: "Bianchi",
    descrizione: "Cerco supporto per la spesa settimanale.",
    ruolo: "Beneficiario",
    ambito: null,
    immagine: null,
    indirizzo: { citta: "Firenze" }
  }
];

const RisultatiRicerca = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tutti");
  
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchTerm(query);

    setLoading(true);
    setResults([]);

    setTimeout(() => {
      const allMatches = MOCK_USERS.filter(user => {
        const searchStr = query.toLowerCase();
        const nameMatch = user.nome?.toLowerCase().includes(searchStr);
        const surnameMatch = user.cognome?.toLowerCase().includes(searchStr);
        const ambitoMatch = user.ambito?.toLowerCase().includes(searchStr);
        const cityMatch = user.indirizzo?.citta?.toLowerCase().includes(searchStr);
        return nameMatch || surnameMatch || ambitoMatch || cityMatch;
      });
      setResults(allMatches);
      setLoading(false);
    }, 500);

  }, [location.search]);

  const displayedResults = results.filter(user => {
    if (activeFilter === "Tutti") return true;
    return user.ruolo === activeFilter;
  });

  const getDisplayName = (user) => {
    if (user.ruolo === 'Ente') return user.nome;
    return `${user.nome} ${user.cognome || ''}`.trim();
  };

  const getRoleIcon = (ruolo) => {
    switch (ruolo) {
      case 'Ente': return <Building2 size={14} />;
      case 'Volontario': return <User size={14} />;
      case 'Beneficiario': return <Heart size={14} />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="sr-page-wrapper">
      <Navbar />
      
      <main className="sr-main-content">
        <div className="sr-container">
          
          {/* HEADER */}
          <div className="sr-header">
            <h1>Risultati ricerca</h1>
            <p>
              Risultati per: <span className="sr-query-highlight">"{searchTerm}"</span>
            </p>

            <div className="sr-filter-tabs">
              {['Tutti', 'Ente', 'Volontario', 'Beneficiario'].map((filter) => (
                <button
                  key={filter}
                  className={`sr-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* AREA RISULTATI */}
          {loading ? (
            <div className="sr-loading">
              <div className="sr-spinner"></div>
              <p>Ricerca in corso...</p>
            </div>
          ) : displayedResults.length > 0 ? (
            
            <div className="sr-results-wrapper">
              
              <div className="sr-results-header">
                <span className="sr-count-badge">
                  {displayedResults.length} {displayedResults.length === 1 ? 'profilo trovato' : 'profili trovati'}
                </span>
              </div>

              <div className="sr-results-grid">
                {displayedResults.map((user, index) => (
                  <div 
                    key={index} 
                    className="sr-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="sr-card-header">
                      <div className="sr-avatar-container">
                        {user.immagine ? (
                          <img src={user.immagine} alt="Avatar" className="sr-avatar-img" />
                        ) : (
                          <div className="sr-avatar-placeholder">
                            {user.ruolo === 'Ente' ? <Building2 size={24}/> : <User size={24}/>}
                          </div>
                        )}
                      </div>
                      <span className={`sr-role-badge ${user.ruolo.toLowerCase()}`}>
                        {getRoleIcon(user.ruolo)}
                        {user.ruolo.toUpperCase()}
                      </span>
                    </div>

                    <div className="sr-card-body">
                      <h3 className="sr-user-name">{getDisplayName(user)}</h3>
                      <div className="sr-meta-tags">
                        {user.ambito && (
                          <span className="sr-tag">
                            <Briefcase size={14} /> {user.ambito}
                          </span>
                        )}
                        {user.indirizzo && user.indirizzo.citta && (
                          <span className="sr-tag secondary">
                            <MapPin size={14} /> {user.indirizzo.citta}
                          </span>
                        )}
                      </div>
                      <p className="sr-user-bio">
                        {user.descrizione || "Nessuna descrizione disponibile."}
                      </p>
                    </div>

                    <div className="sr-card-footer">
                      <Link to="#" className="sr-profile-link">
                        Visualizza Profilo <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sr-no-results">
              <div className="sr-no-results-icon">🔍</div>
              <h3>Nessun risultato trovato</h3>
              <p>Non abbiamo trovato {activeFilter !== 'Tutti' ? activeFilter.toLowerCase() : 'utenti'} corrispondenti alla tua ricerca.</p>
            </div>
          )}

          {/* GEO BANNER */}
          <div className="sr-geo-banner">
            <div className="sr-geo-content">
              <div className="sr-geo-text">
                <h3>Non sei soddisfatto della ricerca?</h3>
                <p>Mettiti in contatto con enti e volontari vicino a te.</p>
              </div>
              <Link to="/ricerca-geografica" className="sr-geo-button">
                <Map size={20} />
                Prova la Ricerca Geografica
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RisultatiRicerca;