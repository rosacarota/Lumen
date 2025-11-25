TRUNCATE TABLE Indirizzo, Utente, Racconto, Evento, RaccoltaFondi, Affiliazione, RichiestaServizio, Partecipazione, Donazione RESTART IDENTITY CASCADE;

INSERT INTO Indirizzo (Citta, Provincia, CAP, Strada, NCivico) VALUES
    ('Roma', 'RM', '00185', 'Via Marsala', '8'),
    ('Milano', 'MI', '20124', 'Piazza Duca d''Aosta', '1'),
    ('Napoli', 'NA', '80142', 'Corso Lucci', '12'),
    ('Torino', 'TO', '10152', 'Lungo Dora Savona', '30'),
    ('Palermo', 'PA', '90133', 'Via Roma', '22'),
    ('Bari', 'BA', '70121', 'Piazza Aldo Moro', '5');

INSERT INTO Utente (Email, Nome, Cognome, Indirizzo, Password, Descrizione, RecapitoTelefonico, Ambito, Ruolo, Immagine) VALUES
    ('msf.italia@lumen.it', 'Medici Senza', 'Frontiere', 1, '$2a$10$hashpassword', 'Assistenza medica indipendente in tutto il mondo.', '0644869999', 'Sanitario', 'Ente', 'logo_msf.png'),
    ('caritas.ambrosiana@lumen.it', 'Caritas', 'Ambrosiana', 2, '$2a$10$hashpassword', 'Promozione della carità e supporto agli indigenti.', '0276037111', 'Sociale', 'Ente', 'logo_caritas.png'),
    ('emergency@lumen.it', 'Emergency', 'ONG', 4, '$2a$10$hashpassword', 'Cure medico-chirurgiche gratuite e di elevata qualità alle vittime della guerra.', '02881881', 'Sanitario', 'Ente', 'logo_emergency.png'),
    ('bancoalimentare@lumen.it', 'Banco', 'Alimentare', 3, '$2a$10$hashpassword', 'Recupero eccedenze alimentari per distribuirle a chi ha bisogno.', '0815551234', 'Alimentare', 'Ente', 'logo_banco.png'),
    ('paolo.medico@email.com', 'Paolo', 'Bianchi', 5, '$2a$10$hashpassword', 'Chirurgo d''urgenza con esperienza in zone di conflitto.', '3331112222', 'Sanitario', 'Volontario', 'avatar_paolo.jpg'),
    ('sara.sociale@email.com', 'Sara', 'Rossi', 6, '$2a$10$hashpassword', 'Assistente sociale specializzata in integrazione migranti.', '3332223333', 'Sociale', 'Volontario', 'avatar_sara.jpg'),
    ('luca.autista@email.com', 'Luca', 'Verdi', 2, '$2a$10$hashpassword', 'Disponibile con furgone proprio per trasporto merci.', '3334445555', 'Logistica', 'Volontario', 'avatar_luca.jpg'),
    ('anna.infermiera@email.com', 'Anna', 'Neri', 1, '$2a$10$hashpassword', 'Infermiera pediatrica.', '3336667777', 'Sanitario', 'Volontario', 'avatar_anna.jpg'),
    ('marco.studente@email.com', 'Marco', 'Gialli', NULL, '$2a$10$hashpassword', 'Studente di mediazione linguistica, offro traduzioni.', '3338889999', 'Educativo', 'Volontario', NULL),
    ('ahmed.rifugiato@email.com', 'Ahmed', 'Karim', 1, '$2a$10$hashpassword', 'Richiedente asilo, necessito supporto legale e abitativo.', '3409990000', NULL, 'Beneficiario', NULL),
    ('giovanna.anziana@email.com', 'Giovanna', 'Esposito', 3, '$2a$10$hashpassword', 'Pensionata sola con pensione minima.', '3408887777', NULL, 'Beneficiario', NULL),
    ('famiglia.rossi@email.com', 'Giuseppe', 'Rossi', 4, '$2a$10$hashpassword', 'Padre di 3 figli, disoccupato da sei mesi.', '3405556666', NULL, 'Beneficiario', NULL);

INSERT INTO Racconto (Titolo, Descrizione, Utente, DataPubblicazione, Immagine) VALUES
    ('La mia missione a Kabul', 'Tre mesi in ospedale chirurgico. È stata dura ma abbiamo salvato tante vite.', 'paolo.medico@email.com', '2023-08-15', 'kabul.jpg'),
    ('Un pasto caldo per tutti', 'Ieri sera abbiamo distribuito 200 pasti alla stazione centrale. I sorrisi ripagano la fatica.', 'sara.sociale@email.com', '2023-09-10', 'stazione.jpg'),
    ('Lezioni di italiano', 'Il piccolo Youssef ha imparato a scrivere il suo nome oggi. Emozione pura.', 'marco.studente@email.com', '2023-10-05', 'scuola.jpg'),
    ('Consegna pacchi viveri', 'Abbiamo raggiunto 50 famiglie in difficoltà nella periferia nord.', 'luca.autista@email.com', '2023-11-12', 'furgone.jpg');

