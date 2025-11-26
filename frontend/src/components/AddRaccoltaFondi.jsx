import { useState, useEffect } from "react";
import { Coins, SendHorizontal, ArrowLeft } from "lucide-react";
import { createRaccolta } from "../services/RaccoltaFondiService"; 
import "../stylesheets/AddRaccoltaFondi.css";

const AddRaccoltaFondi = ({ onSubmit, onBack, isModal = false }) => {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [obiettivo, setObiettivo] = useState("");
  const [dataChiusura, setDataChiusura] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Stato per il caricamento
  
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Recupera l'Ente dal LocalStorage al caricamento della pagina
  useEffect(() => {
    // Assicurati che la chiave nel localStorage corrisponda a come salvi l'utente al login
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

    // Validazione Ente
    if (!currentUser) {
      alert("Errore: Nessun Ente loggato. Effettua il login per creare una raccolta.");
      return;
    }

    if (parseFloat(obiettivo) <= 0) {
      alert("L'obiettivo deve essere maggiore di zero.");
      return;
    }

    setIsLoading(true); // Avvia spinner o stato di caricamento

    // 2. Costruzione dell'oggetto JSON per il Backend Java
    // Assicurati che i nomi dei campi corrispondano esattamente alla classe 'RaccoltaFondi' in Java
    const nuovaRaccoltaPayload = {
      titolo: titolo.trim(),
      descrizione: descrizione.trim(),
      obiettivo: parseFloat(obiettivo),
      totaleRaccolto: 0.00, 
      dataApertura: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      dataChiusura: dataChiusura,
      // Il backend si aspetta un oggetto Utente/Ente completo o mappato correttamente
      ente: currentUser, 
      stato: "ATTIVA" // Opzionale: se il tuo backend richiede uno stato iniziale esplicito
    };

    try {
      // 3. Chiamata al Service
      console.log("Invio payload al backend:", nuovaRaccoltaPayload);
      
      // La risposta è una stringa (es. "Raccolta fondi avviata Titolo con successo")
      const message = await createRaccolta(nuovaRaccoltaPayload);
      
      console.log("Risposta backend:", message);
      alert(message); // Mostra il messaggio restituito dal controller Java

      if (onSubmit) {
        onSubmit(nuovaRaccoltaPayload);
      }
      
      if (onBack) {
        onBack(); 
      } else {
        resetForm();
      }

    } catch (error) {
      console.error("Errore durante la creazione:", error);
      // Mostra l'errore specifico (es. validazione fallita dal backend)
      alert("Errore: " + error.message);
    } finally {
      setIsLoading(false); // Ferma stato di caricamento
    }
  };

  return (
    <div className={`arf-page ${isModal ? "arf-page-modal" : ""}`}>
      <div className="arf-container">
        {/* Freccia indietro */}
        {onBack && (
          <button
            type="button"
            className="arf-close-back-button"
            onClick={onBack}
            title="Torna indietro"
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

        {/* Pannello destro (Form) */}
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
                  
                  {/* Titolo */}
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

                  {/* Riga Doppia: Obiettivo e Data */}
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

                  {/* Descrizione */}
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
                    <span>{isLoading ? "INVIO IN CORSO..." : "PUBBLICA RACCOLTA"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRaccoltaFondi;