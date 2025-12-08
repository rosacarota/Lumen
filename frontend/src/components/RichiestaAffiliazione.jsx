import React, { useState, useEffect } from 'react';
import { UserPlus, SendHorizontal, ArrowLeft } from 'lucide-react';
import AffiliazioneService from '../services/AffiliazioneService';
import '../stylesheets/RichiestaAffiliazione.css';

const RichiestaAffiliazione = ({ onClose, emailEnte, isModal = false }) => {
    const [descrizione, setDescrizione] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Utente non autenticato.");
            setIsLoading(false);
            return;
        }

        try {
            const message = await AffiliazioneService.richiediAffiliazione(descrizione, emailEnte, token);
            setSuccess(message);
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isModal) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isModal]);

    const handleBackdropClick = (e) => {
        if (isModal && onClose && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`ra-page ${isModal ? "ra-page-modal" : ""}`} onClick={handleBackdropClick}>
            <div className="ra-container">
                {/* Freccia indietro */}
                {onClose && (
                    <button
                        type="button"
                        className="ra-close-back-button"
                        onClick={onClose}
                        title="Chiudi"
                        disabled={isLoading}
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                {/* Pannello sinistro */}
                <div className="ra-left-panel">
                    <div className="ra-gradient-overlay"></div>
                    <div className="ra-blur-circle ra-circle-1"></div>
                    <div className="ra-blur-circle ra-circle-2"></div>

                    <div className="ra-welcome-content">
                        <h1 className="ra-welcome-title">Unisciti alla Missione.</h1>
                        <p className="ra-welcome-subtitle">
                            Diventa parte attiva dell'ente e contribuisci con il tuo tempo e le tue competenze.
                            Insieme possiamo fare la differenza.
                        </p>
                        <div className="ra-welcome-footer">
                            La tua richiesta sarà valutata dall'ente.
                        </div>
                    </div>
                </div>

                {/* Pannello destro (Form) */}
                <div className="ra-right-panel">
                    <div className="ra-form-container">

                        <div className="ra-logo-section">
                            <div className="ra-logo-wrapper">
                                <UserPlus className="ra-logo-icon" />
                                <span className="ra-logo-text">Richiesta Affiliazione</span>
                            </div>
                            <p className="ra-logo-subtitle">
                                Spiega brevemente perché vuoi unirti a noi.
                            </p>
                        </div>

                        <div className="ra-form-content">
                            {success ? (
                                <div className="success-message" style={{ color: 'green', textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>
                                    {success}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="ra-form">
                                    <div className="ra-fields-container">
                                        {/* Descrizione */}
                                        <div className="ra-input-group">
                                            <textarea
                                                className="ra-text-area"
                                                value={descrizione}
                                                onChange={(e) => setDescrizione(e.target.value)}
                                                placeholder="Scrivi qui le tue motivazioni..."
                                                rows={5}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {error && <div className="error-message" style={{ color: 'red', fontSize: '0.9em' }}>{error}</div>}

                                    <div className="ra-footer">
                                        <p className="ra-helper-text">
                                            Inviando la richiesta accetti di condividere i tuoi dati con l'ente.
                                        </p>
                                        <button
                                            type="submit"
                                            className="ra-submit-button"
                                            disabled={isLoading}
                                            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                                        >
                                            <SendHorizontal className="ra-submit-icon" />
                                            <span>{isLoading ? "INVIO..." : "INVIA RICHIESTA"}</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RichiestaAffiliazione;
