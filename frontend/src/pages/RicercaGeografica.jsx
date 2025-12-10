import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import VisualizzaRicercaGeografica from '../components/VisualizzaRicercaGeografica';
import { Users, HeartHandshake, GraduationCap, Leaf, HeartPulse, Siren, Loader2 } from 'lucide-react';
import '../stylesheets/RicercaGeografica.css';
import useRicercaGeografica from '../services/RicercaGeograficaService.js'; // Assicurati che il path sia corretto

const ambiti = [
    { id: 'Strengthening Communities', label: 'Strengthening Communities', icon: Users, description: 'Supporto e sviluppo delle comunità locali' },
    { id: 'Helping Neighbors in Need', label: 'Helping Neighbors in Need', icon: HeartHandshake, description: 'Assistenza diretta alle persone in difficoltà' },
    { id: 'Education', label: 'Education', icon: GraduationCap, description: 'Promozione dell\'istruzione e della cultura' },
    { id: 'Environment', label: 'Environment', icon: Leaf, description: 'Salvaguardia e tutela dell\'ambiente' },
    { id: 'Health', label: 'Health', icon: HeartPulse, description: 'Cura della salute e benessere' },
    { id: 'Emergency Preparedness', label: 'Emergency Preparedness', icon: Siren, description: 'Prevenzione e gestione delle emergenze' }
];

const RicercaGeografica = () => {
    const [selectedAmbito, setSelectedAmbito] = useState(null);
    const [selectedRole, setSelectedRole] = useState('all'); // 'all', 'Ente', 'Volontario'

    // Utilizzo dell'hook personalizzato per la logica API
    const { results, isLoading, error, fetchResults, setResults } = useRicercaGeografica();

    const handleSelect = (id) => {
        const newAmbito = selectedAmbito === id ? null : id;
        setSelectedAmbito(newAmbito);

        if (newAmbito) {
            fetchResults(newAmbito); // Chiama l'API
        } else {
            setResults([]); // Pulisce se deselezionato
        }
    };

    // Filtra i risultati API lato client per il ruolo (l'ambito è già filtrato dal backend)
    const filteredResults = results.filter(user => {
        // Nota: il backend filtra già per ambito geografico e categoria.
        // Qui filtriamo solo visivamente per ruolo se l'utente usa i bottoni.
        const matchRole = selectedRole === 'all' ? true : user.ruolo === selectedRole;
        return matchRole;
    });

    return (
        <div className="geo-page page-enter-animation">


            <div className="geo-hero">
                <div className="geo-hero-inner">
                    <div className="geo-hero-content">
                        <h1>Esplora il Mondo del Volontariato</h1>
                        <p>
                            Grazie alla nostra <strong>Intelligenza Artificiale GREG-AI</strong>, analizziamo le tue esigenze per connetterti con gli enti e i volontari più vicini e adatti a te. Seleziona una categoria e lascia che la tecnologia faccia il resto.
                        </p>
                    </div>

                    <div className="geo-mascot-container">
                        <img src="/greg.png" alt="Greg AI Mascot" className="geo-mascot" />
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="geo-circle c1"></div>
                <div className="geo-circle c2"></div>
            </div>

            <div className="geo-main-container">

                {/* SEZIONE FILTRI (AMBITI) */}
                <div className="geo-section-header">
                    <h2>Filtra per Ambito</h2>
                    <p>Clicca su una card per visualizzare i profili relativi</p>
                </div>

                <div className="geo-grid">
                    {ambiti.map((ambito) => {
                        const Icon = ambito.icon;
                        const isSelected = selectedAmbito === ambito.id;

                        return (
                            <div
                                key={ambito.id}
                                className={`geo-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelect(ambito.id)}
                            >
                                <div className="geo-card-icon">
                                    <Icon size={32} />
                                </div>
                                <h3>{ambito.label}</h3>
                                <p>{ambito.description}</p>
                                <div className="geo-card-check">
                                    {isSelected && <div className="check-dot"></div>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SEZIONE RISULTATI */}
                <div className="geo-results-section">
                    <div className="geo-results-header">
                        <div className="geo-results-title-group">
                            <h3>
                                {selectedAmbito
                                    ? `Risultati per: ${ambiti.find(a => a.id === selectedAmbito)?.label}`
                                    : "Seleziona una categoria per iniziare"}
                            </h3>
                            <span className="geo-count-badge">{filteredResults.length} trovati</span>
                        </div>

                        <div className="geo-role-filter">
                            <button
                                className={`geo-filter-btn ${selectedRole === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('all')}
                            >
                                Tutti
                            </button>
                            <button
                                className={`geo-filter-btn ${selectedRole === 'Ente' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('Ente')}
                            >
                                Enti
                            </button>
                            <button
                                className={`geo-filter-btn ${selectedRole === 'Volontario' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('Volontario')}
                            >
                                Volontari
                            </button>
                        </div>
                    </div>

                    {/* Logica di rendering condizionale per Loading, Errori e Risultati */}
                    {isLoading ? (
                        <div className="geo-loading" style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto', color: 'var(--primary-color)' }} />
                            <p style={{ marginTop: '1rem', color: '#666' }}>Ricerca profili compatibili in corso...</p>
                        </div>
                    ) : error ? (
                        <div className="geo-error" style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                            <p>{error}</p>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="geo-results-grid">
                            {filteredResults.map((user, index) => (
                                <Link
                                    key={index}
                                    to={`/profilo${user.ruolo ? user.ruolo.toLowerCase() : ''}`}
                                    onClick={() => {
                                        if (user.email) {
                                            localStorage.setItem('searchEmail', user.email);
                                        }
                                    }}
                                    style={{ textDecoration: 'none', display: 'block' }}
                                >
                                    <VisualizzaRicercaGeografica data={user} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="geo-no-results">
                            <p>{selectedAmbito ? "Nessun risultato trovato per questa categoria nella tua zona." : "Clicca su una card sopra per cercare."}</p>
                        </div>
                    )}
                </div>

            </div>


        </div>
    );
};

export default RicercaGeografica;
