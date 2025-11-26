import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building2, Save, X, // Ho sostituito ArrowLeft con X per il modale, o puoi tenere ArrowLeft
  Camera, Briefcase, Lock, Home, Map, ArrowLeft 
} from 'lucide-react';
import '../stylesheets/EditProfile.css';

// --- MOCK DATA ---
const MOCK_USER_DATA = {
  email: 'mario.volontario@lumen.com',
  nome: 'Mario', 
  cognome: 'Rossi',
  password: 'passwordSegreta',
  descrizione: 'Appassionato di natura e aiuto sociale.',
  recapitoTelefonico: '3331234567',
  ambito: 'Ambientale',
  ruolo: 'Volontario', 
  immagine: 'https://i.pravatar.cc/150?img=68',
  citta: 'Milano',
  provincia: 'MI',
  cap: '20100',
  strada: 'Via Garibaldi',
  ncivico: '10'
};

// --- COMPONENTE MODALE ---
export default function EditProfileModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(MOCK_USER_DATA);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Se il modale non è aperto, non renderizzare nulla
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Le password non coincidono!");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      console.log("Dati aggiornati:", formData);
      alert("Profilo aggiornato!");
      setLoading(false);
      onClose(); // Chiudi il modale dopo il salvataggio
    }, 1000);
  };

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
    // Overlay scuro (cliccando fuori si chiude)
    <div className="modal-overlay" onClick={onClose}>
      {/* Contenitore Modale (cliccando dentro NON si chiude) */}
      <div className="edit-container" onClick={(e) => e.stopPropagation()}>
        {/* --- LATO SINISTRO --- */}
        <div className="preview-panel">
          <div className="blur-circle circle-1"></div>
          <div className="blur-circle circle-2"></div>
          <div className="preview-content">
            {/* Tasto Chiudi/Indietro */}
            <button className="back-button" onClick={onClose}>
              <ArrowLeft size={18} /> Chiudi
            </button>
            <div className="avatar-container">
              <img src={formData.immagine} alt="Avatar" className="avatar-image" />
              <button className="camera-button" type="button">
                <Camera size={20} color="#087886" />
              </button>
            </div>
            <h2 className="preview-name">
              {formData.nome} {formData.ruolo !== 'Ente' && formData.cognome}
            </h2>
            <div className="role-badge">{formData.ruolo}</div>
            <p className="preview-bio">"{formData.descrizione}"</p>
          </div>
        </div>
        {/* --- LATO DESTRO --- */}
        <div className="form-panel">
          <div className="form-wrapper">
            {/* Header Form */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1 className="page-title">Modifica Profilo</h1>
                {/* Opzionale: X per chiudere anche qui */}
                <button onClick={onClose} style={{border:'none', background:'transparent', cursor:'pointer', color:'#aaa'}}>
                    <X size={24}/>
                </button>
            </div>
            <p className="page-subtitle">Aggiorna le informazioni del tuo account</p>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="section-title"><User size={16}/> Anagrafica</div>
              {renderAnagraficaFields()}
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
                    maxLength={10}
                    className="input-field"
                  />
                </div>
              </div>
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
                  <span className="input-icon" style={{fontSize:'12px', fontWeight:'bold'}}>N.</span>
                  <input
                    type="number"
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
                  <span className="input-icon" style={{fontSize:'10px'}}>PR</span>
                  <input
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    placeholder="PR"
                    maxLength={2}
                    className="input-field"
                    style={{textTransform: 'uppercase'}}
                  />
                </div>
                <div className="input-group" style={{flex: 1}}>
                  <span className="input-icon" style={{fontSize:'10px'}}>CAP</span>
                  <input
                    type="text"
                    name="cap"
                    value={formData.cap}
                    onChange={handleChange}
                    placeholder="CAP"
                    maxLength={5}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="section-title"><Briefcase size={16}/> Dettagli</div>
              <div className="input-group">
                <Briefcase className="input-icon" />
                <input
                  type="text"
                  name="ambito"
                  value={formData.ambito}
                  onChange={handleChange}
                  placeholder="Ambito"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <textarea
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                  placeholder="Descrizione..."
                  rows="4"
                  className="textarea-field"
                />
              </div>
              <div className="section-title" style={{color: '#d64545'}}><Lock size={16}/> Sicurezza</div>
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Password Attuale"
                  className="input-field"
                />
              </div>
              <div className="row-2">
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nuova Password"
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Conferma"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="action-buttons">
                {/* Tasto Annulla chiude il modale */}
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Annulla
                </button>
                <button type="submit" className="btn-save">
                  {loading ? 'Salvataggio...' : <><Save size={18}/> Salva Modifiche</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}