import { useState, useRef, useEffect } from "react";
import { Calendar, Image as ImageIcon, ArrowLeft, SendHorizontal, MapPin, Clock } from "lucide-react";
import "../stylesheets/AddEvento.css";
import { addEvento, toBase64 } from "../services/EventoService";
import { REGEX } from "../utils/loginValidation";
import Swal from 'sweetalert2';

const AddEvento = ({ onSubmit, onBack, isModal = false, enteId = "ID_ENTE_DEFAULT", initialData }) => {

  const [immagine, setImmagine] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");

  // Indirizzo
  const [indirizzo, setIndirizzo] = useState({
    strada: '', ncivico: '', citta: '', provincia: '', cap: ''
  });

  // Date (Solo date, niente ore)
  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");

  const [maxPartecipanti, setMaxPartecipanti] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModal]);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImmagine(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setIndirizzo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validazione Date
    if (new Date(dataFine) < new Date(dataInizio)) {
      Swal.fire({
        icon: 'warning',
        title: 'Attenzione',
        text: "La data di fine deve essere uguale o successiva alla data di inizio.",
        confirmButtonColor: '#087886'
      });
      return;
    }

    if (parseInt(maxPartecipanti) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Attenzione',
        text: "Il numero di partecipanti deve essere positivo.",
        confirmButtonColor: '#087886'
      });
      return;
    }

    // --- NUOVE VALIDAZIONI REGEX ---
    if (!REGEX.CIVICO.test(indirizzo.ncivico)) {
      Swal.fire({
        icon: 'warning',
        title: 'Dati non validi',
        text: "Il numero civico deve essere numerico.",
        confirmButtonColor: '#087886'
      });
      return;
    }
    if (!REGEX.ONLY_LETTERS.test(indirizzo.citta)) {
      Swal.fire({
        icon: 'warning',
        title: 'Dati non validi',
        text: "La città può contenere solo lettere.",
        confirmButtonColor: '#087886'
      });
      return;
    }
    if (!REGEX.PROVINCIA.test(indirizzo.provincia)) {
      Swal.fire({
        icon: 'warning',
        title: 'Dati non validi',
        text: "La provincia deve essere di 2 lettere maiuscole (es. RM).",
        confirmButtonColor: '#087886'
      });
      return;
    }
    if (!REGEX.CAP.test(indirizzo.cap)) {
      Swal.fire({
        icon: 'warning',
        title: 'Dati non validi',
        text: "Il CAP deve essere di 5 cifre.",
        confirmButtonColor: '#087886'
      });
      return;
    }
    // -------------------------------

    setIsLoading(true);

    try {
      let immagineBase64 = null;
      if (immagine) {
        immagineBase64 = await toBase64(immagine);
      }

      const eventoData = {
        titolo: titolo.trim(),
        descrizione: descrizione.trim(),
        indirizzo,
        dataInizio, // Invia solo YYYY-MM-DD
        dataFine,   // Invia solo YYYY-MM-DD
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
      Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: "Errore durante la pubblicazione: " + error.message,
        confirmButtonColor: '#d33'
      });
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

        <div className="ae-left-panel">
          <div className="ae-gradient-overlay"></div>
          <div className="ae-blur-circle ae-circle-1"></div>
          <div className="ae-blur-circle ae-circle-2"></div>
          <div className="ae-welcome-content">
            <h1 className="ae-welcome-title">Crea un Evento.</h1>
            <p className="ae-welcome-subtitle">Organizza momenti indimenticabili.</p>
          </div>
        </div>

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
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="ae-image-preview" />
                    ) : (
                      <div className="ae-image-placeholder">
                        <ImageIcon className="ae-upload-icon" />
                        <span>Carica immagine copertina</span>
                      </div>
                    )}
                  </div>

                  <div className="ae-input-group">
                    <input className="ae-input-field" type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Nome dell'evento" required maxLength={100} />
                  </div>

                  {/* DATE (Senza Ore) */}
                  <div className="ae-section-label" style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> Periodo Svolgimento
                  </div>

                  <div className="ae-row-split">
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <label className="ae-label-over">Data Inizio</label>
                      <input className="ae-input-field ae-date-input" type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} required />
                    </div>
                    <div className="ae-input-group" style={{ flex: 1 }}>
                      <label className="ae-label-over">Data Fine</label>
                      <input className="ae-input-field ae-date-input" type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} min={dataInizio} required />
                    </div>
                  </div>

                  <div className="ae-input-group">
                    <label className="ae-label-over">Max Partecipanti</label>
                    <input className="ae-input-field" type="number" value={maxPartecipanti} onChange={(e) => setMaxPartecipanti(e.target.value)} placeholder="Es. 50" min="1" required />
                  </div>

                  {/* INDIRIZZO */}
                  <div className="ae-section-label" style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} /> Luogo Evento
                  </div>

                  <div className="ae-row-split">
                    <div className="ae-input-group" style={{ flex: 3 }}>
                      <input className="ae-input-field" type="text" name="strada" value={indirizzo.strada} onChange={handleAddressChange} placeholder="Via / Piazza" required />
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

                  <div className="ae-input-group">
                    <textarea className="ae-text-area" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} placeholder="Descrizione del programma..." rows={3} required />
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