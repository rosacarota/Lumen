import { useState, useEffect } from "react";
import AddStory from "../components/AddStory";
import EditStory from "../components/EditStory";
import DeleteStory from "../components/DeleteStory";
import "../stylesheets/StoriesBoard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  fetchStories,
  addStory,
  editStory,
  deleteStory,
} from "../services/StoriesService";

const StoriesBoard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // popup "nuovo racconto"
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

  // popup "modifica racconto"
  const [editingStory, setEditingStory] = useState(null);

  // popup "elimina racconto"
  const [storyToDelete, setStoryToDelete] = useState(null);

  // funzione riutilizzabile che carica le storie dal backend
  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await fetchStories();
      setStories(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare le storie");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    loadStories();
  }, []);

  const openAddStory = () => setIsAddStoryOpen(true);
  const closeAddStory = () => setIsAddStoryOpen(false);

  // crea nuovo racconto -> POST /aggiungi + ricarica lista
  const handleSubmitStory = async (newStory) => {
    try {
      await addStory(newStory);
      await loadStories(); // ricarica dal backend
      setIsAddStoryOpen(false);
    } catch (err) {
      console.error(err);
      alert("Errore durante la creazione del racconto");
    }
  };

  // apri popup modifica
  const openEditStory = (story) => {
    setEditingStory(story);
  };

  // chiudi popup modifica
  const closeEditStory = () => {
    setEditingStory(null);
  };

  // salva modifiche -> POST /modifica + ricarica lista
  const handleSaveEditedStory = async (updatedStory) => {
    try {
      await editStory(updatedStory);
      await loadStories();
      setEditingStory(null);
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio delle modifiche");
    }
  };

  // apri popup elimina
  const openDeleteStory = (story) => {
    setStoryToDelete(story);
  };

  // chiudi popup elimina
  const closeDeleteStory = () => {
    setStoryToDelete(null);
  };

  // conferma eliminazione -> DELETE /rimuovi
  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;
    try {
      await deleteStory(storyToDelete.id);
      await loadStories();
      setStoryToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'eliminazione del racconto");
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  const typeLabel = (type) => {
    if (type === "photo") return "Foto";
    return "Testo";
  };

  const latestStories = stories.slice(0, 3);

  return (
    <>
      <Navbar />

      <div className="stories-page" id="storie">
        <div className="stories-container">
          {/* Header pagina */}
          <header className="stories-hero">
            <div className="stories-hero-left">
              <h1 className="stories-title">Storie</h1>
              <p className="stories-subtitle">
                Leggi le esperienze della community o condividi la tua.
              </p>
            </div>
            <div className="stories-hero-right">
              <button
                className="stories-add-button"
                type="button"
                onClick={openAddStory}
              >
                + Nuovo racconto
              </button>
            </div>
          </header>

          {/* Messaggi di stato */}
          {loading && (
            <p className="stories-loading">Caricamento storie...</p>
          )}
          {error && <p className="stories-error">{error}</p>}

          {/* Layout a due colonne */}
          <div className="stories-layout">
            {/* Colonna sinistra: feed principale */}
            <section className="stories-main">
              {stories.map((story) => (
                <article key={story.id} className="story-card">
                  <div className="story-card-header">
                    <div className="story-avatar">
                      {story.authorName
                        ? story.authorName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="story-author-info">
                      <span className="story-author-name">
                        {story.authorName || "Anonimo"}
                      </span>
                      <span className="story-author-role">
                        {story.authorRole}
                      </span>
                    </div>
                    <span className={`story-type-pill type-${story.type}`}>
                      {typeLabel(story.type)}
                    </span>
                  </div>

                  <h2 className="story-card-title">{story.title}</h2>
                  <p className="story-card-content">{story.content}</p>

                  {/* Immagine, se presente */}
                  {story.imageBase64 && (
                    <div className="story-image-wrapper">
                      <img
                        src={story.imageBase64}
                        alt={story.title || "Immagine racconto"}
                        className="story-image"
                      />
                    </div>
                  )}

                  <div className="story-card-footer">
                    <button
                      type="button"
                      className="story-edit-button"
                      onClick={() => openEditStory(story)}
                    >
                      Modifica
                    </button>

                    <button
                      type="button"
                      className="story-edit-button"
                      onClick={() => openDeleteStory(story)}
                      style={{
                        marginLeft: "8px",
                        borderColor: "#dc2626",
                        color: "#dc2626",
                      }}
                    >
                      Elimina
                    </button>
                  </div>
                </article>
              ))}

              {stories.length === 0 && !loading && !error && (
                <p className="stories-empty">
                  Nessuna storia ancora. Sii il primo a condividere un racconto.
                </p>
              )}
            </section>

            {/* Colonna destra: ultime storie */}
            <aside className="stories-sidebar">
              <h3 className="sidebar-title">Ultime storie</h3>

              {latestStories.map((story) => (
                <article key={story.id} className="sidebar-story-card">
                  <div className="sidebar-story-header">
                    <div className="sidebar-avatar">
                      {story.authorName
                        ? story.authorName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="sidebar-author-info">
                      <span className="sidebar-author-name">
                        {story.authorName || "Anonimo"}
                      </span>
                      <span className="sidebar-author-role">
                        {story.authorRole}
                      </span>
                    </div>
                  </div>

                  <h4 className="sidebar-story-title">{story.title}</h4>
                  <p className="sidebar-story-snippet">
                    {story.content && story.content.length > 110
                      ? story.content.slice(0, 110) + "..."
                      : story.content}
                  </p>
                  <button className="sidebar-story-button" type="button">
                    LEGGI QUI
                  </button>
                </article>
              ))}

              {latestStories.length === 0 && !loading && !error && (
                <p className="stories-empty">Ancora nessuna storia recente.</p>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* POPUP NUOVO RACCONTO */}
      {isAddStoryOpen && (
        <AddStory
          onSubmit={handleSubmitStory}
          onBack={closeAddStory}
          isModal={true}
        />
      )}

      {/* POPUP MODIFICA RACCONTO */}
      {editingStory && (
        <EditStory
          story={editingStory}
          onCancel={closeEditStory}
          onSave={handleSaveEditedStory}
        />
      )}

      {/* POPUP ELIMINA RACCONT0 */}
      {storyToDelete && (
        <DeleteStory
          story={storyToDelete}
          onCancel={closeDeleteStory}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <Footer />
    </>
  );
};

export default StoriesBoard;
