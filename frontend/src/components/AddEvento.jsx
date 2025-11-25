import { useState, useRef } from "react";
import { Calendar, MapPin, Users, Image as ImageIcon, ArrowLeft, SendHorizontal } from "lucide-react";
import "../stylesheets/AddEvento.css";

const AddEvento = ({ onSubmit, onBack, isModal = false, enteId = "ID_ENTE_DEFAULT" }) => {
  // Stati per i campi del form
  const [immagine, setImmagine] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");
  const [maxPartecipanti, setMaxPartecipanti] = useState("");

  const fileInputRef = useRef(null);

  // Gestione caricamento immagine
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImmagine(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitolo("");
    setDescrizione("");
    setIndirizzo("");
    setDataInizio("");
    setDataFine("");
    setMaxPartecipanti("");
    setImmagine(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validazione base
    if (new Date(dataFine) < new Date(dataInizio)) {
      alert("La data di fine non può essere precedente alla data di inizio.");
      return;
    }

    if (parseInt(maxPartecipanti) <= 0) {
      alert("Il numero di partecipanti deve essere positivo.");
      return;
    }

    const nuovoEvento = {
      titolo: titolo.trim(),
      descrizione: descrizione.trim(),
      indirizzo: indirizzo.trim(),
      dataInizio,
      dataFine,
      maxPartecipanti: parseInt(maxPartecipanti),
      immagine: immagine, // Oggetto File
      ente: enteId,
    };

    if (onSubmit) {
      onSubmit(nuovoEvento);
    } else {
      console.log("Nuovo Evento:", nuovoEvento);
    }

    resetForm();
  };

  return (
    <div className={`ae-page ${isModal ? "ae-page-modal" : ""}`}>
      <div className="ae-container">
        {/* Freccia indietro */}
        {onBack && (
          <button
            type="button"
            className="ae-close-back-button"
            onClick={onBack}
            title="Torna indietro"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Pannello sinistro (Stile invariato) */}
        <div className="ae-left-panel">
          <div className="ae-gradient-overlay"></div>
          <div className="ae-blur-circle ae-circle-1"></div>
          <div className="ae-blur-circle ae-circle-2"></div>

          <div className="ae-welcome-content">
            <h1 className="ae-welcome-title">Crea un Evento.</h1>
            <p className="ae-welcome-subtitle">
              Organizza momenti indimenticabili per la community. 
              Dagli incontri locali ai grandi raduni, tutto inizia qui.
            </p>
            <div className="ae-welcome-footer">
              Connetti le persone, crea impatto.
            </div>
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
              <p className="ae-logo-subtitle">
                Inserisci i dettagli per pianificare l'evento.
              </p>
            </div>

            <div className="ae-form-content">
              <form onSubmit={handleSubmit} className="ae-story-form">
                <div className="ae-fields-container">
                  
                  {/* Upload Immagine (Nuovo Campo) */}
                  <div 
                    className="ae-image-upload-box"
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
                      className="ae-input-field"
                      type="text"
                      value={titolo}
                      onChange={(e) => setTitolo(e.target.value)}
                      placeholder="Nome dell'evento"
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* Riga Doppia: Date */}
                  <div className="ae-row-split">
                    <div className="ae-input-group">
                       <label className="ae-label-over">Inizio</label>
                       <input
                        className="ae-input-field ae-date-input"
                        type="datetime-local"
                        value={dataInizio}
                        onChange={(e) => setDataInizio(e.target.value)}
                        required
                      />
                    </div>
                    <div className="ae-input-group">
                      <label className="ae-label-over">Fine</label>
                      <input
                        className="ae-input-field ae-date-input"
                        type="datetime-local"
                        value={dataFine}
                        onChange={(e) => setDataFine(e.target.value)}
                        min={dataInizio}
                        required
                      />
                    </div>
                  </div>

                  {/* Riga Doppia: Indirizzo e Partecipanti */}
                  <div className="ae-row-split">
                    <div className="ae-input-group" style={{ flex: 2 }}>
                      <input
                        className="ae-input-field"
                        type="text"
                        value={indirizzo}
                        onChange={(e) => setIndirizzo(e.target.value)}
                        placeholder="Indirizzo / Luogo"
                        required
                      />
                    </div>
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <input
                        className="ae-input-field"
                        type="number"
                        value={maxPartecipanti}
                        onChange={(e) => setMaxPartecipanti(e.target.value)}
                        placeholder="Max Part."
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Descrizione */}
                  <div className="ae-input-group">
                    <textarea
                      className="ae-text-area"
                      value={descrizione}
                      onChange={(e) => setDescrizione(e.target.value)}
                      placeholder="Descrivi il programma dell'evento, gli ospiti e le informazioni utili..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="ae-footer">
                  <button type="submit" className="ae-submit-button">
                    <SendHorizontal className="ae-submit-icon" />
                    <span>PUBBLICA EVENTO</span>
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