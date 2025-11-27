import { useState, useRef } from "react";
import { Image, FileText, SendHorizontal, ArrowLeft } from "lucide-react";
// Assicurati che il percorso del CSS sia corretto
import "../stylesheets/AddStory.css"; 

// FIX: Ho cambiato 'onClose' in 'onBack' per combaciare con StoriesBoard.js
const AddStory = ({ onSubmit, onBack }) => { 
  const [storyType, setStoryType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setStoryType("text");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (storyType === "photo" && !file && !content.trim()) {
      alert(
        "Per una storia con foto devi caricare un file o inserire una descrizione/link."
      );
      return;
    }

    const newStory = {
      type: storyType,
      title: title.trim(),
      content: content.trim(),
      file: file || null,
      createdAt: new Date().toISOString(),
    };

    if (onSubmit) {
      onSubmit(newStory);
    } else {
      console.log("New story:", newStory);
    }

    resetForm();

    // Usa onBack qui
    if (onBack) onBack(); 
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
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
    switch (storyType) {
      case "photo":
        return <Image className="logo-icon" />;
      case "text":
      default:
        return <FileText className="logo-icon" />;
    }
  };

  const getHelperPlaceholder = () => {
    const base =
      "Racconta cosa è successo, chi hai incontrato, come ti sei sentito...";
    switch (storyType) {
      case "photo":
        return `Descrizione foto o link. ${base}`;
      case "text":
      default:
        return base;
    }
  };

  const dotTypes = ["text", "photo"];
  
  return (
    // Usa onBack anche per chiudere cliccando fuori (opzionale)
    <div className="modal-overlay" onClick={onBack}> 
      <div className="container" onClick={(e) => e.stopPropagation()}>
        
        {/* FIX: Controlliamo se onBack esiste */}
        {onBack && ( 
          <button
            type="button"
            className="close-back-button"
            onClick={onBack} // Chiama onBack
            title="Chiudi"
          >
            {/* Tag per visualizzare la struttura se necessario, non in produzione */}
            {/* 

[Image of UI wireframe showing modal close button placement]
 */}
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="left-panel">
          <div className="gradient-overlay"></div>
          <div className="blur-circle circle-1"></div>
          <div className="blur-circle circle-2"></div>
          <div className="welcome-content">
            <h1 className="welcome-title">Condividi un racconto.</h1>
            <p className="welcome-subtitle">
              Ogni esperienza conta. Aggiungi il tuo contributo alla nostra
              bacheca e ispira gli altri.
            </p>
            <div className="welcome-footer">
              Grazie per essere parte attiva della nostra community.
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="form-container">
            <div className="logo-section">
              <div className="logo-wrapper">
                {getHeaderIcon()}
                <span className="logo-text">Nuovo Racconto</span>
              </div>
              <p className="logo-subtitle">
                Seleziona il tipo di contenuto da condividere.
              </p>
            </div>

            <div className="form-content">
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-button ${
                    storyType === "text" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("text")}
                >
                  <FileText className="type-icon" />
                  <span>Testo</span>
                </button>

                <button
                  type="button"
                  className={`type-button ${
                    storyType === "photo" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("photo")}
                >
                  <Image className="type-icon" />
                  <span>Foto</span>
                </button>
              </div>

              {storyType === "photo" && (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              )}

              <form onSubmit={handleSubmit} className="story-form">
                <div className="fields-container">
                  <div className="input-group">
                    <input
                      className="input-field-no-icon"
                      type="text"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Titolo breve e significativo"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <textarea
                      className="text-area"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder={getHelperPlaceholder()}
                      rows={file ? 4 : 6}
                      required={storyType === "text"}
                    />
                  </div>

                  {storyType === "photo" && (
                    <div
                      className="file-upload-area"
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                    >
                      {file ? (
                        <p className="file-info">
                          File selezionato:{" "}
                          <strong>{file.name}</strong> (
                          {Math.round(file.size / 1024)} KB) – clicca per
                          cambiare
                        </p>
                      ) : (
                        <p className="file-placeholder">
                          Clicca qui per caricare una Foto (o incolla un link
                          nel campo sopra).
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="dots-indicator">
                  {dotTypes.map((type) => (
                    <span
                      key={type}
                      className={`dot ${storyType === type ? "active" : ""}`}
                    ></span>
                  ))}
                </div>

                <div className="story-footer">
                  <p className="helper-text">
                    Le storie verranno mostrate nella tua bacheca.
                  </p>
                  <button type="submit" className="submit-button">
                    <SendHorizontal className="submit-icon" />
                    <span>PUBBLICA RACCONTO</span>
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

export default AddStory;