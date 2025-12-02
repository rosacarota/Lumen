import React from 'react';
import { Mail, Phone, Briefcase } from 'lucide-react'; 
import '../stylesheets/SchedaVolontario.css';

export default function SchedaVolontario({ utente }) {
  if (!utente) return null;

  const { nome, cognome, immagine, descrizione, email, recapitoTelefonico, ambito } = utente;

  const iniziali = `${nome?.charAt(0) || ''}${cognome?.charAt(0) || ''}`;

  return (
    <div className="volunteer-card">
      
      {/* HEADER */}
      <div className="vol-header">
        <div className="vol-avatar">
          {immagine ? (
            <img src={immagine} alt={`${nome} ${cognome}`} className="vol-img" />
          ) : (
            <span className="vol-initials">{iniziali}</span>
          )}
        </div>
        
        <div className="vol-info">
          <h3 className="vol-name">{nome} {cognome}</h3>
          
          {/* --- MODIFICA QUI --- */}
          {/* flexDirection: 'column' manda gli elementi uno sotto l'altro */}
          {/* alignItems: 'flex-start' li allinea a sinistra senza stirarli */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <span className="vol-badge">Volontario</span>
            
            {ambito && (
              <span className="vol-ambito">
                <Briefcase size={12} style={{marginRight: '4px'}}/> 
                {ambito}
              </span>
            )}
          </div>
          
        </div>
      </div>

      {/* BODY */}
      <div className="vol-body">
        <p className="vol-desc">
          {descrizione ? `"${descrizione}"` : "Nessuna descrizione disponibile."}
        </p>
      </div>

      {/* FOOTER */}
      <div className="vol-footer">
        <div className="vol-contact-row">
          <Mail className="vol-icon" />
          <span>{email}</span>
        </div>
        
        {recapitoTelefonico && (
          <div className="vol-contact-row">
            <Phone className="vol-icon" />
            <span>{recapitoTelefonico}</span>
          </div>
        )}
      </div>

    </div>
  );
}