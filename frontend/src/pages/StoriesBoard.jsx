import React, { useState, useEffect, useCallback } from "react"; 
import EditStory from "./EditStory";
import DeleteStory from "./DeleteStory";  
import "../stylesheets/StoriesBoard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StoriesBoard = () => {
    
    /* * CONFIGURAZIONE API * */
    const API_BASE_URL = "http://localhost:8080/racconto";
    const USER_TOKEN = "iltokengeneratoallogin";

    /* * STATO (DATI E UI) * */
    const [stories, setStories] = useState([]); //  Inizializzato vuoto: i dati vengono caricati dall'API
    const [isLoading, setIsLoading] = useState(true); // Stato di caricamento
    const [error, setError] = useState(null);         // Stato di errore (per il "Failed to fetch")

    // Stati per i pop-up (invariati)
    const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [storyToDelete, setStoryToDelete] = useState(null);

    // Gestione pop-up (invariata)
    const openAddStory = () => setIsAddStoryOpen(true);
    const closeAddStory = () => setIsAddStoryOpen(false);
    const openEditStory = (story) => setEditingStory(story);
    const closeEditStory = () => setEditingStory(null);
    const openDeleteStory = (story) => setStoryToDelete(story);
    const closeDeleteStory = () => setStoryToDelete(null);


    /* * FUNZIONI API (CRUD) * */

    /**
     * API GET: Carica le storie iniziali
     */
    const fetchStories = useCallback(async () => {
        let isMounted = true; 
        setIsLoading(true);
        setError(null);
        try {
            const url = `${API_BASE_URL}/visualizza?token=${USER_TOKEN}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                // Tenta di leggere l'errore se la risposta non è 200 OK
                const errorData = await response.json(); 
                throw new Error(errorData.message || 'Errore nel recupero delle storie dal server.');
            }
            
            const data = await response.json();
            
            // Mappatura dei campi dall'API (es. idRacconto -> id) al formato locale
            const mappedStories = data.map(item => ({
                id: item.idRacconto,
                authorName: item.authorName || "API User", 
                authorRole: item.authorRole || "volontario",
                type: item.immagine ? "photo" : "text",
                title: item.titolo,
                content: item.descrizione,
                createdAt: item.dataPubblicazione,
                image: item.immagine,
            }));
            
            if (isMounted) {
                setStories(mappedStories); 
            }
            
        } catch (err) {
            if (isMounted) {
                console.error("Errore durante il caricamento:", err);
                // Questo cattura il "Failed to fetch"
                setError(err.message || 'Failed to fetch'); 
                setStories([]);
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
        
        return () => { isMounted = false; };
    }, [API_BASE_URL, USER_TOKEN]); 

    /**
     * API POST: Aggiunge una nuova storia (chiama /aggiungi)
     */
    const handleSubmitStory = async (newStory) => {
        try {
            const url = `${API_BASE_URL}/aggiungi?token=${USER_TOKEN}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // IL TUO JSON BODY:
                    titolo: newStory.title,
                    descrizione: newStory.content,
                    immagine: newStory.image || null, // gestisce 'null'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore nell\'aggiunta del racconto.');
            }

            await fetchStories(); // Ricarica i dati aggiornati
            setIsAddStoryOpen(false);

        } catch (error) {
            console.error("Errore durante l'aggiunta:", error);
            alert(`Impossibile aggiungere la storia: ${error.message}`);
        }
    };

    /**
     * API PUT: Salva le modifiche (chiama /modifica)
     */
    const handleSaveEditedStory = async (updatedStory) => {
        const originalStory = stories.find(s => s.id === updatedStory.id);
        if (!originalStory) return; 

        try {
            const url = `${API_BASE_URL}/modifica?token=${USER_TOKEN}`;
            const response = await fetch(url, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idRacconto: updatedStory.id,
                    titolo: updatedStory.title,
                    descrizione: updatedStory.content,
                    dataPubblicazione: originalStory.createdAt.split('T')[0], // Mantiene la data originale
                    immagine: updatedStory.image || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore nella modifica del racconto.');
            }
            
            // Aggiorna lo stato locale dopo il successo dell'API
            setStories((prev) =>
                prev.map((s) => (s.id === updatedStory.id ? { ...s, ...updatedStory } : s))
            );
            setEditingStory(null);
            
        } catch (error) {
            console.error("Errore durante la modifica:", error);
            alert(`Impossibile modificare la storia: ${error.message}`);
        }
    };

    /**
     * API DELETE: Elimina una storia (chiama /rimuovi)
     */
    const handleDeleteStory = async (storyId) => { 
        try {
            const url = `${API_BASE_URL}/rimuovi?token=${USER_TOKEN}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idRacconto: storyId // ID della storia da rimuovere
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore nell\'eliminazione del racconto.');
            }

            // Rimuove la storia dallo stato locale
            setStories(prev => prev.filter(s => s.id !== storyId));
            closeDeleteStory();
            
        } catch (error) {
            console.error("Errore durante l'eliminazione:", error);
            alert(`Impossibile eliminare la storia: ${error.message}`);
        }
    };

    //  SOSTITUISCE handleDeleteConfirm che gestiva solo lo stato locale.
    const handleDeleteConfirm = () => {
        if (!storyToDelete) return;
        handleDeleteStory(storyToDelete.id); // Chiama la funzione API DELETE
    };


    /* * EFFETTO INIZIALE: Caricamento Dati * */
    useEffect(() => {
        const cleanup = fetchStories();
        return cleanup; // Evita memory leak
    }, [fetchStories]); 


    /* * UTILITY E DATI DERIVATI (invariati) * */
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
    
    /* * RENDER CONDIZIONALE: Caricamento/Errore * */
    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="stories-page" id="storie">
                    <p className="loading-message">Caricamento delle storie in corso...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="stories-page" id="storie">
                    {/* Mostra l'errore API che stavi vedendo */}
                    <p className="error-message">Ops! Si è verificato un errore: {error}</p>
                    <button onClick={fetchStories} className="retry-button">Riprova a Caricare</button>
                </div>
                <Footer />
            </>
        );
    }

    /* * RENDER PRINCIPALE (JSX) * */
    return (
        <>
            <Navbar />

            <div className="stories-page" id="storie">
                <div className="stories-container">
                    {/* Header pagina (invariato) */}
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

                    {/* Layout a due colonne (invariato) */}
                    <div className="stories-layout">
                        {/* Colonna sinistra: feed principale (invariata) */}
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

                                        {/* bottone Modifica (invariato) */}
                                        <button
                                            type="button"
                                            className="story-edit-button"
                                            onClick={() => openEditStory(story)}
                                        >
                                            Modifica
                                        </button>

                                        {/* bottone Elimina (invariato) */}
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

                            {stories.length === 0 && !isLoading && (
                                <p className="stories-empty">
                                    Nessuna storia ancora. Sii il primo a condividere un racconto.
                                </p>
                            )}
                        </section>

                        {/* Colonna destra: ultime storie (invariata) */}
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

                            {latestStories.length === 0 && !isLoading && (
                                <p className="stories-empty">Ancora nessuna storia recente.</p>
                            )}
                        </aside>
                    </div>
                </div>
            </div>

            {/* POPUP NUOVO RACCONTO */}
            {isAddStoryOpen && (
                <AddStory
                    onSubmit={handleSubmitStory} // Chiama API POST
                    onBack={closeAddStory}
                    isModal={true}
                />
            )}

            {/* POPUP MODIFICA RACCONTO */}
            {editingStory && (
                <EditStory
                    story={editingStory}
                    onCancel={closeEditStory}
                    onSave={handleSaveEditedStory} // Chiama API PUT
                />
            )}

            {/* POPUP ELIMINA RACCONTO */}
            {storyToDelete && (
                <DeleteStory
                    story={storyToDelete}
                    onCancel={closeDeleteStory}
                    onConfirm={handleDeleteConfirm} // Chiama la funzione API DELETE
                />
            )}
            <Footer/>
        </>
    );
};

export default StoriesBoard;