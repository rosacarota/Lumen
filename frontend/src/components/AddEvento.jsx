import { useState, useRef } from "react";
import { Calendar, Image as ImageIcon, ArrowLeft, SendHorizontal, MapPin } from "lucide-react";
import "../stylesheets/AddEvento.css";
import { addEvento, toBase64 } from "../services/EventoService"; 

const AddEvento = ({ onSubmit, onBack, isModal = false, enteId = "ID_ENTE_DEFAULT" }) => {
  
  // Stati per i campi del form
  const [immagine, setImmagine] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  
  // MODIFICA: L'indirizzo ora è un oggetto strutturato
  const [indirizzo, setIndirizzo] = useState({
      strada: '',
      ncivico: '',
      citta: '',
      provincia: '',
      cap: ''
  });

  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");
  const [maxPartecipanti, setMaxPartecipanti] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Gestione caricamento immagine
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImmagine(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // MODIFICA: Gestione campi indirizzo
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setIndirizzo(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (new Date(dataFine) < new Date(dataInizio)) {
      alert("La data di fine non può essere precedente alla data di inizio.");
      return;
    }

    if (parseInt(maxPartecipanti) <= 0) {
      alert("Il numero di partecipanti deve essere positivo.");
      return;
    }

    setIsLoading(true);

    try {
        let immagineBase64 = null;
        if (immagine) {
            immagineBase64 = await toBase64(immagine);
        }

        const eventoData = {
            titolo: titolo.trim(),
            descrizione: descrizione.trim(),
            indirizzo, // Passiamo l'oggetto completo { strada, citta... }
            dataInizio,
            dataFine,
            maxPartecipanti: parseInt(maxPartecipanti),
            immagineBase64, 
            ente: enteId,
        };

        await addEvento(eventoData);

        if (onSubmit) {
            onSubmit(); 
        } else if (onBack) {
            onBack();
        }

    } catch (error) {
        console.error(error);
        alert("Errore durante la pubblicazione: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={isModal ? "ae-modal-overlay" : "ae-page"} onClick={isModal ? onBack : undefined}>
      
      <div className="ae-container" onClick={(e) => e.stopPropagation()}>
        
        {onBack && (
          <button type="button" className="ae-close-back-button" onClick={onBack} title="Torna indietro">
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Pannello sinistro */}
        <div className="ae-left-panel">
          <div className="ae-gradient-overlay"></div>
          <div className="ae-blur-circle ae-circle-1"></div>
          <div className="ae-blur-circle ae-circle-2"></div>

          <div className="ae-welcome-content">
            <h1 className="ae-welcome-title">Crea un Evento.</h1>
            <p className="ae-welcome-subtitle">
              Organizza momenti indimenticabili per la community.
            </p>
          </div>
        </div>

        {/* Pannello destro (Form) */}
        <div className="ae-right-panel">
          <div className="ae-form-container">
            
            <div className="ae-logo-section">
              <div className="ae-logo-wrapper">
                <Calendar className="ae-logo-icon" />
                <span className="ae-logo-text">Nuovo Evento</span>
              </div>
            </div>

            <div className="ae-form-content">
              <form onSubmit={handleSubmit} className="ae-story-form">
                <div className="ae-fields-container">
                  
                  {/* Upload Immagine */}
                  <div className="ae-image-upload-box" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*"/>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="ae-image-preview" />
                    ) : (
                      <div className="ae-image-placeholder">
                        <ImageIcon className="ae-upload-icon" />
                        <span>Carica immagine copertina</span>
                      </div>
                    )}
                  </div>

                  {/* Titolo */}
                  <div className="ae-input-group">
                    <input
                      className="ae-input-field" type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)}
                      placeholder="Nome dell'evento" required maxLength={100}
                    />
                  </div>

                  {/* Date e Partecipanti (3 colonne) */}
                  <div className="ae-row-split">
                    <div className="ae-input-group">
                        <label className="ae-label-over">Inizio</label>
                        <input className="ae-input-field ae-date-input" type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} required />
                    </div>
                    <div className="ae-input-group">
                      <label className="ae-label-over">Fine</label>
                      <input className="ae-input-field ae-date-input" type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} min={dataInizio} required />
                    </div>
                    <div className="ae-input-group">
                        <label className="ae-label-over">Max Part.</label>
                        <input className="ae-input-field" type="number" value={maxPartecipanti} onChange={(e) => setMaxPartecipanti(e.target.value)} placeholder="0" min="1" required />
                    </div>
                  </div>

                  {/* --- SEZIONE INDIRIZZO DETTAGLIATO --- */}
                  <div className="ae-section-label" style={{marginTop:'10px', fontSize:'0.9rem', color:'#666', display:'flex', alignItems:'center', gap:'5px'}}>
                      <MapPin size={14}/> Luogo Evento
                  </div>
                  
                  {/* Riga 1 Indirizzo: Via e Civico */}
                  <div className="ae-row-split">
                    <div className="ae-input-group" style={{ flex: 3 }}>
                      <input className="ae-input-field" type="text" name="strada" value={indirizzo.strada} onChange={handleAddressChange} placeholder="Via / Piazza" required />
                    </div>
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <input className="ae-input-field" type="text" name="ncivico" value={indirizzo.ncivico} onChange={handleAddressChange} placeholder="N." required />
                    </div>
                  </div>

                  {/* Riga 2 Indirizzo: Città, Prov, CAP */}
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
                  {/* --- FINE SEZIONE INDIRIZZO --- */}

                  {/* Descrizione */}
                  <div className="ae-input-group">
                    <textarea
                      className="ae-text-area" value={descrizione} onChange={(e) => setDescrizione(e.target.value)}
                      placeholder="Descrizione del programma..." rows={3} required
                    />
                  </div>
                </div>

                <div className="ae-footer">
                  <button type="submit" className="ae-submit-button" disabled={isLoading}>
                    <SendHorizontal className="ae-submit-icon" />
                    <span>{isLoading ? "PUBBLICAZIONE..." : "PUBBLICA EVENTO"}</span>
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

export default AddEvento;