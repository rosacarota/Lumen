import React, { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';
import EventCard from '../components/EventCard.jsx';
import '../stylesheets/CronologiaEventi.css';

import { getCronologiaEventi } from '../services/CronologiaEventiService';
import { fetchEvents } from '../services/PartecipazioneEventoService';

const CronologiaEventi = () => {
    const [listaEventi, setListaEventi] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const inizializzaDati = async () => {
            setIsLoading(true);
            try {
                const [partecipazioniRaw, catalogoEventi] = await Promise.all([
                    getCronologiaEventi(localStorage.getItem("searchUser")),
                    fetchEvents()
                ]);
                const partecipazioni = Array.isArray(partecipazioniRaw) ? partecipazioniRaw : [];
                const tuttiGliEventi = Array.isArray(catalogoEventi) ? catalogoEventi : [];
                const eventiUtenteCompleti = tuttiGliEventi.filter(eventoGlobale => 
                    partecipazioni.some(partecipazione => partecipazione.id === eventoGlobale.idEvento)
                );
                setListaEventi(eventiUtenteCompleti);
            } catch (error) {
                console.error("Errore durante l'elaborazione della cronologia:", error);
                setListaEventi([]);
            } finally {
                setIsLoading(false);
            }
        };
        inizializzaDati();
    }, []);

    return (
        <div className="cronologia-card">
            <div className="cronologia-header">
                <h3>CRONOLOGIA EVENTI</h3>
            </div>
            <div className="cronologia-body">
                {isLoading ? (
                    <div className="loading-text">
                        Caricamento storico...
                    </div>
                ) : listaEventi.length === 0 ? (
                    <div className="empty-state-event">
                        <div className="cronologia-icon-wrapper">
                            <CalendarClock size={40} color="#4AAFB8" />
                        </div>
                        <p>L'utente non ha ancora partecipato a eventi.</p>
                    </div>
                ) : (
                    <div className="cronologia-list">
                        {listaEventi.map((evento) => (
                            <div key={evento.idEvento} className="cronologia-item-wrapper">
                                <EventCard
                                    event={evento}
                                    showParticipate={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CronologiaEventi;