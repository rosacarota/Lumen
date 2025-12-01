import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Clock, Image as ImageIcon, ArrowLeft, Save } from "lucide-react";
import "../stylesheets/ModifyEvento.css"; 
import { modificaEvento, toBase64 } from "../services/EventoService"; 

const ModifyEvento = ({ onSubmit, onBack, initialData, isModal = false }) => {
  
  // --- STATI ---
  const [immagine, setImmagine] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  
  // Stato Indirizzo (Oggetto completo)
  const [indirizzo, setIndirizzo] = useState({
      idIndirizzo: null,
      strada: '',
      ncivico: '',
      citta: '',
      provincia: '',
      cap: ''
  });

  // Stati Date e Ore separati
  const [dataInizio, setDataInizio] = useState("");
  const [oraInizio, setOraInizio] = useState("");
  const [dataFine, setDataFine] = useState("");
  const [oraFine, setOraFine] = useState("");
  
  const [maxPartecipanti, setMaxPartecipanti] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  // --- EFFETTO: POPOLA I CAMPI ---
  useEffect(() => {
    if (initialData) {
      setTitolo(initialData.titolo || "");
      setDescrizione(initialData.descrizione || "");
      setMaxPartecipanti(initialData.maxPartecipanti || "");
      
      // Immagine
      if (initialData.immagine) {
         setPreviewUrl(initialData.immagine);
      }

      // Indirizzo
      if (initialData.indirizzo) {
          setIndirizzo({
              idIndirizzo: initialData.indirizzo.id || initialData.indirizzo.idIndirizzo,
              strada: initialData.indirizzo.strada || "",
              ncivico: initialData.indirizzo.ncivico || "",
              citta: initialData.indirizzo.citta || "",
              provincia: initialData.indirizzo.provincia || "",
              cap: initialData.indirizzo.cap || ""
          });
      }

      // Split Date ISO (YYYY-MM-DDTHH:mm)
      if (initialData.dataInizio) {
        const dt = initialData.dataInizio.split('T');
        if (dt.length >= 2) {
            setDataInizio(dt[0]);
            setOraInizio(dt[1].substring(0, 5));
        } else {
             setDataInizio(initialData.dataInizio);
        }
      }

      if (initialData.dataFine) {
        const dt = initialData.dataFine.split('T');
        if (dt.length >= 2) {
            setDataFine(dt[0]);
            setOraFine(dt[1].substring(0, 5));
        } else {
            setDataFine(initialData.dataFine);
        }
      }
    }
  }, [initialData]);

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImmagine(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setIndirizzo(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
        const fullInizio = `${dataInizio}T${oraInizio}`;
        const fullFine = `${dataFine}T${oraFine}`;

        if (new Date(fullFine) <= new Date(fullInizio)) {
            alert("La data di fine deve essere successiva all'inizio.");
            setIsLoading(false);
            return;
        }

        let immagineDaInviare = initialData.immagine; 
        if (immagine) {
            immagineDaInviare = await toBase64(immagine);
        }

        const eventoModificato = {
            idEvento: initialData.idEvento || initialData.id, 
            titolo: titolo.trim(),
            descrizione: descrizione.trim(),
            dataInizio: fullInizio,
            dataFine: fullFine,
            maxPartecipanti: parseInt(maxPartecipanti),
            immagine: immagineDaInviare, 
            indirizzo: {
                ...indirizzo,
                idIndirizzo: indirizzo.idIndirizzo
            }
        };

        await modificaEvento(eventoModificato);

        if (onSubmit) onSubmit();

    } catch (error) {
        console.error(error);
        alert("Errore modifica: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={`me-page ${isModal ? "me-page-modal" : ""}`}>
      <div className="me-container">
        
        {onBack && (
          <button type="button" className="me-close-back-button" onClick={onBack} title="Annulla">
            <ArrowLeft size={20} />
          </button>
        )}

        {/* --- FORM PANEL --- */}
        <div className="me-left-panel-form">
          <div className="me-form-wrapper">
            
            <div className="me-header-section">
              <div className="me-header-title-row">
                <Calendar className="me-header-icon" />
                <span className="me-header-text">Modifica Evento</span>
              </div>
              <p className="me-header-subtitle">Aggiorna i dettagli qui sotto.</p>
            </div>

            <form onSubmit={handleSubmit} className="me-story-form">
              <div className="me-fields-scrollable">
                
                {/* Upload Immagine */}
                <div className="me-image-upload-box" onClick={() => fileInputRef.current.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*"/>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="me-image-preview" />
                  ) : (
                    <div className="me-image-placeholder">
                      <ImageIcon className="me-upload-icon" />
                      <span>Cambia immagine</span>
                    </div>
                  )}
                  {previewUrl && <div className="me-image-overlay">Cambia</div>}
                </div>

                {/* Titolo */}
                <div className="me-input-group">
                  <label className="me-label">Titolo</label>
                  <input className="me-input-field" type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required maxLength={100} />
                </div>

                {/* Date e Orari */}
                <div className="me-section-label" style={{marginTop:'10px', fontSize:'0.85rem', color:'#555', display:'flex', alignItems:'center', gap:'5px', fontWeight:600}}>
                     <Clock size={14}/> Date e Orari
                </div>

                <div className="me-row-split">
                    <div className="me-input-group" style={{flex: 2}}>
                        <label className="me-label">Data Inizio</label>
                        <input className="me-input-field me-date-input" type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} required />
                    </div>
                    <div className="me-input-group" style={{flex: 1}}>
                        <label className="me-label">Ora</label>
                        <input className="me-input-field" type="time" value={oraInizio} onChange={(e) => setOraInizio(e.target.value)} required />
                    </div>
                </div>

                <div className="me-row-split">
                    <div className="me-input-group" style={{flex: 2}}>
                        <label className="me-label">Data Fine</label>
                        <input className="me-input-field me-date-input" type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} min={dataInizio} required />
                    </div>
                    <div className="me-input-group" style={{flex: 1}}>
                        <label className="me-label">Ora</label>
                        <input className="me-input-field" type="time" value={oraFine} onChange={(e) => setOraFine(e.target.value)} required />
                    </div>
                </div>

                {/* Max Partecipanti */}
                <div className="me-input-group">
                    <label className="me-label">Max Partecipanti</label>
                    <input className="me-input-field" type="number" value={maxPartecipanti} onChange={(e) => setMaxPartecipanti(e.target.value)} min="1" required />
                </div>

                {/* Indirizzo */}
                <div className="me-section-label" style={{marginTop:'10px', fontSize:'0.85rem', color:'#555', display:'flex', alignItems:'center', gap:'5px', fontWeight:600}}>
                      <MapPin size={14}/> Luogo Evento
                </div>
                <div className="me-row-split">
                    <div className="me-input-group" style={{ flex: 3 }}>
                      <input className="me-input-field" type="text" name="strada" value={indirizzo.strada} onChange={handleAddressChange} placeholder="Via" required />
                    </div>
                    <div className="me-input-group" style={{ flex: 1 }}>
                      <input className="me-input-field" type="text" name="ncivico" value={indirizzo.ncivico} onChange={handleAddressChange} placeholder="N." required />
                    </div>
                </div>
                <div className="me-row-split">
                     <div className="me-input-group" style={{ flex: 2 }}>
                        <input className="me-input-field" type="text" name="citta" value={indirizzo.citta} onChange={handleAddressChange} placeholder="Città" required />
                     </div>
                     <div className="me-input-group" style={{ flex: 1 }}>
                        <input className="me-input-field" type="text" name="provincia" value={indirizzo.provincia} onChange={handleAddressChange} placeholder="PR" maxLength={2} required />
                     </div>
                     <div className="me-input-group" style={{ flex: 1 }}>
                        <input className="me-input-field" type="text" name="cap" value={indirizzo.cap} onChange={handleAddressChange} placeholder="CAP" required />
                     </div>
                </div>

                {/* Descrizione */}
                <div className="me-input-group" style={{marginTop: '10px'}}>
                  <label className="me-label">Descrizione</label>
                  <textarea className="me-text-area" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} rows={4} required />
                </div>
              </div>

              <div className="me-footer">
                <button type="submit" className="me-submit-button" disabled={isLoading}>
                  <Save className="me-submit-icon" />
                  <span>{isLoading ? "SALVATAGGIO..." : "SALVA MODIFICHE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- DECOR PANEL --- */}
        <div className="me-right-panel-decor">
          <div className="me-gradient-overlay"></div>
          <div className="me-blur-circle me-circle-1"></div>
          <div className="me-blur-circle me-circle-2"></div>
          <div className="me-welcome-content">
            <h1 className="me-welcome-title">Aggiorna il tuo Evento.</h1>
            <p className="me-welcome-subtitle">Modifica i dettagli per informare i tuoi partecipanti.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyEvento;