import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddStory from "../components/AddStory";
import EditStory from "../components/EditStory";
import DeleteStory from "../components/DeleteStory";
import "../stylesheets/StoriesBoard.css";


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

  // Stato per l'email dell'utente loggato
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);

  // 1. RECUPERO DATI UTENTE CORRENTE
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("StoriesBoard: Nessun token trovato.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/account/datiUtente?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const userData = await response.json();

          // Cerchiamo l'email in vari campi possibili
          const emailTrovata = userData.email || userData.username || userData.mail;

          if (emailTrovata) {
            setCurrentUserEmail(emailTrovata);
          } else {
            console.warn("ATTENZIONE: Il backend non ha restituito un campo 'email' per l'utente loggato!");
          }
        }
      } catch (err) {
        console.error("Errore recupero utente:", err);
      }
    };

    fetchUserData();
  }, []);

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

  const handleSubmitStory = async (newStory) => {
    try {
      await addStory(newStory);
      await loadStories();
      setIsAddStoryOpen(false);
    } catch (err) {
      console.error(err);
      alert("Errore durante la creazione del racconto");
    }
  };

  const openEditStory = (story) => {
    setEditingStory(story);
  };

  const closeEditStory = () => {
    setEditingStory(null);
  };

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

  const openDeleteStory = (story) => {
    setStoryToDelete(story);
  };

  const closeDeleteStory = () => {
    setStoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;
    try {
      // Gestisce sia id che idRacconto a seconda del JSON
      const idToDelete = storyToDelete.id || storyToDelete.idRacconto;
      await deleteStory(idToDelete);
      await loadStories();
      setStoryToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'eliminazione del racconto");
    }
  };

  const typeLabel = (type) => {
    if (type === "photo") return "Foto";
    return "Testo";
  };

  const getAuthorName = (story) => {
    if (story.utente && story.utente.nome) {
      return story.utente.nome + (story.utente.cognome ? " " + story.utente.cognome : "");
    }
    return story.authorName || "Anonimo";
  };


  const getStoryOwnerRole = (story) => {
    if (story.utente && story.utente.ruolo) {
      return story.utente.ruolo;
    }
    return story.authorRole || "";
  };


  const latestStories = [...stories].reverse().slice(0, 3);


  return (
    <>


      <div className="stories-page" id="storie">
        <div className="stories-container">
          <header className="stories-hero">
            <div className="stories-hero-left">
              <h1 className="stories-title">Storie</h1>
              <p className="stories-subtitle">
                Leggi le esperienze della community o condividi la tua.
              </p>
            </div>
            <div className="stories-hero-right">
              {/* Tasto nuovo racconto visibile se siamo loggati */}
              {currentUserEmail && (
                <button
                  className="stories-add-button"
                  type="button"
                  onClick={openAddStory}
                >
                  + Nuovo racconto
                </button>
              )}
            </div>
          </header>

          {loading && (
            <p className="stories-loading">Caricamento storie...</p>
          )}
          {error && <p className="stories-error">{error}</p>}

          <div className="stories-layout">
            <section className="stories-main">
              {[...stories].reverse().map((story) => {
                const authorName = getAuthorName(story);
                const storyOwnerRole = getStoryOwnerRole(story);
                const myEmail = currentUserEmail ? currentUserEmail.trim().toLowerCase() : "";
                let storyOwnerEmail = "";
                if (story.utente && story.utente.email) {
                  storyOwnerEmail = story.utente.email;
                } else if (story.authorEmail) {
                  storyOwnerEmail = story.authorEmail;
                } else if (story.email) {
                  storyOwnerEmail = story.email;
                }
                storyOwnerEmail = storyOwnerEmail ? storyOwnerEmail.trim().toLowerCase() : "";
                const isOwner = myEmail && storyOwnerEmail && (myEmail === storyOwnerEmail);
                let authorAvatar = null;
                if (story.utente && story.utente.immagine) {

                  authorAvatar = story.utente.immagine.startsWith("data:image")
                    ? story.utente.immagine
                    : `data:image/jpeg;base64,${story.utente.immagine}`;
                }


                return (
                  <article key={story.id || story.idRacconto} className="story-card">
                    <div className="story-card-header">

                      {/* --- MODIFICA QUI SOTTO --- */}
                      <div className="story-avatar">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt="Avatar"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%"
                            }}
                          />
                        ) : (
                          authorName.charAt(0).toUpperCase()
                        )}
                      </div>
                      {/* ------------------------- */}

                      <div className="story-author-info">
                        <Link
                          to={`/profilo${storyOwnerRole ? storyOwnerRole.toLowerCase() : ''}`}
                          className="sr-profile-link"
                          onClick={() => {
                            if (storyOwnerEmail) {
                              localStorage.setItem('searchEmail', storyOwnerEmail);
                            }
                          }}>
                          <span className="story-author-name">
                            {authorName}
                          </span>
                        </Link>
                        <span className="story-author-role">
                          {getStoryOwnerRole(story) || "Utente"}
                        </span>
                      </div>
                      <span className={`story-type-pill type-${story.type}`}>
                        {typeLabel(story.type)}
                      </span>
                    </div>

                    <h2 className="story-card-title">{story.titolo || story.title}</h2>
                    <p className="story-card-content">{story.descrizione || story.content}</p>

                    {story.imageBase64 && (
                      <div className="story-image-wrapper">
                        <img
                          src={story.imageBase64}
                          alt={story.title || "Immagine racconto"}
                          className="story-image"
                        />
                      </div>
                    )}

                    {isOwner && (
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
                    )}
                  </article>
                );
              })}

              {stories.length === 0 && !loading && !error && (
                <p className="stories-empty">
                  Nessuna storia ancora. Sii il primo a condividere un racconto.
                </p>
              )}
            </section>

            <aside className="stories-sidebar">
              <h3 className="sidebar-title">Ultime storie</h3>

              {latestStories.map((story) => {
                const authorName = getAuthorName(story);
                return (
                  <article key={story.id || story.idRacconto} className="sidebar-story-card">
                    <div className="sidebar-story-header">
                      <div className="sidebar-avatar">
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="sidebar-author-info">
                        <span className="sidebar-author-name">
                          {authorName}
                        </span>
                        <span className="sidebar-author-role">
                          {getStoryOwnerRole(story) || "Utente"}
                        </span>
                      </div>
                    </div>

                    <h4 className="sidebar-story-title">{story.titolo || story.title}</h4>
                    <p className="sidebar-story-snippet">
                      {(story.descrizione || story.content) && (story.descrizione || story.content).length > 110
                        ? (story.descrizione || story.content).slice(0, 110) + "..."
                        : (story.descrizione || story.content)}
                    </p>
                  </article>
                );
              })}

              {latestStories.length === 0 && !loading && !error && (
                <p className="stories-empty">Ancora nessuna storia recente.</p>
              )}
            </aside>
          </div>
        </div>
      </div>

      {isAddStoryOpen && (
        <AddStory
          onSubmit={handleSubmitStory}
          onBack={closeAddStory}
          isModal={true}
        />
      )}

      {editingStory && (
        <EditStory
          story={editingStory}
          onCancel={closeEditStory}
          onSave={handleSaveEditedStory}
        />
      )}

      {storyToDelete && (
        <DeleteStory
          story={storyToDelete}
          onCancel={closeDeleteStory}
          onConfirm={handleDeleteConfirm}
        />
      )}


    </>
  );
};

export default StoriesBoard;