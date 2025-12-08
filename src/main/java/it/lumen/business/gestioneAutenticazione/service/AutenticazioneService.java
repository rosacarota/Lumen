package it.lumen.business.gestioneAutenticazione.service;

import it.lumen.data.entity.Utente;

import java.io.IOException;

/**
 * Interfaccia per i servizi di autenticazione degli utenti.
 */
public interface AutenticazioneService {

    /**
     * Esegue il login di un utente verificandone le credenziali.
     *
     * @param email    L'email dell'utente.
     * @param password La password dell'utente.
     * @return L'oggetto Utente se le credenziali sono corrette, null altrimenti.
     */
    Utente login(String email, String password);

    /**
     * Recupera un utente tramite la sua email.
     *
     * @param email L'email dell'utente da recuperare.
     * @return L'oggetto Utente corrispondente.
     */
    Utente getUtente(String email);

    /**
     * Recupera l'immagine del profilo dell'utente convertendola in formato Base64.
     *
     * @param pathImmagine Il percorso del file immagine o l'URL dell'immagine (se
     *                     esterna).
     * @return Una stringa contenente l'immagine in formato Base64 (data URI scheme)
     *         o il path originale se non è un file locale gestito.
     * @throws IOException Se si verificano errori durante la lettura del file.
     */
    public String recuperaImmagine(String pathImmagine) throws IOException;
}
