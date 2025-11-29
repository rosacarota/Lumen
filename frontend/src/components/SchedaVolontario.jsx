import React from 'react';
import { Mail, Phone } from 'lucide-react'; // Assicurati di aver installato: npm install lucide-react
import '../stylesheets/SchedaVolontario.css'; // Creeremo questo CSS sotto

export default function SchedaVolontario({ utente }) {
  // Se utente è null/undefined, non renderizzare nulla per evitare errori
  if (!utente) return null;

  const { nome, cognome, immagine, descrizione, email, recapitoTelefonico } = utente;

  return (
    <div className="volunteer-card">
      
      {/* Header con Immagine e Nome */}
      <div className="vol-header">
        <div className="vol-avatar">
          {immagine ? (
            <img src={immagine} alt={`${nome} ${cognome}`} className="vol-img" />
          ) : (
            // Iniziali se non c'è immagine
            <span className="vol-initials">
              {nome?.charAt(0)}{cognome?.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="vol-info">
          <h3 className="vol-name">{nome} {cognome}</h3>
          <span className="vol-badge">Volontario</span>
        </div>
      </div>

      {/* Descrizione */}
      <div className="vol-body">
        <p className="vol-desc">
          {descrizione || "Nessuna descrizione."}
        </p>
      </div>

      {/* Contatti */}
      <div className="vol-footer">
        <div className="vol-contact-row">
          <Mail size={16} className="vol-icon" />
          <span>{email}</span>
        </div>
        {recapitoTelefonico && (
          <div className="vol-contact-row">
            <Phone size={16} className="vol-icon" />
            <span>{recapitoTelefonico}</span>
          </div>
        )}
      </div>

    </div>
  );
}