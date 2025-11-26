import { X, Trash2 } from "lucide-react";
import "../stylesheets/EliminaStoria.css";

const EliminaStoria = ({ story, onCancel, onConfirm }) => {
  if (!story) return null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="delete-story-overlay">
      <div className="delete-story-modal">
        {/* X chiusura */}
        <button
          type="button"
          className="delete-close-button"
          onClick={onCancel}
          title="Chiudi"
        >
          <X size={18} />
        </button>

        {/* Colonna sinistra: info racconto */}
        <div className="delete-left-panel">
          <h2 className="delete-title">Cancella racconto</h2>
          <p className="delete-subtitle">
            Stai per rimuovere questo racconto dalla bacheca delle storie.
            L&apos;operazione non può essere annullata.
          </p>

          <div className="delete-meta-box">
            <p className="delete-meta-row">
              <span className="delete-meta-label">Titolo</span>
              <span className="delete-meta-value">
                {story.title || "Senza titolo"}
              </span>
            </p>
            <p className="delete-meta-row">
              <span className="delete-meta-label">Autore</span>
              <span className="delete-meta-value">
                {story.authorName || "Anonimo"}
              </span>
            </p>
            <p className="delete-meta-row">
              <span className="delete-meta-label">Data</span>
              <span className="delete-meta-value">
                {story.createdAt ? formatDate(story.createdAt) : "N/D"}
              </span>
            </p>
          </div>
        </div>

        {/* Colonna destra: conferma */}
        <div className="delete-right-panel">
          <div className="delete-logo-section">
            <div className="delete-logo-wrapper">
              <Trash2 className="delete-logo-icon" />
              <span className="delete-logo-text">Conferma eliminazione</span>
            </div>
            <p className="delete-logo-subtitle">
              Sei sicuro di voler cancellare definitivamente questo racconto?
            </p>
          </div>

          <div className="delete-warning-box">
            <p className="delete-warning-title">Attenzione</p>
            <p className="delete-warning-text">
              Il racconto non sarà più visibile nella bacheca e non potrà essere
              recuperato.
            </p>
          </div>

          <div className="delete-footer">
            <button
              type="button"
              className="delete-cancel-button"
              onClick={onCancel}
            >
              Annulla
            </button>

            <button
              type="button"
              className="delete-confirm-button"
              onClick={onConfirm}
            >
              <Trash2 className="delete-confirm-icon" />
              <span>Conferma eliminazione</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminaStoria;
