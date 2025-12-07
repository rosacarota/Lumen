import React, { useState } from 'react';
import { MessageSquare, SendHorizontal, ArrowLeft, Calendar } from 'lucide-react';
import { creaRichiestaServizio } from '../services/RichiestaServizioService';
import '../stylesheets/RichiestaServizio.css';

const RichiestaServizio = ({ onClose, enteDestinatarioEmail, isModal = true }) => {
    const [testo, setTesto] = useState('');
    const [dataRichiesta, setDataRichiesta] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getBeneficiarioEmail = () => {
        const email = localStorage.getItem("email");
        if (email) {
            return email;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const beneficiarioEmail = getBeneficiarioEmail();

        if (!beneficiarioEmail) {
            setError("Errore: Utente non autenticato.");
            setIsLoading(false);
            return;
        }

        const nuovaRichiesta = {
            testo: testo.trim(),
            dataRichiesta: dataRichiesta,
            beneficiario: null,
            enteVolontario: localStorage.getItem("searchEmail")
        };

        try {
            await creaRichiestaServizio(nuovaRichiesta);
            setSuccess("Richiesta inviata con successo!");
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        } catch (err) {
            setError(err.message || "Errore durante l'invio.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`rs-page ${isModal ? "rs-page-modal" : ""}`} onClick={onClose}>
            <div className="rs-container" onClick={(e) => e.stopPropagation()}>
                {onClose && (
                    <button
                        type="button"
                        className="rs-close-back-button"
                        onClick={onClose}
                        title="Chiudi"
                        disabled={isLoading}
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="rs-left-panel">
                    <div className="rs-gradient-overlay"></div>
                    <div className="rs-blur-circle rs-circle-1"></div>
                    <div className="rs-blur-circle rs-circle-2"></div>
                    <div className="rs-welcome-content">
                        <h1 className="rs-welcome-title">Chiedi Aiuto.</h1>
                        <p className="rs-welcome-subtitle">
                            Descrivi di cosa hai bisogno e quando. L'ente o il volontario riceverà la tua segnalazione immediatamente.
                        </p>
                        <div className="rs-welcome-footer">
                            Siamo qui per supportarti.
                        </div>
                    </div>
                </div>
                <div className="rs-right-panel">
                    <div className="rs-form-container">
                        <div className="rs-logo-section">
                            <div className="rs-logo-wrapper">
                                <MessageSquare className="rs-logo-icon" />
                                <span className="rs-logo-text">Nuova Richiesta</span>
                            </div>
                            <p className="rs-logo-subtitle">
                                Compila i dettagli del servizio richiesto.
                            </p>
                        </div>
                        <div className="rs-form-content">
                            {success ? (
                                <div className="success-message" style={{ color: 'green', textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>
                                    {success}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="rs-form">
                                    <div className="rs-fields-container">
                                        <div className="rs-input-group">
                                            <textarea
                                                className="rs-text-area"
                                                value={testo}
                                                onChange={(e) => setTesto(e.target.value)}
                                                placeholder="Descrivi la tua necessità (es. spesa, trasporto...)"
                                                rows={5}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="rs-input-group">
                                            <div style={{ position: 'relative', width: '100%' }}>
                                                <Calendar
                                                    size={18}
                                                    style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#087886', pointerEvents: 'none' }}
                                                />
                                                <input
                                                    type="date"
                                                    className="rs-input-field"
                                                    style={{ paddingLeft: '40px' }}
                                                    value={dataRichiesta}
                                                    onChange={(e) => setDataRichiesta(e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {error && <div className="error-message" style={{ color: '#e74c3c', fontSize: '0.9em', marginTop: '10px' }}>{error}</div>}
                                    <div className="rs-footer">
                                        <p className="rs-helper-text">
                                            La richiesta sarà visibile solo al destinatario.
                                        </p>
                                        <button
                                            type="submit"
                                            className="rs-submit-button"
                                            disabled={isLoading}
                                            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                                        >
                                            <SendHorizontal className="rs-submit-icon" />
                                            <span>{isLoading ? "INVIO..." : "INVIA SEGNALAZIONE"}</span>
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

export default RichiestaServizio;