import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import '../stylesheets/VisualizzaRicercaGeografica.css';

export default function VisualizzaRicercaGeografica({ data }) {
    const defaultData = {
        email: "filippoparisi@yahoo.it",
        nome: "Filippo",
        cognome: "Parisi",
        indirizzo: {
            idIndirizzo: 15,
            citta: "Brooklyn",
            provincia: "NY",
            cap: "11217",
            strada: "Nevins St",
            nCivico: 21
        },
        recapitoTelefonico: "333000011",
        ambito: "Strengthening Communities",
        ruolo: "Volontario"
    };

    const displayData = data || defaultData;

    // Helper per l'immagine
    const renderAvatar = () => {
        if (displayData.immagine) {
            const src = displayData.immagine.startsWith('data:') || displayData.immagine.startsWith('http')
                ? displayData.immagine
                : `data:image/jpeg;base64,${displayData.immagine}`;
            return <img src={src} alt="Profile" className="vrg-avatar-img" />;
        }
        return (
            <span className="vrg-avatar-initials">
                {displayData.nome ? displayData.nome.charAt(0).toUpperCase() : 'U'}
                {displayData.cognome ? displayData.cognome.charAt(0).toUpperCase() : ''}
            </span>
        );
    };

    return (
        <div className="vrg-card">
            <div className="vrg-card-header">
                <div className="vrg-avatar">
                    {renderAvatar()}
                </div>
                <div className="vrg-info-main">
                    <h3>{displayData.nome} {displayData.cognome}</h3>

                    <div className="vrg-badges">
                        {/* Etichetta Ruolo */}
                        {displayData.ruolo && (
                            <span className={`vrg-badge-role ${displayData.ruolo.toLowerCase()}`}>
                                {displayData.ruolo}
                            </span>
                        )}
                        {/* Etichetta Ambito */}
                        {displayData.ambito && <span className="vrg-badge-ambito">{displayData.ambito}</span>}
                    </div>
                </div>
            </div>

            <div className="vrg-card-body">
                <div className="vrg-info-row">
                    <MapPin size={16} />
                    <span>
                        {displayData.indirizzo?.strada} {displayData.indirizzo?.nCivico}, {displayData.indirizzo?.citta} ({displayData.indirizzo?.provincia}) {displayData.indirizzo?.cap}
                    </span>
                </div>
                <div className="vrg-info-row">
                    <Mail size={16} />
                    <span>{displayData.email}</span>
                </div>
                <div className="vrg-info-row">
                    <Phone size={16} />
                    <span>{displayData.recapitoTelefonico}</span>
                </div>
            </div>
        </div>
    );
}
