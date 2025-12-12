import { useState, useEffect, useRef } from "react";
import { Image, FileText, ArrowLeft, X } from "lucide-react";
import "../stylesheets/EditStory.css";

import { editStory } from "../services/StoriesService";

const EditStory = ({ story, onCancel, onSave }) => {
  const [storyType, setStoryType] = useState(story.type === "photo" ? "photo" : "text");
  const [title, setTitle] = useState(story.title || "");
  const [content, setContent] = useState(story.content || "");
  const [file, setFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false); // flag per rimuovere immagine
  const fileInputRef = useRef(null);

  // Convertire file in Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // Aggiorna lo stato se cambia la storia
  useEffect(() => {
    setStoryType(story.type === "photo" ? "photo" : "text");
    setTitle(story.title || "");
    setContent(story.content || "");
    setFile(null);
    setImageRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [story]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (storyType === "photo" && !file && !content.trim() && !story.imageBase64 && !imageRemoved) {
      alert("Per una storia con foto devi caricare un file o inserire una descrizione/link.");
      return;
    }

    let imageBase64 = story.imageBase64 || null;

    if (file) {
      try {
        imageBase64 = await toBase64(file);
      } catch (err) {
        console.error("Errore conversione file:", err);
        alert("Errore nella lettura del file immagine.");
        return;
      }
    } else if (imageRemoved) {
      imageBase64 = null; // rimuove immagine
    }

    const updatedStory = {
      ...story,
      type: storyType,
      title: title.trim(),
      content: content.trim(),
      imageBase64,
      createdAt: story.createdAt, // mantieni la data originale
    };

    try {
      await editStory(updatedStory);
      if (onSave) onSave(); // Richiama il refresh
      if (onCancel) onCancel(); // Chiudi modale
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio delle modifiche");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
    setImageRemoved(false);
  };

  const handleTypeChange = (type) => {
    setStoryType(type);
    setFile(null);
    setImageRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageRemoved(true);
  };

  const getHeaderIcon = () => (storyType === "photo" ? <Image className="edit-logo-icon" /> : <FileText className="edit-logo-icon" />);

  const getHelperPlaceholder = () => {
    const base = "Aggiorna il racconto: cosa è successo, chi hai incontrato, come ti sei sentito...";
    return storyType === "photo" ? `Descrizione foto o link. ${base}` : base;
  };
  
  const getStoryOwnerRole = (story) => {
    if (story.utente && story.utente.ruolo) {
      return story.utente.ruolo;
    }
    return story.authorRole || "";
  };

  return (
    <div className="edit-story-overlay">
      <div className="edit-story-modal">
        {/* Pulsante chiudi */}
        <button type="button" className="edit-close-button" onClick={onCancel} title="Chiudi">
          <ArrowLeft size={18} />
        </button>

        {/* Colonna sinistra */}
        <div className="edit-left-panel">
          <h2 className="edit-title">Modifica racconto</h2>
          <p className="edit-subtitle">
            Rivedi titolo, contenuto e eventuale immagine associata alla tua storia. Le modifiche saranno visibili nella tua bacheca.
          </p>
          <div className="edit-meta-box">
            <p className="edit-meta-row">
              <span className="edit-meta-label">Autore:</span>
              <span className="edit-meta-value">{story.authorName}</span>
            </p>
            <p className="edit-meta-row">
              <span className="edit-meta-label">Ruolo:</span>
              <span className="edit-meta-value">{story.authorRole}</span>
              <span className="story-author-role">
              {getStoryOwnerRole(story) || "Utente"}
              </span>
            </p>
          </div>
        </div>

        {/* Colonna destra: form */}
        <div className="edit-right-panel">
          <div className="edit-logo-section">
            <div className="edit-logo-wrapper">
              {getHeaderIcon()}
              <span className="edit-logo-text">Dettagli racconto</span>
            </div>
          </div>

          {/* Selettore tipo */}
          <div className="edit-type-selector">
            <button type="button" className={`edit-type-button ${storyType === "text" ? "active" : ""}`} onClick={() => handleTypeChange("text")}>
              <FileText className="edit-type-icon" />
              <span>Testo</span>
            </button>
            <button type="button" className={`edit-type-button ${storyType === "photo" ? "active" : ""}`} onClick={() => handleTypeChange("photo")}>
              <Image className="edit-type-icon" />
              <span>Foto</span>
            </button>
          </div>

          {/* Input file */}
          {storyType === "photo" && (
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
          )}

          <form onSubmit={handleSubmit} className="edit-story-form">
            <div className="edit-fields-container">
              <div className="edit-input-group">
                <input className="edit-input-field" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo del racconto" required />
              </div>

              <div className="edit-input-group">
                <textarea className="edit-text-area" value={content} onChange={(e) => setContent(e.target.value)} placeholder={getHelperPlaceholder()} rows={6} required={storyType === "text"} />
              </div>

              {storyType === "photo" && (
                <div className="edit-file-upload-area" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                  {file ? (
                    <p className="edit-file-info">
                      Nuovo file selezionato: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB) – clicca per cambiare
                    </p>
                  ) : story.imageBase64 && !imageRemoved ? (
                    <div className="edit-image-preview"
                      onClick={(e) => e.stopPropagation()}  >
                      <img src={story.imageBase64} alt="Immagine corrente" className="edit-preview-img" />
                      <button type="button" className="edit-remove-image-button" onClick={(e) => {
                        e.stopPropagation(); handleRemoveImage();
                      }} title="Rimuovi immagine">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="edit-file-placeholder">
                      Clicca per caricare una nuova immagine
                      <br />
                      (se lasci vuoto, rimane quella precedente).
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="edit-footer">
              <button type="button" className="edit-cancel-button" onClick={onCancel}>
                Annulla
              </button>
              <button type="submit" className="edit-save-button">
                Salva modifiche
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStory;