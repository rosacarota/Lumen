import { useState } from "react";
import AddStory from "./AddStory";
import EditStory from "./EditStory";
import Navbar from "../components/Navbar";
import "../stylesheets/StoriesBoard.css";

const StoriesBoard = () => {
  const [stories, setStories] = useState([
    {
      id: 1,
      authorName: "IlBuonLetto",
      authorRole: "volontario",
      type: "text",
      title: "Prima esperienza di volontariato",
      content:
        "Oggi ho partecipato alla mia prima attività di distribuzione pasti. È stato intenso ma molto gratificante.",
      createdAt: "2025-11-24T10:00:00.000Z",
    },
    {
      id: 2,
      authorName: "Paky89",
      authorRole: "beneficiario",
      type: "photo",
      title: "Grazie per il supporto",
      content:
        "Ho ricevuto il pacco alimentare proprio quando ne avevo più bisogno. Grazie di cuore a tutti.",
      createdAt: "2025-11-23T17:30:00.000Z",
    },
    {
      id: 3,
      authorName: "UniClock",
      authorRole: "ente",
      type: "text",
      title: "Giornata di raccolta vestiti",
      content:
        "Abbiamo organizzato una raccolta di indumenti invernali per le famiglie del quartiere.",
      createdAt: "2025-11-22T15:00:00.000Z",
    },
  ]);

  // popup "nuovo racconto"
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

  // popup "modifica racconto"
  const [editingStory, setEditingStory] = useState(null);

  const openAddStory = () => setIsAddStoryOpen(true);
  const closeAddStory = () => setIsAddStoryOpen(false);

  const handleSubmitStory = (newStory) => {
    setStories((prev) => [
      {
        id: Date.now(),
        authorName: "Tu",
        authorRole: "volontario",
        ...newStory,
      },
      ...prev,
    ]);
    setIsAddStoryOpen(false);
  };

  // apri popup modifica
  const openEditStory = (story) => {
    setEditingStory(story);
  };

  // chiudi popup modifica
  const closeEditStory = () => {
    setEditingStory(null);
  };

  // salva modifiche
  const handleSaveEditedStory = (updatedStory) => {
    setStories((prev) =>
      prev.map((s) => (s.id === updatedStory.id ? { ...s, ...updatedStory } : s))
    );
    setEditingStory(null);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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
          <header className="stories-header">
            <div>
              <h1 className="stories-title">Storie</h1>
              <p className="stories-subtitle">
                Leggi le esperienze della community o condividi la tua.
              </p>
            </div>
            <button
              className="stories-add-button"
              type="button"
              onClick={openAddStory}
            >
              + Nuovo racconto
            </button>
          </header>

          {/* Layout a due colonne */}
          <div className="stories-layout">
            {/* Colonna sinistra: feed principale */}
            <section className="stories-main">
              {stories.map((story) => (
                <article key={story.id} className="story-card">
                  <div className="story-card-header">
                    <div className="story-avatar">
                      {story.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="story-author-info">
                      <span className="story-author-name">
                        {story.authorName}
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

                  <div className="story-card-footer">
                    <span className="story-date">
                      {formatDate(story.createdAt)}
                    </span>

                    <button
                      type="button"
                      className="story-edit-button"
                      onClick={() => openEditStory(story)}
                    >
                      Modifica
                    </button>
                  </div>
                </article>
              ))}

              {stories.length === 0 && (
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
                      {story.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="sidebar-author-info">
                      <span className="sidebar-author-name">
                        {story.authorName}
                      </span>
                      <span className="sidebar-author-role">
                        {story.authorRole}
                      </span>
                    </div>
                  </div>

                  <h4 className="sidebar-story-title">{story.title}</h4>
                  <p className="sidebar-story-snippet">
                    {story.content.length > 110
                      ? story.content.slice(0, 110) + "..."
                      : story.content}
                  </p>
                  <button className="sidebar-story-button" type="button">
                    LEGGI QUI
                  </button>
                </article>
              ))}

              {latestStories.length === 0 && (
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
    </>
  );
};

export default StoriesBoard;
