import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase } from 'lucide-react'; 
import '../stylesheets/SchedaVolontario.css';

// COSTANTE BACKEND (O importala dal service se preferisci)
const API_BASE_URL = "http://localhost:8080";

export default function SchedaVolontario({ utente, onClick }) {
  // Stato per gestire se l'immagine fallisce il caricamento
  const [imgError, setImgError] = useState(false);

  if (!utente) return null;

  const { nome, cognome, immagine, descrizione, email, recapitoTelefonico, ambito } = utente;
  const iniziali = `${nome?.charAt(0) || ''}${cognome?.charAt(0) || ''}`;

  // Funzione per costruire l'URL corretto dell'immagine
  const getImageUrl = (img) => {
    if (!img) return null;
    // Se è già un URL completo (es. https://...) o Base64 (data:image...), lo usiamo così com'è
    if (img.startsWith("http") || img.startsWith("data:")) {
        return img;
    }
    // Altrimenti, se è un percorso relativo (es. /profile_images/...), ci attacchiamo il dominio del backend
    return `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const finalImageSrc = getImageUrl(immagine);

  return (
    <div 
      className="volunteer-card-horizontal" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      
      {/* SEZIONE SINISTRA: AVATAR + DATI PRINCIPALI */}
      <div className="vol-left-group">
        <div className="vol-avatar-horiz">
          {/* LOGICA: Mostra immagine SOLO se esiste E non ha dato errore */}
          {!imgError && finalImageSrc ? (
            <img 
              src={finalImageSrc} 
              alt={`${nome} ${cognome}`} 
              className="vol-img"
              onError={() => setImgError(true)} // Se non la trova, attiva il fallback
            />
          ) : (
            <span className="vol-initials">{iniziali}</span>
          )}
        </div>
        
        <div className="vol-main-info">
          <h3 className="vol-name">{nome} {cognome}</h3>
          
          <div className="vol-badges-row">
            <span className="vol-badge"><User size={14} strokeWidth={2.5} style={{ marginRight: '6px' }} />Volontario</span>
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