import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Building2, Building, Save, X,
  Camera, Briefcase, Home, Map, ArrowLeft, MapPinHouse, Landmark
} from 'lucide-react';
import Swal from 'sweetalert2';
import '../stylesheets/ModificaProfilo.css';
import { updateUserProfile } from '../services/UserServices.js';
import { REGEX } from '../utils/loginValidation.js';

export default function ModificaProfilo({ isOpen, onClose, currentUser }) {

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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        ...currentUser,
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
      setErrors({});
    }
  }, [isOpen, currentUser]);
 

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, immagine: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    const isEnte = formData.ruolo === 'Ente';

    // Nome / Nome Ente
    if (!formData.nome?.trim()) newErrors.nome = "Il nome è obbligatorio";
    else {
      if (isEnte) {
        if (!REGEX.ALPHANUMERIC_NAME.test(formData.nome)) newErrors.nome = "Caratteri non validi (solo lettere e numeri)";
      } else {
        if (!REGEX.ONLY_LETTERS.test(formData.nome)) newErrors.nome = "Il nome può contenere solo lettere";
      }
    }

    // Cognome (solo se non Ente)
    if (!isEnte) {
      if (!formData.cognome?.trim()) newErrors.cognome = "Il cognome è obbligatorio";
      else if (!REGEX.ONLY_LETTERS.test(formData.cognome)) newErrors.cognome = "Il cognome può contenere solo lettere";
    }

    // Telefono
    if (formData.recapitoTelefonico && !REGEX.PHONE.test(formData.recapitoTelefonico)) {
      newErrors.recapitoTelefonico = "Il numero deve essere di 10 cifre";
    }

    // Indirizzo: Se uno dei campi è compilato, tutti (eccetto civico) diventano obbligatori
    const hasAnyAddress = formData.strada || formData.ncivico || formData.citta || formData.provincia || formData.cap;

    if (hasAnyAddress) {
      if (!formData.strada?.trim()) newErrors.strada = "Via obbligatoria";
      if (!formData.citta?.trim()) newErrors.citta = "Città richiesta";
      if (!formData.provincia?.trim()) newErrors.provincia = "Provincia richiesta";
      if (!formData.cap?.trim()) newErrors.cap = "CAP richiesto";

      // Validazioni formato se presenti (o se obbligati e l'utente ha scritto qualcosa di sbagliato)
      if (formData.citta && !REGEX.ONLY_LETTERS.test(formData.citta)) newErrors.citta = "Solo lettere";
      if (formData.provincia && !REGEX.PROVINCIA.test(formData.provincia)) newErrors.provincia = "2 lettere maiuscole (es. MI)";
      if (formData.cap && !REGEX.CAP.test(formData.cap)) newErrors.cap = "Deve essere 5 cifre";
      if (formData.ncivico && !REGEX.CIVICO.test(formData.ncivico)) newErrors.ncivico = "Solo numeri";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MODIFICA IMPORTANTE QUI ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // Swal.fire removed as per user request (red texts are enough)
      return;
    }

    setLoading(true);

    try {
      // Attendiamo che il server salvi i dati
      await updateUserProfile(formData);

      // Chiudiamo SUBITO il modale (così l'utente vede la pagina sotto)
      onClose(true);

      // Mostriamo l'alert di successo
      Swal.fire({
        icon: 'success',
        title: 'Salvato!',
        text: 'Profilo aggiornato con successo!',
        confirmButtonColor: '#087886'
      });

    } catch (error) {
      console.error("Errore salvataggio:", error);

      // In caso di errore, NON chiudiamo il modale per permettere di riprovare,
      // ma mostriamo l'alert di errore sopra il modale.
      Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: "Errore durante il salvataggio: " + error.message,
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ field }) => errors[field] ? <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>{errors[field]}</div> : null;

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
              className={`input-field ${errors.nome ? 'input-error' : ''}`}
            />
          </div>
          <ErrorMsg field="nome" />
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
              className={`input-field ${errors.nome ? 'input-error' : ''}`}
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
              className={`input-field ${errors.cognome ? 'input-error' : ''}`}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="edit-container" onClick={(e) => e.stopPropagation()}>

        {/* --- LATO SINISTRO --- */}
        <div className="preview-panel">
          <div className="preview-content">
            <button className="back-button" onClick={() => onClose(false)}>
              <ArrowLeft size={18} className='back-button-arrow' />
            </button>

            {/* 1. Il contenitore ORA contiene SOLO l'immagine */}
            <div className="avatar-container1">
              <img
                src={formData.immagine}
                className="avatar-image1"
                style={{ objectFit: 'cover' }}
              />
            </div> {}

            {/* I testi sono ora fuori dal cerchio, quindi si vedranno sotto */}
            <h2 className="preview-name">{formData.nome}</h2>
            <p className="preview-bio">{formData.descrizione || "Nessuna descrizione..."}</p>
          </div>
        </div>

        {/* LATO DESTRO (Form) */}
        <div className="edit-form-panel">
          <div className="form-wrapper">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="page-title">Modifica Profilo</h1>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">

              <div className="section-title"><User size={16} /> Anagrafica</div>
              {renderAnagraficaFields()}
              {/* Errors for names are inside renderAnagraficaFields now */}

              <div className="section-title"><Phone size={16} /> Contatti</div>
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
                    className={`input-field ${errors.recapitoTelefonico ? 'input-error' : ''}`}
                    maxLength={10}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}><ErrorMsg field="recapitoTelefonico" /></div>

              <div className="section-title"><MapPin size={16} /> Indirizzo</div>
              <div className="row-3">
                <div className="input-group" style={{ flex: 2 }}>
                  <Home className="input-icon" />
                  <input
                    type="text"
                    name="strada"
                    value={formData.strada}
                    onChange={handleChange}
                    placeholder="Via"
                    className={`input-field ${errors.strada ? 'input-error' : ''}`}
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <MapPinHouse className="input-icon" />
                  <input
                    type="text"
                    name="ncivico"
                    value={formData.ncivico}
                    onChange={handleChange}
                    placeholder="N."
                    className={`input-field ${errors.ncivico ? 'input-error' : ''}`}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}><ErrorMsg field="strada" /></div>
                <div style={{ flex: 1 }}><ErrorMsg field="ncivico" /></div>
              </div>

              <div className="row-3">
                <div className="input-group" style={{ flex: 2 }}>
                  <Map className="input-icon" />
                  <input
                    type="text"
                    name="citta"
                    value={formData.citta}
                    onChange={handleChange}
                    placeholder="Città"
                    className={`input-field ${errors.citta ? 'input-error' : ''}`}
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <Building className="input-icon" />
                  <input
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    placeholder="PR"
                    maxLength={2}
                    className={`input-field ${errors.provincia ? 'input-error' : ''}`}
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <Landmark className="input-icon" />
                  <input
                    type="text"
                    name="cap"
                    value={formData.cap}
                    onChange={handleChange}
                    placeholder="CAP"
                    maxLength={5}
                    className={`input-field ${errors.cap ? 'input-error' : ''}`}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}><ErrorMsg field="citta" /></div>
                <div style={{ flex: 1 }}><ErrorMsg field="provincia" /></div>
                <div style={{ flex: 1 }}><ErrorMsg field="cap" /></div>
              </div>

              <div className="section-title"><Briefcase size={16} /> Dettagli</div>
              {formData.ruolo?.toLowerCase() !== 'beneficiario' && (
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
              )}
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

              {/* CAMPO IMMAGINE*/}
              {/* CAMPO IMMAGINE*/}
              <div className="input-group1">
                <label className="file-upload-label" style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer', gap: '10px', justifyContent: 'center' }}>
                  <Camera size={20} color="#087886" />
                  <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '500' }}>
                    {formData.immagine ? "Sostituisci foto profilo" : "Carica foto profilo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="action-buttons">
                <button type="button" className="btn-cancel" onClick={() => onClose(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Salvataggio...' : <><Save size={18} /> Salva</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}