INSERT INTO Evento (Titolo, Descrizione, Luogo, DataInizio, DataFine, MaxPartecipanti, Immagine, Ente) VALUES
    ('Screening Sanitario Gratuito', 'Visite mediche di base e controllo pressione per senza fissa dimora.', 1, '2023-12-05', '2023-12-05', 100, 'visite.jpg', 'msf.italia@lumen.it'),
    ('Raccolta Farmaci', 'Giornata di raccolta farmaci da banco da destinare alle famiglie indigenti.', 2, '2023-12-10', '2023-12-10', 50, 'farmaci.jpg', 'caritas.ambrosiana@lumen.it'),
    ('Pranzo di Natale Solidale', 'Un pranzo completo offerto a chi non può permetterselo.', 3, '2023-12-25', '2023-12-25', 300, 'natale.jpg', 'bancoalimentare@lumen.it'),
    ('Formazione Logisti Umanitari', 'Corso per gestione campi profughi e magazzini in emergenza.', 4, '2024-01-15', '2024-01-20', 25, 'logistica.jpg', 'emergency@lumen.it'),
    ('Supporto Psicologico Migranti', 'Gruppi di ascolto e supporto con mediatori culturali.', 5, '2024-02-01', '2024-02-28', 40, 'ascolto.jpg', 'msf.italia@lumen.it');

INSERT INTO RaccoltaFondi (Titolo, Descrizione, Obiettivo, TotaleRaccolto, DataApertura, DataChiusura, Ente) VALUES
    ('Ospedale da Campo Sudan', 'Fondi urgenti per l''acquisto di generatori e materiale chirurgico.', 150000.00, 12000.00, '2023-06-01', '2023-12-31', 'emergency@lumen.it'),
    ('Emergenza Freddo', 'Acquisto di sacchi a pelo termici e coperte per i senzatetto.', 5000.00, 800.00, '2023-10-01', '2024-03-01', 'caritas.ambrosiana@lumen.it'),
    ('Kit Scolastici per tutti', 'Zaini e libri per bambini di famiglie in difficoltà economica.', 3000.00, 150.00, '2023-09-01', '2024-09-01', 'caritas.ambrosiana@lumen.it'),
    ('Malnutrizione Infantile', 'Acquisto di alimenti terapeutici pronti all''uso.', 50000.00, 5000.00, '2023-01-01', '2024-01-01', 'msf.italia@lumen.it');

INSERT INTO Affiliazione (Descrizione, DataInizio, Stato, Ente, Volontario) VALUES
    ('Chirurgo volontario per missioni brevi', '2022-03-10', 'Accettata', 'msf.italia@lumen.it', 'paolo.medico@email.com'),
    ('Volontaria centro ascolto', '2023-01-15', 'Accettata', 'caritas.ambrosiana@lumen.it', 'sara.sociale@email.com'),
    ('Autista per recupero eccedenze', '2023-06-20', 'Accettata', 'bancoalimentare@lumen.it', 'luca.autista@email.com'),
    ('Infermiera triage', '2023-09-01', 'InAttesa', 'emergency@lumen.it', 'anna.infermiera@email.com'),
    ('Traduttore arabo-italiano', '2023-11-01', 'Accettata', 'msf.italia@lumen.it', 'marco.studente@email.com');

INSERT INTO RichiestaServizio (Testo, Data, Stato, Beneficiario, EnteVolontario) VALUES
    ('Ho bisogno di coperte pesanti, dormo in stazione.', '2023-11-20', 'Accettata', 'ahmed.rifugiato@email.com', 'caritas.ambrosiana@lumen.it'),
    ('Pacco alimentare per 3 persone, siamo rimasti senza lavoro.', '2023-11-22', 'InAttesa', 'famiglia.rossi@email.com', 'bancoalimentare@lumen.it'),
    ('Visita oculistica urgente, non vedo bene e non ho soldi.', '2023-11-23', 'InAttesa', 'giovanna.anziana@email.com', 'msf.italia@lumen.it'),
    ('Richiesta supporto legale per rinnovo permesso di soggiorno.', '2023-11-24', 'InAttesa', 'ahmed.rifugiato@email.com', 'sara.sociale@email.com');

INSERT INTO Partecipazione (DataPartecipazione, Evento, Volontario) VALUES
    ('2023-12-05', 1, 'paolo.medico@email.com'),
    ('2023-12-05', 1, 'anna.infermiera@email.com'),
    ('2023-12-10', 2, 'sara.sociale@email.com'),
    ('2023-12-25', 3, 'luca.autista@email.com'),
    ('2023-12-25', 3, 'marco.studente@email.com');

INSERT INTO Donazione (Utente, IDRaccolta, Importo, DataDonazione) VALUES
   ('paolo.medico@email.com', 1, 200.00, '2023-09-15'),
   ('anna.infermiera@email.com', 2, 50.00, '2023-10-20'),
   ('luca.autista@email.com', 1, 30.00, '2023-11-01'),
   ('marco.studente@email.com', 3, 10.00, '2023-11-05'),
   ('sara.sociale@email.com', 4, 100.00, '2023-11-10'),
   ('giovanna.anziana@email.com', 2, 5.00, '2023-11-15');