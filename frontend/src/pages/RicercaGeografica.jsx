import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VisualizzaRicercaGeografica from '../components/VisualizzaRicercaGeografica';
import { Users, HeartHandshake, GraduationCap, Leaf, HeartPulse, Siren } from 'lucide-react';
import '../stylesheets/RicercaGeografica.css';

const ambiti = [
    { id: 'Strengthening Communities', label: 'Strengthening Communities', icon: Users, description: 'Supporto e sviluppo delle comunità locali' },
    { id: 'Helping Neighbors in Need', label: 'Helping Neighbors in Need', icon: HeartHandshake, description: 'Assistenza diretta alle persone in difficoltà' },
    { id: 'Education', label: 'Education', icon: GraduationCap, description: 'Promozione dell\'istruzione e della cultura' },
    { id: 'Environment', label: 'Environment', icon: Leaf, description: 'Salvaguardia e tutela dell\'ambiente' },
    { id: 'Health', label: 'Health', icon: HeartPulse, description: 'Cura della salute e benessere' },
    { id: 'Emergency Preparedness', label: 'Emergency Preparedness', icon: Siren, description: 'Prevenzione e gestione delle emergenze' }
];

// Dati Mock per simulare i risultati
const mockUsers = [
    {
        email: "filippoparisi@yahoo.it",
        nome: "Filippo",
        cognome: "Parisi",
        indirizzo: { citta: "Brooklyn", provincia: "NY", cap: "11217", strada: "Nevins St", nCivico: 21 },
        recapitoTelefonico: "333000011",
        ambito: "Strengthening Communities",
        ruolo: "Volontario"
    },
    {
        email: "mariarossi@gmail.com",
        nome: "Maria",
        cognome: "Rossi",
        indirizzo: { citta: "Roma", provincia: "RM", cap: "00100", strada: "Via Roma", nCivico: 10 },
        recapitoTelefonico: "333123456",
        ambito: "Education",
        ruolo: "Ente"
    },
    {
        email: "giovanniverdi@libero.it",
        nome: "Giovanni",
        cognome: "Verdi",
        indirizzo: { citta: "Milano", provincia: "MI", cap: "20100", strada: "Corso Italia", nCivico: 5 },
        recapitoTelefonico: "333987654",
        ambito: "Environment",
        ruolo: "Volontario"
    },
    {
        email: "lucabianchi@hotmail.com",
        nome: "Luca",
        cognome: "Bianchi",
        indirizzo: { citta: "Napoli", provincia: "NA", cap: "80100", strada: "Via Toledo", nCivico: 33 },
        recapitoTelefonico: "333456789",
        ambito: "Health",
        ruolo: "Ente"
    },
    {
        email: "annaneri@outlook.com",
        nome: "Anna",
        cognome: "Neri",
        indirizzo: { citta: "Torino", provincia: "TO", cap: "10100", strada: "Via Po", nCivico: 12 },
        recapitoTelefonico: "333112233",
        ambito: "Helping Neighbors in Need",
        ruolo: "Volontario"
    },
    {
        email: "paologialli@gmail.com",
        nome: "Paolo",
        cognome: "Gialli",
        indirizzo: { citta: "Firenze", provincia: "FI", cap: "50100", strada: "Ponte Vecchio", nCivico: 1 },
        recapitoTelefonico: "333998877",
        ambito: "Emergency Preparedness",
        ruolo: "Ente"
    }
];

const RicercaGeografica = () => {
    const [selectedAmbito, setSelectedAmbito] = useState(null);
    const [selectedRole, setSelectedRole] = useState('all'); // 'all', 'Ente', 'Volontario'

    const handleSelect = (id) => {
        setSelectedAmbito(selectedAmbito === id ? null : id);
    };

    // Filtra i risultati in base all'ambito selezionato e al ruolo
    const filteredResults = mockUsers.filter(user => {
        const matchAmbito = selectedAmbito ? user.ambito === selectedAmbito : true;
        const matchRole = selectedRole === 'all' ? true : user.ruolo === selectedRole;
        return matchAmbito && matchRole;
    });

    return (
        <div className="geo-page">
            <Navbar />

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
                                    : "Tutti i profili"}
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

                    {filteredResults.length > 0 ? (
                        <div className="geo-results-grid">
                            {filteredResults.map((user, index) => (
                                <VisualizzaRicercaGeografica key={index} data={user} />
                            ))}
                        </div>
                    ) : (
                        <div className="geo-no-results">
                            <p>Nessun risultato trovato per questa categoria.</p>
                        </div>
                    )}
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default RicercaGeografica;
