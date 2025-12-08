import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import { MapPin, Briefcase, User, Building2, ArrowRight, Heart, Map, SearchX } from 'lucide-react';
import '../stylesheets/RisultatiRicerca.css';
import RicercaService from '../services/RicercaService.js';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tutti");
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchTerm(query);

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await RicercaService.cercaUtenti(query);
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("Si è verificato un errore durante la ricerca.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [location.search]);

  // Filtro lato client
  const displayedResults = results.filter(user => {
    if (activeFilter === "Tutti") return true;
    return user.ruolo && user.ruolo.toLowerCase() === activeFilter.toLowerCase();
  });

  const getDisplayName = (user) => {
    if (user.ruolo && user.ruolo.toLowerCase() === 'ente') {
      return user.nome;
    }
    return `${user.nome} ${user.cognome || ''}`.trim();
  };

  const getRoleIcon = (ruolo) => {
    if (!ruolo) return <User size={14} />;
    switch (ruolo.toLowerCase()) {
      case 'ente': return <Building2 size={14} />;
      case 'volontario': return <User size={14} />;
      case 'beneficiario': return <Heart size={14} />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="sr-page-wrapper">


      <main className="sr-main-content">
        <div className="sr-container">

          <div className="sr-header">
            <h1>Risultati ricerca</h1>
            <p>
              Risultati per: <span className="sr-query-highlight">{searchTerm}</span>
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

          {loading ? (
            <div className="sr-loading">
              <div className="sr-spinner"></div>
              <p>Ricerca in corso...</p>
            </div>
          ) : error ? (
            <div className="sr-no-results">
              <h3>Errore</h3>
              <p>{error}</p>
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
                    key={user.id || index}
                    className="sr-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="sr-card-header">
                      <div className="sr-avatar-container">
                        {user.immagine ? (
                          <img src={user.immagine} alt="Avatar" className="sr-avatar-img" />
                        ) : (
                          <div className="sr-avatar-placeholder">
                            {user.ruolo && user.ruolo.toLowerCase() == 'ente' ? <Building2 size={24} /> : <User size={24} />}
                          </div>
                        )}
                      </div>
                      <span className={`sr-role-badge ${user.ruolo ? user.ruolo.toLowerCase() : 'default'}`}>
                        {getRoleIcon(user.ruolo)}
                        {user.ruolo ? user.ruolo.toUpperCase() : 'UTENTE'}
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
                      {/* Link al profilo: usa ID se c'è, altrimenti placeholder */}
                      <Link
                        to={`/profilo${user.ruolo ? user.ruolo.toLowerCase() : ''}`}
                        className="sr-profile-link"
                        onClick={() => {
                          if (user.email) {
                            localStorage.setItem('searchEmail', user.email);
                          }
                        }}
                      >
                        Visualizza Profilo <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sr-no-results">
              <div className="sr-no-results-icon"><SearchX size={65}></SearchX></div>
              <h3>Nessun risultato trovato</h3>
              <p>Non abbiamo trovato {activeFilter !== 'Tutti' ? activeFilter.toLowerCase() : 'utenti'} corrispondenti alla tua ricerca "{searchTerm}".</p>
            </div>
          )}

          <div className="sr-geo-banner">
            <div className="sr-geo-content">
              <div className="sr-geo-text">
                <h3>Non sei soddisfatto della ricerca?</h3>
                <p>Esplora la mappa interattiva e trova enti e volontari vicino a te.</p>
              </div>
              <Link to="/ricercageografica" className="sr-geo-button">
                <Map size={20} />
                Prova la Ricerca Geografica
              </Link>
            </div>
          </div>

        </div>
      </main>


    </div>
  );
};

export default SearchResults;