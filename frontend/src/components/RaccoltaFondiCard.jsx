import React from 'react';
import { CalendarRange, Ban } from 'lucide-react';
import '../stylesheets/RaccoltafondiCard.css';

// Rimuovi l'import del service da qui, ci pensa il padre (ProfiloEnte)
// import { terminaRaccolta } from '../services/RaccoltaFondiService'; 

export default function RaccoltaFondiCard({ 
  id_raccolta,
  titolo, 
  descrizione, 
  obiettivo = 0, 
  totale_raccolto = 0, 
  data_apertura, 
  data_chiusura, 
  ente, 
  isOwner = false,
  onTerminate // <--- Questa è la funzione che arriva da ProfiloEnte
}) {

  // Funzione locale semplice che chiama quella del padre
  const handleTerminateClick = () => {
    if (onTerminate) {
      // Passiamo l'ID al padre, che farà tutto il lavoro e aggiornerà la lista
      onTerminate(id_raccolta);
    }
  };

  // Calcolo percentuale
  const percentuale = obiettivo > 0 
    ? Math.min((totale_raccolto / obiettivo) * 100, 100) 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fund-card" id={`fund-${id_raccolta}`}>
      <div className="fund-header">
        <div className="fund-avatar">
          {/* Gestione sicura se ente è un oggetto o una stringa */}
          {typeof ente === 'string' ? ente.charAt(0).toUpperCase() : 'E'}
        </div>
        <div className="fund-meta">
          <span className="fund-brand">
             {typeof ente === 'string' ? ente : "Ente Promotore"}
          </span>
          <span className="fund-role">Raccolta Fondi</span>
        </div>
      </div>

      <div className="fund-body">
        <h3 className="fund-title">{titolo || "Titolo Raccolta"}</h3>
        <p className="fund-description">
          {descrizione 
            ? (descrizione.length > 70 ? descrizione.substring(0, 70) + '...' : descrizione)
            : "Sostieni questa causa ..."}
        </p>
      </div>

      <div className="fund-progress-section">
        <div className="fund-stats">
          <span className="current-amount">{formatCurrency(totale_raccolto)}</span>
          <span className="goal-amount">di {formatCurrency(obiettivo)}</span>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${percentuale}%` }}></div>
        </div>
        
        <div className="progress-percentage">
          {Math.round(percentuale)}% raggiunto
        </div>
      </div>

      <div className="fund-details">
        <div className="fund-detail-row">
          <span className="fund-icon"><CalendarRange size={16} /></span>
          <span>{formatDate(data_apertura)} - {formatDate(data_chiusura)}</span>
        </div>
      </div>

      {isOwner && (
        <button 
          className="terminate-btn" 
          onClick={handleTerminateClick} // Chiama la funzione locale che chiama onTerminate
          title="Chiudi anticipatamente questa raccolta"
        >
          <Ban size={18} className="btn-icon" />
          Termina Raccolta
        </button>
      )}
    </div>
  );
}