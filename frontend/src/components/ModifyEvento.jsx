import { useState, useRef, useEffect } from "react";
import { Calendar, Image as ImageIcon, ArrowLeft, Save, MapPin } from "lucide-react";
import Swal from "sweetalert2";
import "../stylesheets/AddEvento.css";
import { updateEvento, toBase64 } from "../services/EventoService";

const ModifyEvento = ({ isOpen, onClose, eventToEdit, onUpdate }) => {

  // Stati Form
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");
  const [maxPartecipanti, setMaxPartecipanti] = useState("");

  // Stati Immagine
  const [immagineFile, setImmagineFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImageBase64, setExistingImageBase64] = useState(null);

  // Stato Indirizzo
  const [indirizzo, setIndirizzo] = useState({
    strada: '', ncivico: '', citta: '', provincia: '', cap: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- POPOLA I DATI (CORRETTO) ---
  useEffect(() => {
    if (eventToEdit) {
      setTitolo(eventToEdit.titolo || "");
      setDescrizione(eventToEdit.descrizione || "");

      // FIX DATE: Prendo solo la parte YYYY-MM-DD se c'è l'ora (T)
      const safeDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      };

      setDataInizio(safeDate(eventToEdit.dataInizio));
      setDataFine(safeDate(eventToEdit.dataFine));

      setMaxPartecipanti(eventToEdit.maxPartecipanti || "");

      // Immagine
      if (eventToEdit.immagine) {
        setExistingImageBase64(eventToEdit.immagine);
        setPreviewUrl(eventToEdit.immagine);
      } else {
        setPreviewUrl(null);
        setExistingImageBase64(null);
      }

      // FIX INDIRIZZO: Controllo più varianti per il civico
      if (eventToEdit.indirizzo) {
        const addr = eventToEdit.indirizzo;
        setIndirizzo({
          id: addr.id || addr.idIndirizzo,
          strada: addr.strada || "",
          // Controllo: nCivico (Java), ncivico (db), numeroCivico (alternativa)
          ncivico: addr.nCivico || addr.ncivico || addr.numeroCivico || "",
          citta: addr.citta || "",
          provincia: addr.provincia || "",
          cap: addr.cap || ""
        });
      }
    }
  }, [eventToEdit]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImmagineFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setIndirizzo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let immagineFinale = existingImageBase64;
      if (immagineFile) {
        immagineFinale = await toBase64(immagineFile);
      }

      const payload = {
        idEvento: eventToEdit.id || eventToEdit.idEvento,
        titolo,
        descrizione,
        dataInizio,
        dataFine,
        maxPartecipanti,
        immagineBase64: immagineFinale,
        indirizzo: {
          ...indirizzo,
          // Assicuriamoci di mandare nCivico se il backend lo vuole CamelCase
          nCivico: indirizzo.ncivico
        }
      };

      await updateEvento(payload);

      Swal.fire("Modificato!", "L'evento è stato aggiornato.", "success");
      if (onUpdate) onUpdate();
      onClose();

    } catch (error) {
      Swal.fire("Errore", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ae-modal-overlay" onClick={onClose}>
      <div className="ae-container" onClick={(e) => e.stopPropagation()}>

        <button type="button" className="ae-close-back-button" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>

        <div className="ae-left-panel">
          <div className="ae-gradient-overlay"></div>
          <div className="ae-blur-circle ae-circle-1"></div>
          <div className="ae-welcome-content">
            <h1 className="ae-welcome-title">Modifica Evento.</h1>
            <p className="ae-welcome-subtitle">Aggiorna i dettagli del tuo evento.</p>
          </div>
        </div>

        <div className="ae-right-panel">
          <div className="ae-form-container">
            <div className="ae-logo-section">
              <div className="ae-logo-wrapper">
                <Calendar className="ae-logo-icon" />
                <span className="ae-logo-text">Modifica</span>
              </div>
            </div>

            <div className="ae-form-content">
              <form onSubmit={handleSubmit} className="ae-story-form">
                <div className="ae-fields-container">

                  {/* Immagine */}
                  <div className="ae-image-upload-box" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="ae-image-preview" />
                    ) : (
                      <div className="ae-image-placeholder">
                        <ImageIcon className="ae-upload-icon" />
                        <span>Cambia immagine</span>
                      </div>
                    )}
                  </div>

                  {/* Titolo */}
                  <div className="ae-input-group">
                    <input className="ae-input-field" type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Titolo" required />
                  </div>

                  {/* Date e MaxPart */}
                  <div className="ae-row-split">
                    <div className="ae-input-group">
                      <label className="ae-label-over">Inizio</label>
                      <input className="ae-input-field ae-date-input" type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} required />
                    </div>
                    <div className="ae-input-group">
                      <label className="ae-label-over">Fine</label>
                      <input className="ae-input-field ae-date-input" type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} required />
                    </div>
                    <div className="ae-input-group">
                      <label className="ae-label-over">Max Part.</label>
                      <input className="ae-input-field" type="number" value={maxPartecipanti} onChange={(e) => setMaxPartecipanti(e.target.value)} required />
                    </div>
                  </div>

                  {/* Indirizzo */}
                  <div className="ae-section-label" style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}><MapPin size={14} /> Luogo</div>
                  <div className="ae-row-split">
                    <div className="ae-input-group" style={{ flex: 3 }}>
                      <input className="ae-input-field" type="text" name="strada" value={indirizzo.strada} onChange={handleAddressChange} placeholder="Via" required />
                    </div>
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <input className="ae-input-field" type="text" name="ncivico" value={indirizzo.ncivico} onChange={handleAddressChange} placeholder="N." required />
                    </div>
                  </div>
                  <div className="ae-row-split">
                    <div className="ae-input-group" style={{ flex: 2 }}>
                      <input className="ae-input-field" type="text" name="citta" value={indirizzo.citta} onChange={handleAddressChange} placeholder="Città" required />
                    </div>
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <input className="ae-input-field" type="text" name="provincia" value={indirizzo.provincia} onChange={handleAddressChange} placeholder="PR" maxLength={2} required />
                    </div>
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <input className="ae-input-field" type="text" name="cap" value={indirizzo.cap} onChange={handleAddressChange} placeholder="CAP" required />
                    </div>
                  </div>

                  {/* Descrizione */}
                  <div className="ae-input-group">
                    <textarea className="ae-text-area" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} rows={3} required />
                  </div>
                </div>

                <div className="ae-footer" style={{ justifyContent: 'flex-end' }}>
                  <button type="submit" className="ae-submit-button" disabled={isLoading}>
                    <Save size={18} style={{ marginRight: '5px' }} />
                    <span>{isLoading ? "Salvataggio..." : "Salva Modifiche"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyEvento;