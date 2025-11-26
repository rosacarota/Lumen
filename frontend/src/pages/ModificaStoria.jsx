import { useState, useEffect, useRef } from "react";
import { Image, FileText, X, ArrowLeft } from "lucide-react";
import "../stylesheets/ModificaStoria.css";

const ModificaStoria = ({ story, onCancel, onSave }) => {
  const [storyType, setStoryType] = useState(
    story.type === "photo" ? "photo" : "text"
  );
  const [title, setTitle] = useState(story.title || "");
  const [content, setContent] = useState(story.content || "");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // se cambi storia da modificare
  useEffect(() => {
    setStoryType(story.type === "photo" ? "photo" : "text");
    setTitle(story.title || "");
    setContent(story.content || "");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [story]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (storyType === "photo" && !file && !content.trim()) {
      alert(
        "Per una storia con foto devi caricare un file o inserire una descrizione/link."
      );
      return;
    }

    const updatedStory = {
      ...story,
      type: storyType,
      title: title.trim(),
      content: content.trim(),
      file: file || story.file || null,
    };

    onSave && onSave(updatedStory);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
  };

  const handleTypeChange = (type) => {
    setStoryType(type);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getHeaderIcon = () => {
    if (storyType === "photo") return <Image className="edit-logo-icon" />;
    return <FileText className="edit-logo-icon" />;
  };

  const getHelperPlaceholder = () => {
    const base =
      "Aggiorna il racconto: cosa è successo, chi hai incontrato, come ti sei sentito...";
    if (storyType === "photo") {
      return `Descrizione foto o link. ${base}`;
    }
    return base;
  };

  return (
    <div className="edit-story-overlay">
      <div className="edit-story-modal">
        {/* Pulsante chiudi in alto a sinistra */}
        <button
          type="button"
          className="edit-close-button"
          onClick={onCancel}
          title="Chiudi"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Colonna sinistra: testo informativo */}
        <div className="edit-left-panel">
          <h2 className="edit-title">Modifica racconto</h2>
          <p className="edit-subtitle">
            Rivedi titolo, contenuto e eventuale immagine associata alla tua
            storia. Le modifiche saranno visibili nella tua bacheca.
          </p>
          <div className="edit-meta-box">
            <p className="edit-meta-row">
              <span className="edit-meta-label">Autore:</span>
              <span className="edit-meta-value">{story.authorName}</span>
            </p>
            <p className="edit-meta-row">
              <span className="edit-meta-label">Ruolo:</span>
              <span className="edit-meta-value">{story.authorRole}</span>
            </p>
          </div>
        </div>

        {/* Colonna destra: form di modifica */}
        <div className="edit-right-panel">
          <div className="edit-logo-section">
            <div className="edit-logo-wrapper">
              {getHeaderIcon()}
              <span className="edit-logo-text">Dettagli racconto</span>
            </div>
          </div>

          {/* Selettore tipo */}
          <div className="edit-type-selector">
            <button
              type="button"
              className={`edit-type-button ${
                storyType === "text" ? "active" : ""
              }`}
              onClick={() => handleTypeChange("text")}
            >
              <FileText className="edit-type-icon" />
              <span>Testo</span>
            </button>
            <button
              type="button"
              className={`edit-type-button ${
                storyType === "photo" ? "active" : ""
              }`}
              onClick={() => handleTypeChange("photo")}
            >
              <Image className="edit-type-icon" />
              <span>Foto</span>
            </button>
          </div>

          {/* Input file (solo foto) */}
          {storyType === "photo" && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="edit-story-form">
            <div className="edit-fields-container">
              <div className="edit-input-group">
                <input
                  className="edit-input-field"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titolo del racconto"
                  required
                />
              </div>

              <div className="edit-input-group">
                <textarea
                  className="edit-text-area"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getHelperPlaceholder()}
                  rows={file ? 4 : 6}
                  required={storyType === "text"}
                />
              </div>

              {storyType === "photo" && (
                <div
                  className="edit-file-upload-area"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  {file ? (
                    <p className="edit-file-info">
                      Nuovo file selezionato: <strong>{file.name}</strong> (
                      {Math.round(file.size / 1024)} KB) – clicca per cambiare
                    </p>
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
              <button
                type="button"
                className="edit-cancel-button"
                onClick={onCancel}
              >
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
