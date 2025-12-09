package it.lumen.business.gestioneEvento.service;

import it.lumen.data.entity.Evento;

import java.io.IOException;
import java.util.List;

/**
 * Interfaccia per i servizi relativi alla gestione degli Eventi
 */
public interface GestioneEventoService {

    /**
     * Pubblicazione di un Evento nella pagina della bacheca degli Eventi di un Ente
     * @param evento l'oggetto Evento da pubblicare
     * @return L'oggetto Evento se la pubblicazione va a buon fine, null altrimenti
     */
    public Evento aggiungiEvento(Evento evento);

    /**
     * Modifica di un evento pubblicato da un Ente
     * @param evento L'oggetto Evento con i dati aggiornati
     * @return L'oggetto Evento se la modifica va a buon fine, null altrimenti
     */
    public Evento modificaEvento(Evento evento);

    /**
     * Eliminazione di un Evento pubblicato da un Ente
     * @param idEvento L'identificativo dell'evento da eliminare
     */
    public void eliminaEvento(int idEvento);

    /**
     * Controllo dell'esistenza di un Evento
     * @param idEvento L'identificativo dell'evento
     * @return true se l'Evento esiste, false altrimenti
     */
    public boolean checkId(int idEvento);

    /**
     * Recupera tutti gli Eventi di un Ente tramite la sua email.
     * Impostando "stato" uguale a "terminati" vengono recuperati tutti gli Eventi associati all'email dell'Ente per cui la relativa data di fine precede la data odierna
     * Impostando "stato" uguale ad "attivi" vengono recuperati tutti gli Eventi associati all'email dell'Ente per cui la data odierna è compresa fra la data di inizio e di fine dell'Evento
     * Impostando "stato" uguale a "futuri" vengono recuperati tutti gli Eventi associati all'email dell'Ente per cui la relativa data di inizio è successiva rispetto alla data odierna
     * @param email Email dell'Ente
     * @param stato Stato che filtra il recupero degli Eventi dell'Ente
     * @return La lista di tutti gli Eventi dell'Ente corrispondente, o alternativamente solo gli eventi terminati, attivi o futuri dell'Ente
     */
    public List<Evento> cronologiaEventi(String email, String stato);

    /**
     * Recupera un Evento tramite il suo identificativo
     * @param idEvento Identificativo dell'evento
     * @return L'oggetto Evento se esiste, null altrimenti
     */
    public Evento getEventoById(int idEvento);

    /**
     * Recupera tutti gli Eventi esistenti
     * @return La lista di tutti gli Eventi pubblicati da tutti gli Enti
     */
    public List<Evento> tuttiGliEventi();

    /**
     * Recupera l'immagine dell'Evento dell'Ente convertendola in formato Base64.
     *
     * @param pathImmagine Il percorso del file immagine o l'URL dell'immagine (se
     *                     esterna).
     * @return Una stringa contenente l'immagine in formato Base64 (data URI scheme)
     *         o il path originale se non è un file locale gestito.
     * @throws IOException Se si verificano errori durante la lettura del file.
     */
    public String recuperaImmagine(String pathImmagine) throws IOException;

}

