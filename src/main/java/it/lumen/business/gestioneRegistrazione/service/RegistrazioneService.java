package it.lumen.business.gestioneRegistrazione.service;

import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;

import java.io.IOException;

/**
 * Interfaccia per il servizio di registrazione degli utenti.
 * Gestisce la creazione di nuovi account e il salvataggio delle relative
 * informazioni.
 */
public interface RegistrazioneService {

    /**
     * Registra un nuovo utente nel sistema.
     * Effettua controlli preliminari (come l'unicità dell'email), cifra la password
     * e salva l'eventuale immagine del profilo.
     *
     * @param utente L'oggetto Utente da registrare.
     */
    @Transactional
    void registraUtente(Utente utente);

    /**
     * Verifica se un'email è già presente nel sistema.
     *
     * @param email L'email da verificare.
     * @return true se l'email esiste già, false altrimenti.
     */
    public boolean checkEmail(String email);

    /**
     * Salva l'immagine del profilo a partire da una stringa Base64.
     * Decodifica la stringa, genera un nome file univoco e salva il file nel
     * filesystem.
     *
     * @param base64String La stringa che rappresenta l'immagine in formato Base64.
     * @return Il percorso relativo (URL-friendly) dell'immagine salvata.
     * @throws IOException Se si verificano errori durante la scrittura del file.
     */
    String salvaImmagine(String base64String) throws IOException;

}
