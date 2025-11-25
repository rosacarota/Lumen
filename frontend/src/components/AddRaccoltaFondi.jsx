import { useState } from "react";
import { Coins, Target, Calendar, SendHorizontal, ArrowLeft, AlignLeft } from "lucide-react";
import "../stylesheets/AddRaccoltaFondi.css";

const AddRaccoltaFondi = ({ onSubmit, onBack, isModal = false, enteId = "ID_ENTE_DEFAULT" }) => {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [obiettivo, setObiettivo] = useState("");
  const [dataChiusura, setDataChiusura] = useState("");

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (parseFloat(obiettivo) <= 0) {
      alert("L'obiettivo deve essere maggiore di zero.");
      return;
    }

    const nuovaRaccolta = {
      // idraccolta: generato dal DB
      titolo: titolo.trim(),
      descrizione: descrizione.trim(),
      obiettivo: parseFloat(obiettivo),
      totaleraccolto: 0,
      dataapertura: new Date().toISOString().split("T")[0],
      datachiusura: dataChiusura,
      ente: enteId,
    };

    if (onSubmit) {
      onSubmit(nuovaRaccolta);
    } else {
      console.log("Nuova Raccolta:", nuovaRaccolta);
    }

    resetForm();
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
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Pannello sinistro (Verde - Stile Originale) */}
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
                    />
                  </div>
                </div>

                <div className="arf-footer">
                  <p className="arf-helper-text">
                    La raccolta sarà subito visibile.
                  </p>
                  <button type="submit" className="arf-submit-button">
                    <SendHorizontal className="arf-submit-icon" />
                    <span>PUBBLICA RACCOLTA</span>
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