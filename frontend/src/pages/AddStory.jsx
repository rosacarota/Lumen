import { useState, useRef, useEffect } from "react";
import { Image, FileText, SendHorizontal, ArrowLeft } from "lucide-react";
// Assicurati che il percorso del CSS sia corretto
import "../stylesheets/AddStory.css";

// FIX: Usiamo 'onBack' per la chiusura come nella tua versione, e aggiungiamo 'storyToEdit' per la modifica
const AddStory = ({ onSubmit, onBack, storyToEdit }) => {
    const [storyType, setStoryType] = useState("text");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    // --- Funzione per convertire file in Base64 ---
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    // --- Se esiste un racconto da modificare, inizializzo il form ---
    useEffect(() => {
        if (storyToEdit) {
            // Inizializza i campi con i dati esistenti per la modifica
            setStoryType(storyToEdit.type || "text");
            setTitle(storyToEdit.title || "");
            setContent(storyToEdit.content || "");
            setFile(null); // L'utente può caricare una nuova foto, ma non usiamo 'file' come stato del file esistente
        }
    }, [storyToEdit]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setStoryType("text");
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --- Funzione per Aggiungere un nuovo racconto (handleSubmit) ---
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (storyType === "photo" && !file && !content.trim()) {
            alert(
                "Per una storia con foto devi caricare un file o inserire una descrizione/link."
            );
            return;
        }

        let imageBase64 = null;
        if (storyType === "photo" && file) {
            try {
                imageBase64 = await toBase64(file);
            } catch (error) {
                console.error("Errore nella conversione dell'immagine:", error);
                alert("Impossibile leggere il file immagine.");
                return;
            }
        }

        const newStory = {
            type: storyType,
            title: title.trim(),
            content: content.trim(),
            imageBase64,
            createdAt: new Date().toISOString(),
        };

        if (onSubmit) onSubmit(newStory);
        else console.log("New story:", newStory);

        resetForm();
        if (onBack) onBack(); // <-- FIX: Usiamo onBack qui
    };

    // --- Funzione per Modificare un racconto esistente (handleEditStory) ---
    const handleEditStory = async (event) => {
        event.preventDefault(); // Aggiunto per evitare il refresh

        if (!storyToEdit || !storyToEdit.id) {
            console.error("ID racconto mancante per la modifica");
            return;
        }

        if (
            storyType === "photo" &&
            !file &&
            !content.trim() &&
            !storyToEdit.imageBase64
        ) {
            alert(
                "Per una storia con foto devi caricare un file, inserire una descrizione o lasciare la foto esistente."
            );
            return;
        }

        let imageBase64 = storyToEdit.imageBase64 || null; // Parte dalla foto esistente
        if (storyType === "photo" && file) {
            try {
                imageBase64 = await toBase64(file); // Converte la nuova foto
            } catch (error) {
                console.error("Errore nella conversione dell'immagine:", error);
                alert("Impossibile leggere il file immagine.");
                return;
            }
        }

        const updatedStory = {
            id: storyToEdit.id,
            type: storyType,
            title: title.trim(),
            content: content.trim(),
            imageBase64,
            createdAt: new Date().toISOString(),
        };

        if (onSubmit) onSubmit(updatedStory);
        else console.log("Updated story:", updatedStory);

        resetForm();
        if (onBack) onBack(); // <-- FIX: Usiamo onBack qui
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile || null);
    };

    const handleTypeChange = (type) => {
        setStoryType(type);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getHeaderIcon = () => {
        switch (storyType) {
            case "photo":
                return <Image className="logo-icon" />;
            case "text":
            default:
                return <FileText className="logo-icon" />;
        }
    };

    const getHelperPlaceholder = () => {
        const base =
            "Racconta cosa è successo, chi hai incontrato, come ti sei sentito...";
        switch (storyType) {
            case "photo":
                return `Descrizione foto o link. ${base}`;
            case "text":
            default:
                return base;
        }
    };
    const dotTypes = ["text", "photo"];

    return (
        // FIX: Usiamo onBack per chiudere cliccando fuori
        <div className="modal-overlay" onClick={onBack}>
            <div className="add-story-container" onClick={(e) => e.stopPropagation()}>

                {/* FIX: Usiamo onBack per il pulsante di chiusura */}
                {onBack && (
                    <button
                        type="button"
                        className="close-back-button"
                        onClick={onBack}
                        title="Chiudi"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                <div className="left-panel">
                    <div className="gradient-overlay"></div>
                    <div className="blur-circle circle-1"></div>
                    <div className="blur-circle circle-2"></div>
                    <div className="welcome-content">
                        <h1 className="welcome-title">Condividi un racconto.</h1>
                        <p className="welcome-subtitle">
                            Ogni esperienza conta. Aggiungi il tuo contributo alla nostra
                            bacheca e ispira gli altri.
                        </p>
                        <div className="welcome-footer">
                            Grazie per essere parte attiva della nostra community.
                        </div>
                    </div>
                </div>
                <div className="right-panel">
                    <div className="form-container">
                        <div className="logo-section">
                            <div className="logo-wrapper">
                                {getHeaderIcon()}
                                <span className="logo-text">
                                    {storyToEdit ? "Modifica Racconto" : "Nuovo Racconto"} {/* Aggiunto: cambia testo in base a 'storyToEdit' */}
                                </span>
                            </div>
                            <p className="logo-subtitle">
                                Seleziona il tipo di contenuto da condividere.
                            </p>
                        </div>

                        <div className="form-content">
                            <div className="type-selector">
                                <button
                                    type="button"
                                    className={`type-button ${storyType === "text" ? "active" : ""
                                        }`}
                                    onClick={() => handleTypeChange("text")}
                                >
                                    <FileText className="type-icon" />
                                    <span>Testo</span>
                                </button>

                                <button
                                    type="button"
                                    className={`type-button ${storyType === "photo" ? "active" : ""
                                        }`}
                                    onClick={() => handleTypeChange("photo")}
                                >
                                    <Image className="type-icon" />
                                    <span>Foto</span>
                                </button>
                            </div>

                            {storyType === "photo" && (
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                            )}

                            <form
                                onSubmit={storyToEdit ? handleEditStory : handleSubmit} // Se stiamo modificando, usa handleEditStory
                                className="story-form"
                            >
                                <div className="fields-container">
                                    <div className="input-group">
                                        <input
                                            className="input-field-no-icon"
                                            type="text"
                                            value={title}
                                            onChange={(event) => setTitle(event.target.value)}
                                            placeholder="Titolo breve e significativo"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <textarea
                                            className="text-area"
                                            value={content}
                                            onChange={(event) => setContent(event.target.value)}
                                            placeholder={getHelperPlaceholder()}
                                            rows={file ? 4 : 6}
                                            required={storyType === "text"}
                                        />
                                    </div>

                                    {storyType === "photo" && (
                                        <div
                                            className="file-upload-area"
                                            onClick={() =>
                                                fileInputRef.current && fileInputRef.current.click()
                                            }
                                        >
                                            {file ? (
                                                <p className="file-info">
                                                    File selezionato:{" "}
                                                    <strong>{file.name}</strong> (
                                                    {Math.round(file.size / 1024)} KB) – clicca per
                                                    cambiare
                                                </p>
                                            ) : storyToEdit?.imageBase64 ? ( // Aggiunto: check per foto esistente
                                                <p className="file-info">
                                                    Foto esistente presente – puoi sostituirla cliccando
                                                    qui
                                                </p>
                                            ) : (
                                                <p className="file-placeholder">
                                                    Clicca qui per caricare una Foto (o incolla un link
                                                    nel campo sopra).
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="dots-indicator">
                                    {dotTypes.map((type) => (
                                        <span
                                            key={type}
                                            className={`dot ${storyType === type ? "active" : ""}`}
                                        ></span>
                                    ))}
                                </div>

                                <div className="story-footer">
                                    <p className="helper-text">
                                        Le storie verranno mostrate nella tua bacheca.
                                    </p>
                                    <button type="submit" className="submit-button">
                                        <SendHorizontal className="submit-icon" />
                                        <span>
                                            {storyToEdit ? "SALVA MODIFICHE" : "PUBBLICA RACCONTO"}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AddStory;