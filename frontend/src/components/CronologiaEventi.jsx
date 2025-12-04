import React, { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';
import EventCard from '../components/EventCard.jsx'; 
import '../stylesheets/CronologiaEventi.css';
import { getCronologiaEventi } from '../services/CronologiaEventiService';

const CronologiaEventi = () => {
    const [eventi, setEventi] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchEventi = async () => {
            setLoading(true);
            try {
                const data = await getCronologiaEventi(null);
                const listaEventi = Array.isArray(data) ? data : [];
                setEventi(listaEventi);
            } catch (error) {
                console.error("Errore nel componente Cronologia:", error);
                setEventi([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEventi();
    }, []);
    return (
        <div className="cronologia-card">
            <div className="cronologia-header">
                <h3>CRONOLOGIA EVENTI</h3>
            </div>
            <div className="cronologia-body">
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
                        Caricamento partecipazioni...
                    </div>
                ) : eventi.length === 0 ? (
                    <div className="empty-state-event">
                        <CalendarClock size={40} color="#4AAFB8" />
                        <p>Non hai ancora partecipato a nessun evento.</p>
                    </div>
                ) : (
                    <div className="cronologia-list">
                        {eventi.map((evento) => (
                            <div key={evento.idEvento || evento.id} className="cronologia-item-wrapper">
                                {/* 
                                    showParticipate={true}: 
                                    La card controllerà lo stato e mostrerà "Iscritto" (Verde),
                                    permettendo all'utente di disiscriversi.
                                */}
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