import React, { useState, useEffect } from "react";
import { Coins, SendHorizontal, ArrowLeft } from "lucide-react";
import Swal from 'sweetalert2';

// Importa la funzione dal service
import { createRaccolta } from "../services/RaccoltaFondiService";

const cssStyles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* --- Layout Principale --- */
.arf-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7fbfb 0%, #e9fbe7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.arf-container {
  position: relative;
  width: 100%;
  max-width: 780px; 
  min-height: 480px;
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(8, 120, 134, 0.25);
  background: white;
}

/* Bottone freccia indietro */
.arf-close-back-button {
  position: absolute;
  top: 18px; left: 18px; z-index: 20;
  width: 36px; height: 36px;
  border-radius: 999px; border: none;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.arf-close-back-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.arf-close-back-button svg { color: #087886; }

/* --- Pannello Sinistro --- */
.arf-left-panel {
  flex: 1;
  background: linear-gradient(135deg, #087886 0%, #4aafb8 50%, #7cce6b 100%);
  position: relative;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 50px;
}

.arf-gradient-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(8, 120, 134, 0.8) 0%, rgba(74, 175, 184, 0.6) 50%, rgba(124, 206, 107, 0.4) 100%);
}

.arf-blur-circle {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5;
  animation: pulse 5s ease-in-out infinite;
}
.arf-circle-1 { width: 300px; height: 300px; background: #7cce6b; top: 10%; left: 10%; animation-duration: 4s; }
.arf-circle-2 { width: 400px; height: 400px; background: #4aafb8; bottom: 10%; right: 10%; animation-duration: 5s; }

.arf-welcome-content {
  position: relative; z-index: 10; color: white; text-align: center;
  animation: fadeInUp 0.6s ease-out;
}
.arf-welcome-title { font-size: 38px; font-weight: 700; margin-bottom: 24px; text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2); }
.arf-welcome-subtitle { font-size: 16px; line-height: 1.6; opacity: 0.95; margin-bottom: 32px; }
.arf-welcome-footer { font-size: 14px; opacity: 0.9; }

/* --- Pannello Destro --- */
.arf-right-panel {
  flex: 1;
  background: white;
  padding: 40px 50px;
  display: flex; align-items: center; justify-content: center;
}

.arf-form-container { width: 100%; max-width: 420px; }

/* Logo & Testi */
.arf-logo-section { margin-bottom: 24px; }
.arf-logo-wrapper { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.arf-logo-icon { width: 30px; height: 30px; color: #087886; }
.arf-logo-text { font-size: 24px; font-weight: 700; color: #087886; }
.arf-logo-subtitle { font-size: 14px; color: #6b7280; }

/* Form */
.arf-story-form { display: flex; flex-direction: column; gap: 24px; }
.arf-fields-container { display: flex; flex-direction: column; gap: 16px; }
.arf-input-group { position: relative; width: 100%; }

/* Obiettivo e Data */
.arf-row-split { display: flex; gap: 10px; }
.arf-row-split .arf-input-group { flex: 1; }

.arf-input-field, .arf-text-area {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 25px; 
  font-size: 15px; outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.arf-date-input { color: #374151; cursor: pointer; }

.arf-text-area {
  min-height: 100px;
  resize: vertical;
}

.arf-input-field:focus, .arf-text-area:focus {
  border-color: #4aafb8;
  box-shadow: 0 0 0 3px rgba(74, 175, 184, 0.1);
}

/* Footer & Bottone */
.arf-footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; margin-top: 8px; flex-wrap: wrap;
}

.arf-helper-text { font-size: 13px; color: #6b7280; max-width: 200px; margin: 0; line-height: 1.2; }

/* STILE BOTTONE */
.arf-submit-button {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px;
  padding: 14px 25px;
  border: none;
  border-radius: 25px; 
  background: linear-gradient(135deg, #087886 0%, #7cce6b 120%); 
  color: white;
  font-size: 15px; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(8, 120, 134, 0.3);
  transition: all 0.3s ease;
  min-width: 160px;
}

.arf-submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(8, 120, 134, 0.4);
}
.arf-submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
.arf-submit-icon { width: 18px; height: 18px; }

/* Responsive */
@media (max-width: 900px) {
  .arf-left-panel { display: none; }
  .arf-container { min-height: auto; }
  .arf-right-panel { width: 100%; padding: 40px 20px; }
}

@media (max-width: 600px) {
  .arf-footer { flex-direction: column; align-items: stretch; }
  .arf-submit-button { width: 100%; }
  .arf-helper-text { text-align: center; max-width: 100%; margin-bottom: 10px; }
}

/* Modal */
.arf-page-modal {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(163, 244, 255, 0.32); /* Leggerissimo teal/bianco trasparente */
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.arf-page-modal .arf-container {
  max-width: 900px; 
  width: 100%;
  min-height: auto;
}
`;

// --- COMPONENTE PRINCIPALE ---
// IMPORTANTE: Abbiamo aggiunto 'onClose' alle props per gestire la chiusura dal padre
const AddRaccoltaFondi = ({ onSubmit, onBack, onClose, isModal = false }) => {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [obiettivo, setObiettivo] = useState("");
  const [dataChiusura, setDataChiusura] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Recupera l'Ente dal LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Errore nel parsing dell'utente:", error);
      }
    }
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isModal]);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const resetForm = () => {
    setTitolo("");
    setDescrizione("");
    setObiettivo("");
    setDataChiusura("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (parseFloat(obiettivo) <= 0) {
      Swal.fire('Attenzione', "L'obiettivo deve essere maggiore di zero.", 'warning');
      return;
    }

    setIsLoading(true);

    const nuovaRaccoltaPayload = {
      titolo: titolo.trim(),
      descrizione: descrizione.trim(),
      obiettivo: parseFloat(obiettivo),
      totaleRaccolto: 0.00,
      dataApertura: new Date().toISOString().split("T")[0],
      dataChiusura: dataChiusura,
      stato: "ATTIVA",
      ente: currentUser,
    };

    try {
      console.log("Invio dati...", nuovaRaccoltaPayload);

      const responseMessage = await createRaccolta(nuovaRaccoltaPayload);

      // 2. Notifica eventuali handler esterni (opzionale)
      if (onSubmit) {
        onSubmit(responseMessage);
      }

      // 3. CHIUSURA E RICARICA
      // Questa è la parte fondamentale: chiamando onClose (passato dal padre ProfiloEnte)
      // il padre chiuderà il modale e ricaricherà i dati.
      if (onClose) {
        onClose();
      } else if (onBack) {
        onBack();
      } else {
        resetForm();
      }

    } catch (error) {
      console.error("Errore creazione:", error);
      Swal.fire('Errore', error.message || "Errore sconosciuto", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per gestire il click sulla freccia "indietro" in alto
  const handleCloseOrBack = () => {
    if (onClose) onClose();
    else if (onBack) onBack();
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div className={`arf-page ${isModal ? "arf-page-modal" : ""}`}>
        <div className="arf-container">

          {/* Freccia indietro / Chiudi */}
          {(onBack || onClose) && (
            <button
              type="button"
              className="arf-close-back-button"
              onClick={handleCloseOrBack}
              title="Chiudi"
              disabled={isLoading}
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Pannello sinistro */}
          <div className="arf-left-panel">
            <div className="arf-gradient-overlay"></div>
            <div className="arf-blur-circle arf-circle-1"></div>
            <div className="arf-blur-circle arf-circle-2"></div>

            <div className="arf-welcome-content">
              <h1 className="arf-welcome-title">Lancia una Missione.</h1>
              <p className="arf-welcome-subtitle">
                Definisci un obiettivo chiaro e mobilita la community.
                Le grandi cause hanno bisogno di grandi inizi.
              </p>
              <div className="arf-welcome-footer">
                La trasparenza è la chiave per la fiducia.
              </div>
            </div>
          </div>

          {/* Pannello destro */}
          <div className="arf-right-panel">
            <div className="arf-form-container">

              <div className="arf-logo-section">
                <div className="arf-logo-wrapper">
                  <Coins className="arf-logo-icon" />
                  <span className="arf-logo-text">Nuova Raccolta</span>
                </div>
                <p className="arf-logo-subtitle">
                  Compila i dettagli per avviare la campagna.
                </p>
              </div>

              <div className="arf-form-content">
                <form onSubmit={handleSubmit} className="arf-story-form">
                  <div className="arf-fields-container">

                    <div className="arf-input-group">
                      <input
                        className="arf-input-field"
                        type="text"
                        value={titolo}
                        onChange={(e) => setTitolo(e.target.value)}
                        placeholder="Titolo della campagna"
                        required
                        maxLength={100}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="arf-row-split">
                      <div className="arf-input-group">
                        <input
                          className="arf-input-field"
                          type="number"
                          value={obiettivo}
                          onChange={(e) => setObiettivo(e.target.value)}
                          placeholder="Obiettivo (€)"
                          min="1"
                          step="0.50"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="arf-input-group">
                        <input
                          className="arf-input-field arf-date-input"
                          type="date"
                          value={dataChiusura}
                          onChange={(e) => setDataChiusura(e.target.value)}
                          min={getMinDate()}
                          required
                          title="Data Chiusura"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="arf-input-group">
                      <textarea
                        className="arf-text-area"
                        value={descrizione}
                        onChange={(e) => setDescrizione(e.target.value)}
                        placeholder="Descrivi la causa, perché è importante e come verranno utilizzati i fondi..."
                        rows={4}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="arf-footer">
                    <p className="arf-helper-text">
                      La raccolta sarà subito visibile.
                    </p>
                    <button
                      type="submit"
                      className="arf-submit-button"
                      disabled={isLoading}
                      style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                    >
                      <SendHorizontal className="arf-submit-icon" />
                      <span>{isLoading ? "CARICAMENTO..." : "PUBBLICA RACCOLTA"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRaccoltaFondi;