CREATE TYPE ruolo_type AS ENUM ('Volontario', 'Beneficiario', 'Ente');
CREATE TYPE stato_affiliazione_type AS ENUM ('Accettata', 'InAttesa');
CREATE TYPE stato_richiesta_type AS ENUM ('Accettata', 'InAttesa');

-- Tabella Indirizzo
CREATE TABLE Indirizzo (
    IDIndirizzo SERIAL PRIMARY KEY,
    Citta VARCHAR(100) NOT NULL,
    Provincia VARCHAR(50) NOT NULL,
    CAP CHAR(5) NOT NULL,
    Strada VARCHAR(255) NOT NULL,
    NCivico INTEGER
);

-- Tabella Utente
CREATE TABLE Utente (
    Email VARCHAR(255) PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Cognome VARCHAR(100),
    Indirizzo INTEGER,
    Password VARCHAR(255) NOT NULL,
    Descrizione TEXT,
    RecapitoTelefonico CHAR(10),
    Ambito VARCHAR(100),
    Ruolo ruolo_type NOT NULL,
    Immagine VARCHAR(255),
    FOREIGN KEY (Indirizzo) REFERENCES Indirizzo(IDIndirizzo)
);

-- Tabella Racconto
CREATE TABLE Racconto (
    IDRacconto SERIAL PRIMARY KEY,
    Titolo VARCHAR(255) NOT NULL,
    Descrizione TEXT,
    Utente VARCHAR(255) NOT NULL,
    DataPubblicazione DATE NOT NULL,
    Immagine VARCHAR(255),
    FOREIGN KEY (Utente) REFERENCES Utente(Email) ON DELETE CASCADE
);

-- Tabella Evento
CREATE TABLE Evento (
    IDEvento SERIAL PRIMARY KEY,
    Titolo VARCHAR(255) NOT NULL,
    Descrizione TEXT,
    Luogo INTEGER NOT NULL,
    DataInizio DATE NOT NULL,
    DataFine DATE NOT NULL,
    MaxPartecipanti INTEGER,
    Immagine VARCHAR(255),
    Ente VARCHAR(255) NOT NULL,
    FOREIGN KEY (Ente) REFERENCES Utente(Email) ON DELETE CASCADE,
    FOREIGN KEY (Luogo) REFERENCES Indirizzo(IDIndirizzo)
);

-- Tabella Raccolta fondi
CREATE TABLE RaccoltaFondi (
    IDRaccolta SERIAL PRIMARY KEY,
    Titolo VARCHAR(255) NOT NULL,
    Descrizione TEXT,
    Obiettivo DECIMAL(10, 2) NOT NULL,
    TotaleRaccolto DECIMAL(10, 2) DEFAULT 0.00,
    DataApertura DATE NOT NULL,
    DataChiusura DATE NOT NULL,
    Ente VARCHAR(255) NOT NULL,
    FOREIGN KEY (Ente) REFERENCES Utente(Email) ON DELETE CASCADE
);

-- Tabella Affiliazione
CREATE TABLE Affiliazione (
    IDAffiliazione SERIAL PRIMARY KEY,
    Descrizione TEXT,
    DataInizio DATE NOT NULL,
    Stato stato_affiliazione_type NOT NULL,
    Ente VARCHAR(255) NOT NULL,
    Volontario VARCHAR(255) NOT NULL,
    FOREIGN KEY (Ente) REFERENCES Utente(Email) ON DELETE CASCADE,
    FOREIGN KEY (Volontario) REFERENCES Utente(Email) ON DELETE CASCADE
);

-- Tabella Richiesta Servizio
CREATE TABLE RichiestaServizio (
    IDRichiestaServizio SERIAL PRIMARY KEY,
    Testo TEXT NOT NULL,
    Data DATE NOT NULL,
    Stato stato_richiesta_type NOT NULL,
    Beneficiario VARCHAR(255) NOT NULL,
    EnteVolontario VARCHAR(255) NOT NULL,
    FOREIGN KEY (Beneficiario) REFERENCES Utente(Email) ON DELETE CASCADE,
    FOREIGN KEY (EnteVolontario) REFERENCES Utente(Email) ON DELETE CASCADE
);

-- Tabella Partecipazione
CREATE TABLE Partecipazione (
    IDPartecipazione SERIAL PRIMARY KEY,
    DataPartecipazione DATE NOT NULL,
    Evento INTEGER NOT NULL,
    Volontario VARCHAR(255) NOT NULL,
    FOREIGN KEY (Evento) REFERENCES Evento(IDEvento) ON DELETE CASCADE,
    FOREIGN KEY (Volontario) REFERENCES Utente(Email) ON DELETE CASCADE,
    UNIQUE(Evento, Volontario)
);

-- Tabella Donazione
CREATE TABLE Donazione (
    IDDonazione SERIAL PRIMARY KEY,
    Utente VARCHAR(255) NOT NULL,
    IDRaccolta INTEGER NOT NULL,
    Importo DECIMAL(10, 2) NOT NULL,
    DataDonazione DATE NOT NULL,
    FOREIGN KEY (Utente) REFERENCES Utente(Email) ON DELETE CASCADE,
    FOREIGN KEY (IDRaccolta) REFERENCES RaccoltaFondi(IDRaccolta) ON DELETE CASCADE
);

-- Trigger per aggiornare il totale della raccolta fondi
CREATE FUNCTION aggiorna_totale_raccolta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE RaccoltaFondi
    SET TotaleRaccolto = TotaleRaccolto + NEW.Importo
    WHERE IDRaccolta = NEW.IDRaccolta;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_aggiorna_totale
AFTER INSERT ON Donazione
FOR EACH ROW
EXECUTE FUNCTION aggiorna_totale_raccolta();
