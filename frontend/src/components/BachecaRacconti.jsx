import React, { useState, useEffect } from 'react';
import { Camera, Plus, Loader2 } from 'lucide-react';
import '../stylesheets/BachecaRacconti.css';
import AddStory from '../components/AddStory';
import EditStory from "../components/EditStory";
import DeleteStory from "../components/DeleteStory";
import { fetchFilteredStories } from '../services/StoriesService';
import { Link } from 'react-router-dom';

const BachecaRacconti = ({ isOwner, targetEmail }) => {
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [storyToDelete, setStoryToDelete] = useState(null);

    const loadFilteredStories = async () => {
        let emailToSearch = targetEmail;
        if (!emailToSearch) emailToSearch = localStorage.getItem("searchEmail");
        // console.log(emailToSearch) // Commentato log
        if (!emailToSearch) return;

        setLoading(true);
        try {
            const filteredData = await fetchFilteredStories(emailToSearch);
            const sortedData = [...filteredData].reverse();
            setFilteredStories(sortedData);
        } catch (error) { console.error("Errore durante il caricamento delle storie dell'utente: ", error); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        loadFilteredStories();
    }, [targetEmail]);

    // Callback chiamata dopo l'aggiunta con successo
    const handleAddSuccess = async () => {
        setIsAddStoryOpen(false);
        await loadFilteredStories();
    };

    // Callback chiamata dopo la modifica con successo
    const handleEditSuccess = async () => {
        setEditingStory(null);
        await loadFilteredStories();
    };

    // Callback chiamata dopo l'eliminazione con successo
    const handleDeleteSuccess = async () => {
        setStoryToDelete(null);
        await loadFilteredStories();
    };

    return (
        <>
            <div className="stories-card">
                <div className="stories-header">
                    <h3>BACHECA RACCONTI</h3>
                    {!loading && filteredStories.length > 0 && isOwner && (
                        <button
                            className="header-add-btn"
                            onClick={() => setIsAddStoryOpen(true)}
                            title="Aggiungi racconto"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#087886', position: 'absolute', right: '20px'
                            }}
                        >
                            <Plus size={24} />
                        </button>
                    )}
                </div>
                <div className="stories-body">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <Loader2 className="animate-spin" color="#4AAFB8" />
                        </div>
                    ) : filteredStories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <Camera size={32} color="#4AAFB8" />
                            </div>
                            <p>Non ci sono racconti attivi.</p>
                            {isOwner && (
                                <>
                                    <div
                                        className="empty-icon-wrapper add-action"
                                        onClick={() => setIsAddStoryOpen(true)}
                                        title="Crea una nuova storia"
                                    >
                                        <Plus size={32} color="#4AAFB8" />
                                    </div>
                                    <p className="small-text">Aggiungi racconto</p>
                                </>
                            )}
                        </div>

                    ) : (

                        <div className="stories-list" style={{ overflowY: 'auto', maxHeight: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {filteredStories.map((story) => (
                                <div key={story.id} className="story-item-container">
                                    <Link
                                        to="/storie"
                                        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                                    >
                                        <div className="story-item">
                                            <div className="story-avatar">
                                                {story.authorAvatar ? (
                                                    <img
                                                        src={story.authorAvatar.startsWith('data:image')
                                                            ? story.authorAvatar
                                                            : `data:image/jpeg;base64,${story.authorAvatar}`}
                                                        alt={story.authorName}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                ) : (
                                                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                                                        {story.authorName ? story.authorName.charAt(0).toUpperCase() : 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="story-info">
                                                <h4>{story.title}</h4>
                                                <p style={{ fontSize: '0.85rem', color: '#555', margin: '2px 0' }}>
                                                    {story.content.length > 50
                                                        ? story.content.substring(0, 50) + "..."
                                                        : story.content}
                                                </p>
                                                <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                                    {new Date(story.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {story.type === 'photo' && story.imageBase64 && (
                                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', marginLeft: 'auto' }}>
                                                    <img src={story.imageBase64} alt="anteprima" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    {isOwner && (
                                        <div className="story-cards-footer">
                                            <button
                                                type="button"
                                                className="story-cards-edit-button"
                                                onClick={() => setEditingStory(story)}
                                            >
                                                Modifica
                                            </button>

                                            <button
                                                type="button"
                                                className="story-cards-delete-btn"
                                                onClick={() => setStoryToDelete(story)}
                                            >
                                                Elimina
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isOwner && isAddStoryOpen && (
                <AddStory
                    onClose={() => setIsAddStoryOpen(false)}
                    onSubmit={handleAddSuccess}
                    onBack={() => setIsAddStoryOpen(false)}
                />
            )}
            {isOwner && editingStory && (
                <EditStory
                    story={editingStory}
                    onCancel={() => setEditingStory(null)}
                    onSave={handleEditSuccess}
                />
            )}
            {isOwner && storyToDelete && (
                <DeleteStory
                    story={storyToDelete}
                    onCancel={() => setStoryToDelete(null)}
                    onConfirm={handleDeleteSuccess}
                />
            )}
        </>
    );
};

export default BachecaRacconti;