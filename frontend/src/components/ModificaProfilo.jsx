import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building2, Save, X, 
  Camera, Briefcase, Home, Map, ArrowLeft 
} from 'lucide-react';

// Assicurati che questo file CSS esista, oppure usa quello di EditProfile.css rinominandolo
import '../stylesheets/ModificaProfilo.css'; 

// IMPORTANTE: Importiamo la funzione per salvare dal Service
import { updateUserProfile } from '../services/UserServices.js'; 

export default function ModificaProfilo({ isOpen, onClose, currentUser }) {
  
  // 1. Stato del Form
  const [formData, setFormData] = useState({
     nome: '', 
     cognome: '', 
     email: '', 
     descrizione: '', 
     recapitoTelefonico: '', 
     ambito: '', 
     ruolo: '', 
     immagine: '',
     citta: '', 
     provincia: '', 
     cap: '', 
     strada: '', 
     ncivico: ''
  });
  
  const [loading, setLoading] = useState(false);

  // 2. Effetto: Quando il modale si apre, copia i dati dell'utente nel form
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        ...currentUser, 
        // Usiamo || '' per evitare che i campi diventino "uncontrolled" se i dati sono null
        strada: currentUser.strada || '',
        ncivico: currentUser.ncivico || '',
        citta: currentUser.citta || '',
        provincia: currentUser.provincia || '',
        cap: currentUser.cap || '',
        recapitoTelefonico: currentUser.recapitoTelefonico || '',
        descrizione: currentUser.descrizione || '',
        ambito: currentUser.ambito || '',
        immagine: currentUser.immagine || ''
      });
    }
  }, [isOpen, currentUser]);

  // Se il modale è chiuso, non renderizzare nulla
  if (!isOpen) return null;

  // 3. Gestione cambiamento input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Gestione Salvataggio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Chiama il service per inviare i dati al backend
      await updateUserProfile(formData);
      
      alert("Profilo aggiornato con successo!");
      
      // Chiude il modale (il padre si occuperà di ricaricare i dati grazie a onUpdate)
      onClose(); 
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper per mostrare campi diversi se l'utente è un Ente
  const renderAnagraficaFields = () => {
    if (formData.ruolo === 'Ente') {
      return (
        <>
          <div className="input-group">
            <Building2 className="input-icon" />
            <input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              placeholder="Nome Ente" 
              className="input-field"
            />
          </div>
          <div className="input-group">
            <User className="input-icon" />
            <input 
              type="text" 
              name="cognome" 
              value={formData.cognome} 
              onChange={handleChange} 
              placeholder="Nome Referente" 
              className="input-field"
            />
          </div>
        </>
      );
    } else {
      // Caso Utente/Volontario standard
      return (
        <div className="row-2">
          <div className="input-group">
            <User className="input-icon" />
            <input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              placeholder="Nome" 
              className="input-field"
            />
          </div>
          <div className="input-group">
            <User className="input-icon" />
            <input 
              type="text" 
              name="cognome" 
              value={formData.cognome} 
              onChange={handleChange} 
              placeholder="Cognome" 
              className="input-field"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Cliccando sul contenuto, l'evento non si propaga (il modale non si chiude) */}
      <div className="edit-container" onClick={(e) => e.stopPropagation()}>
        
        {/* --- LATO SINISTRO (Anteprima) --- */}
        <div className="preview-panel">
          <div className="preview-content">
             <button className="back-button" onClick={onClose}>
               <ArrowLeft size={18} /> Chiudi
             </button>
             
             <div className="avatar-container">
               <img 
                 src={formData.immagine || "https://via.placeholder.com/150"} 
                 alt="Avatar" 
                 className="avatar-image" 
               />
             </div>
             
             <h2 className="preview-name">{formData.nome}</h2>
             <p className="preview-bio">{formData.descrizione || "Nessuna descrizione..."}</p>
          </div>
        </div>

        {/* --- LATO DESTRO (Form) --- */}
        <div className="form-panel">
          <div className="form-wrapper">
             
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h1 className="page-title">Modifica Profilo</h1>
                <X onClick={onClose} style={{cursor:'pointer'}} />
             </div>
            
            <form onSubmit={handleSubmit} className="form-grid">
              
              {/* Sezione Anagrafica */}
              <div className="section-title"><User size={16}/> Anagrafica</div>
              {renderAnagraficaFields()}
              
              {/* Sezione Contatti */}
              <div className="section-title"><Phone size={16}/> Contatti</div>
              <div className="row-2">
                 <div className="input-group">
                    <Mail className="input-icon" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      disabled 
                      className="input-field" 
                      title="L'email non può essere modificata"
                    />
                 </div>
                 <div className="input-group">
                    <Phone className="input-icon" />
                    <input 
                      type="text" 
                      name="recapitoTelefonico" 
                      value={formData.recapitoTelefonico} 
                      onChange={handleChange} 
                      placeholder="Telefono" 
                      className="input-field"
                    />
                 </div>
              </div>

              {/* Sezione Indirizzo */}
              <div className="section-title"><MapPin size={16}/> Indirizzo</div>
              <div className="row-3">
                <div className="input-group" style={{flex: 2}}>
                  <Home className="input-icon" />
                  <input 
                    type="text" 
                    name="strada" 
                    value={formData.strada} 
                    onChange={handleChange} 
                    placeholder="Via" 
                    className="input-field"
                  />
                </div>
                <div className="input-group" style={{flex: 1}}>
                  <input 
                    type="text" 
                    name="ncivico" 
                    value={formData.ncivico} 
                    onChange={handleChange} 
                    placeholder="N." 
                    className="input-field"
                  />
                </div>
              </div>
              <div className="row-3">
                 <div className="input-group" style={{flex: 2}}>
                    <Map className="input-icon" />
                    <input 
                      type="text" 
                      name="citta" 
                      value={formData.citta} 
                      onChange={handleChange} 
                      placeholder="Città" 
                      className="input-field"
                    />
                 </div>
                 <div className="input-group" style={{flex: 1}}>
                    <input 
                      type="text" 
                      name="provincia" 
                      value={formData.provincia} 
                      onChange={handleChange} 
                      placeholder="PR" 
                      maxLength={2} 
                      className="input-field"
                    />
                 </div>
                 <div className="input-group" style={{flex: 1}}>
                    <input 
                      type="text" 
                      name="cap" 
                      value={formData.cap} 
                      onChange={handleChange} 
                      placeholder="CAP" 
                      className="input-field"
                    />
                 </div>
              </div>

              {/* Sezione Dettagli */}
              <div className="section-title"><Briefcase size={16}/> Dettagli</div>
              <div className="input-group">
                <Briefcase className="input-icon" />
                <input 
                  type="text" 
                  name="ambito" 
                  value={formData.ambito} 
                  onChange={handleChange} 
                  placeholder="Ambito (es. Ambientale)" 
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <textarea 
                  name="descrizione" 
                  value={formData.descrizione} 
                  onChange={handleChange} 
                  placeholder="Descrizione profilo..." 
                  rows="4" 
                  className="textarea-field"
                />
              </div>
              <div className="input-group">
                <Camera className="input-icon" />
                <input 
                  type="text" 
                  name="immagine" 
                  value={formData.immagine} 
                  onChange={handleChange} 
                  placeholder="URL Immagine profilo" 
                  className="input-field"
                />
              </div>

              {/* Pulsanti Azione */}
              <div className="action-buttons">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Annulla
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Salvataggio...' : <><Save size={18}/> Salva</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}