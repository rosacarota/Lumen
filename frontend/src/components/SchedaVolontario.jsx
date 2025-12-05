import React from 'react';
import { Mail, Phone, Briefcase } from 'lucide-react'; 
import '../stylesheets/SchedaVolontario.css';

// 1. Ricevi onClick dalle props
export default function SchedaVolontario({ utente, onClick }) {
  if (!utente) return null;

  const { nome, cognome, immagine, descrizione, email, recapitoTelefonico, ambito } = utente;
  const iniziali = `${nome?.charAt(0) || ''}${cognome?.charAt(0) || ''}`;

  return (
    // 2. Aggiungi l'evento onClick al div principale
    // 3. Aggiungi style cursor: pointer per far capire che è cliccabile
    <div 
      className="volunteer-card-horizontal" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      
      {/* SEZIONE SINISTRA: AVATAR + DATI PRINCIPALI */}
      <div className="vol-left-group">
        <div className="vol-avatar-horiz">
          {immagine ? (
            <img src={immagine} alt={`${nome} ${cognome}`} className="vol-img" />
          ) : (
            <span className="vol-initials">{iniziali}</span>
          )}
        </div>
        
        <div className="vol-main-info">
          <h3 className="vol-name">{nome} {cognome}</h3>
          
          <div className="vol-badges-row">
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

      {/* SEZIONE DESTRA: CONTATTI */}
      <div className="vol-contacts-group">
        <div className="vol-contact-item">
          <Mail size={16} className="vol-icon" />
          <span>{email}</span>
        </div>
        
        {recapitoTelefonico && (
          <div className="vol-contact-item">
            <Phone size={16} className="vol-icon" />
            <span>{recapitoTelefonico}</span>
          </div>
        )}
      </div>

    </div>
  );
}