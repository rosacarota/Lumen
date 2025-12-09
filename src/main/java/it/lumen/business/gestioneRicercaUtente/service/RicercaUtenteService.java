package it.lumen.business.gestioneRicercaUtente.service;

import it.lumen.data.dto.UtenteDTO;

import java.util.List;

/**
 * Interfaccia per il servizio di ricerca utenti.
 * Fornisce metodi per ricercare utenti in base al nome o all'indirizzo email.
 */
public interface RicercaUtenteService {

    /**
     * Cerca una lista di utenti che corrispondono (anche parzialmente) al nome
     * fornito.
     *
     * @param nome Il nome (o parte di esso) da ricercare.
     * @return Una lista di oggetti {@link UtenteDTO} che corrispondono ai criteri
     *         di ricerca.
     */
    List<UtenteDTO> getUtentiPerNome(String nome);

    /**
     * Recupera le informazioni dettagliate di un singolo utente tramite la sua
     * email.
     *
     * @param email L'indirizzo email univoco dell'utente da cercare.
     * @return Un oggetto {@link UtenteDTO} contenente i dati dell'utente trovato, o
     *         null se non trovato.
     */
    UtenteDTO getUtenteByEmail(String email);

}
