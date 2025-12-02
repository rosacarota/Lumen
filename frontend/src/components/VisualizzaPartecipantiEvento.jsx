import React, { useState, useEffect } from 'react';
import { X, Users, ArrowLeft, Mail, Phone } from 'lucide-react';
import SchedaVolontario from './SchedaVolontario';
import { fetchPartecipanti } from '../services/PartecipazioneEventoService';
import '../stylesheets/VisualizzaPartecipanti.css';

export default function VisualizzaPartecipantiEvento({ idEvento, onClose, onBack }) {
  
  const [listaVolontari, setListaVolontari] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      // DEBUG 1: Vediamo se l'ID arriva
      console.log(`[MODALE PARTECIPANTI] Avvio caricamento per ID:`, idEvento);

      if (!idEvento) {
        console.error("[MODALE PARTECIPANTI] Errore: ID Evento mancante!");
        setError("Errore tecnico: ID Evento non ricevuto.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Chiamata al Service
        const data = await fetchPartecipanti(idEvento);
        
        // DEBUG 2: Vediamo cosa risponde il server
        console.log(`[MODALE PARTECIPANTI] Dati ricevuti dal server:`, data);

        setListaVolontari(data);
      } catch (err) {
        console.error(err);
        setError("Errore nel caricamento.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [idEvento]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container-large" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="vp-header">
          <div className="vp-title-group">
            {onBack && (
                <button className="btn-icon-back" onClick={onBack} title="Torna ai dettagli">
                    <ArrowLeft size={20} />
                </button>
            )}
            <div>
                <h2>Partecipanti</h2>
                <p>Evento <strong>#{idEvento}</strong></p>
            </div>
          </div>

          <div className="vp-actions">
             {!loading && (
                <span className="badge-count">
                    <Users size={16} /> {listaVolontari.length}
                </span>
             )}
             <button className="btn-close" onClick={onClose}>
                <X size={24} />
             </button>
          </div>
        </div>

        {/* BODY */}
        <div className="vp-body">
            
            {loading && <p className="status-text">Caricamento in corso...</p>}
            
            {error && <p className="status-text error">{error}</p>}
            
            {!loading && !error && listaVolontari.length === 0 && (
                <div className="empty-state">
                    <Users size={48} color="#cbd5e1" />
                    <p>Non ci sono ancora volontari iscritti.</p>
                    <small>Controlla la console (F12) se pensi che sia un errore.</small>
                </div>
            )}

            <div className="vp-grid">
                {listaVolontari.map((volontario, index) => (
                    // Usiamo index come fallback per la key se email manca
                    <SchedaVolontario 
                        key={volontario?.email || index} 
                        utente={volontario} 
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}