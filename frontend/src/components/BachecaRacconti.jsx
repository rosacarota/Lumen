import React, { useState, useEffect } from 'react';
import { Camera, Plus, Loader2 } from 'lucide-react';
import '../stylesheets/BachecaRacconti.css';
import AggiungiStoria from '../components/AddStory';

import { fetchStories, addStory } from '../services/StoriesService';

const BachecaRacconti = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

    const loadStories = async () => {
        setLoading(true);
        try {
            const data = await fetchStories();
            setStories(data);
        } catch (error) {
            console.error("Errore caricamento storie:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStories();
    }, []);

    const handleSaveStory = async (newStoryData) => {
        try {
            await addStory(newStoryData);
            setIsAddStoryOpen(false);
            await loadStories();
        } catch (error) {
            alert("Errore durante la pubblicazione: " + error.message);
        }
    };

    return (
        <>
            <div className="stories-card">
                <div className="stories-header">
                    <h3>BACHECA RACCONTI</h3>
                    {!loading && stories.length > 0 && (
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
                    ) : stories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <Camera size={32} color="#4AAFB8" />
                            </div>
                            <p>Non ci sono racconti attivi.</p>
                            <div 
                                className="empty-icon-wrapper add-action" 
                                onClick={() => setIsAddStoryOpen(true)}
                                title="Crea una nuova storia"
                            >
                                <Plus size={32} color="#4AAFB8" />
                            </div>
                            <p className="small-text">Aggiungi racconto</p>
                        </div>

                    ) : (
                        
                        <div className="stories-list" style={{ overflowY: 'auto', maxHeight: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {stories.map((story) => (
                                <div key={story.id} className="story-item">
                                    <div className="story-avatar">
                                        <span style={{ color: 'white', fontWeight: 'bold' }}>
                                            {story.authorName ? story.authorName.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div className="story-info">
                                        <h4>{story.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#555', margin: '2px 0' }}>
                                            {story.content.length > 50 
                                                ? story.content.substring(0, 50) + "..." 
                                                : story.content}
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                            {new Date(story.createdAt).toLocaleDateString()} - {story.authorName}
                                        </span>
                                    </div>
                                    {story.type === 'photo' && story.imageBase64 && (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', marginLeft: 'auto' }}>
                                            <img src={story.imageBase64} alt="anteprima" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isAddStoryOpen && (
                <AggiungiStoria 
                    onClose={() => setIsAddStoryOpen(false)}
                    onSubmit={handleSaveStory}
                    onBack={() => setIsAddStoryOpen(false)}
                />
            )}
        </>
    );
};

export default BachecaRacconti;