package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;

import java.util.List;

/**
 * Interfaccia per i servizi relativi alla gestione dei racconti.
 */
public interface GestioneRaccontoService {

    /**
     * Pubblicazione di un Racconto nella pagina della bacheca delle storie di un Utente.
     *
     * @param racconto l'oggetto Racconto da pubblicare.
     * @return L'oggetto Racconto se la pubblicazione va a buon fine, null altrimenti.
     */
    Racconto aggiungiRacconto(Racconto racconto);

    /**
     * Modifica di un Racconto pubblicato da un Utente.
     *
     * @param nuovoRacconto L'oggetto Racconto con i dati aggiornati.
     * @return L'oggetto Racconto con i dati correttamenti aggiornati.
     */
    Racconto modificaRacconto(Racconto nuovoRacconto);

    /**
     * Eliminazione di un Racconto pubblicato da un Utente.
     *
     * @param idRacconto L'identificativo del Racconto da eliminare.
     */
    void eliminaRacconto(Integer idRacconto);

    /**
     * Controllo dell'esistenza di un Racconto.
     *
     * @param idRacconto L'identificativo del Racconto.
     * @return true se il Racconto esiste, false altrimenti.
     */
    boolean checkId(int idRacconto);

    /**
     * Recupera tutti i Racconti di un Utente tramite la sua email.
     *
     * @param email Email dell'Utente.
     * @return La lista di tutti i Racconti dell'Utente corrispondente.
     */
    List<Racconto> listaRaccontiUtente(String email);

    /**
     * Recupera un Racconto tramite il suo identificativo.
     *
     * @param idRacconto Identificativo del Racconto.
     * @return L'oggetto Racconto se esiste, null altrimenti.
     */
    Racconto getByIdRaccontoRaw(int idRacconto);

    /**
     * Recupera tutti i Racconti esistenti.
     *
     * @return La lista di tutti i Racconti pubblicati da tutti gli Utenti.
     */
    List<Racconto> listaRacconti();
}
