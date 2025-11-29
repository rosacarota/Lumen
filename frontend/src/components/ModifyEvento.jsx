import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Users, Image as ImageIcon, ArrowLeft, Save } from "lucide-react";
import "../stylesheets/ModifyEvento.css";

const ModifyEvento = ({ onSubmit, onBack, initialData, isModal = false }) => {
  // --- DEFINIZIONE DEGLI STATI (Qui mancavano prima) ---
  const [immagine, setImmagine] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");
  const [maxPartecipanti, setMaxPartecipanti] = useState("");

  const fileInputRef = useRef(null);

  // --- EFFETTO PER CARICARE I DATI INIZIALI ---
  useEffect(() => {
    if (initialData) {
      setTitolo(initialData.titolo || "");
      setDescrizione(initialData.descrizione || "");
      setIndirizzo(initialData.indirizzo || "");
      setMaxPartecipanti(initialData.maxPartecipanti || "");
      
      // Se c'è già un'immagine salvata (URL), mostrala
      if (initialData.immagineUrl) {
        setPreviewUrl(initialData.immagineUrl);
      }

      // Formattazione date per input HTML (YYYY-MM-DDThh:mm)
      if (initialData.dataInizio) {
        // Taglia i secondi/millisecondi per adattarsi a datetime-local
        const dateStr = new Date(initialData.dataInizio).toISOString().slice(0, 16);
        setDataInizio(dateStr);
      }
      if (initialData.dataFine) {
        const dateStr = new Date(initialData.dataFine).toISOString().slice(0, 16);
        setDataFine(dateStr);
      }
    }
  }, [initialData]);

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImmagine(file);
      setPreviewUrl(URL.createObjectURL(file)); // Crea anteprima locale
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validazione base
    if (new Date(dataFine) < new Date(dataInizio)) {
      alert("La data di fine non può essere precedente alla data di inizio.");
      return;
    }

    const eventoAggiornato = {
      ...initialData, // Mantiene l'ID originale
      titolo: titolo.trim(),
      descrizione: descrizione.trim(),
      indirizzo: indirizzo.trim(),
      dataInizio,
      dataFine,
      maxPartecipanti: parseInt(maxPartecipanti),
      nuovaImmagine: immagine, // Passa il file solo se è stato cambiato
    };

    if (onSubmit) {
      onSubmit(eventoAggiornato);
    } else {
      console.log("Evento Modificato:", eventoAggiornato);
    }
  };

  return (
    <div className={`me-page ${isModal ? "me-page-modal" : ""}`}>
      <div className="me-container">
        
        {/* Freccia indietro */}
        {onBack && (
          <button
            type="button"
            className="me-close-back-button"
            onClick={onBack}
            title="Annulla modifiche"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* --- LATO SINISTRO: FORM --- */}
        <div className="me-left-panel-form">
          <div className="me-form-wrapper">
            
            <div className="me-header-section">
              <div className="me-header-title-row">
                <Calendar className="me-header-icon" />
                <span className="me-header-text">Modifica Evento</span>
              </div>
              <p className="me-header-subtitle">
                Aggiorna i dettagli e salva le modifiche.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="me-story-form">
              <div className="me-fields-scrollable">
                
                {/* Upload Immagine */}
                <div 
                  className="me-image-upload-box"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="me-image-preview" />
                  ) : (
                    <div className="me-image-placeholder">
                      <ImageIcon className="me-upload-icon" />
                      <span>Cambia immagine</span>
                    </div>
                  )}
                  {/* Overlay hover */}
                  {previewUrl && <div className="me-image-overlay">Cambia</div>}
                </div>

                {/* Titolo */}
                <div className="me-input-group">
                  <label className="me-label">Titolo Evento</label>
                  <input
                    className="me-input-field"
                    type="text"
                    value={titolo}
                    onChange={(e) => setTitolo(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>

                {/* Date (Inizio / Fine) */}
                <div className="me-row-split">
                  <div className="me-input-group">
                     <label className="me-label">Inizio</label>
                     <input
                      className="me-input-field me-date-input"
                      type="datetime-local"
                      value={dataInizio}
                      onChange={(e) => setDataInizio(e.target.value)}
                      required
                    />
                  </div>
                  <div className="me-input-group">
                    <label className="me-label">Fine</label>
                    <input
                      className="me-input-field me-date-input"
                      type="datetime-local"
                      value={dataFine}
                      onChange={(e) => setDataFine(e.target.value)}
                      min={dataInizio}
                      required
                    />
                  </div>
                </div>

                {/* Indirizzo e Partecipanti */}
                <div className="me-row-split">
                  <div className="me-input-group" style={{ flex: 2 }}>
                    <label className="me-label">Luogo</label>
                    <input
                      className="me-input-field"
                      type="text"
                      value={indirizzo}
                      onChange={(e) => setIndirizzo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="me-input-group" style={{ flex: 1 }}>
                    <label className="me-label">Max Pax</label>
                    <input
                      className="me-input-field"
                      type="number"
                      value={maxPartecipanti}
                      onChange={(e) => setMaxPartecipanti(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Descrizione */}
                <div className="me-input-group">
                  <label className="me-label">Descrizione</label>
                  <textarea
                    className="me-text-area"
                    value={descrizione}
                    onChange={(e) => setDescrizione(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="me-footer">
                <button type="submit" className="me-submit-button">
                  <Save className="me-submit-icon" />
                  <span>SALVA MODIFICHE</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- LATO DESTRO: DECORATIVO (GRANDE) --- */}
        <div className="me-right-panel-decor">
          <div className="me-gradient-overlay"></div>
          <div className="me-blur-circle me-circle-1"></div>
          <div className="me-blur-circle me-circle-2"></div>

          <div className="me-welcome-content">
            <h1 className="me-welcome-title">Aggiorna il tuo Evento.</h1>
            <p className="me-welcome-subtitle">
              "L'evoluzione è il segreto della crescita."<br/>
              Modifica i dettagli del tuo evento per adattarlo alle nuove esigenze della community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyEvento;