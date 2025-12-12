package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;

import java.util.List;

/**
 * Interfaccia per la gestione delle operazioni relative alle richieste di
 * servizio.
 * Definisce i metodi per creare, accettare, rifiutare e recuperare le richieste
 * di servizio.
 */
public interface RichiestaServizioService {

    /**
     * Crea una nuova richiesta di servizio basata sui dati forniti nel DTO.
     *
     * @param richiestaDTO Il Data Transfer Object contenente le informazioni della
     *                     richiesta di servizio da creare.
     */
    void creaRichiestaServizio(RichiestaServizioDTO richiestaDTO);

    /**
     * Accetta una richiesta di servizio esistente.
     * Aggiorna lo stato della richiesta per indicare l'accettazione.
     *
     * @param richiestaServizio L'entità della richiesta di servizio da accettare.
     */
    public void accettaRichiestaServizio(RichiestaServizio richiestaServizio);

    /**
     * Rifiuta una richiesta di servizio esistente.
     * Aggiorna lo stato della richiesta per indicare il rifiuto.
     *
     * @param richiestaServizio L'entità della richiesta di servizio da rifiutare.
     */
    public void rifiutaRichiestaServizio(RichiestaServizio richiestaServizio);

    /**
     * Recupera la lista di tutte le richieste di servizio associate a una specifica
     * email.
     *
     * @param email L'indirizzo email dell'utente o ente per cui recuperare le
     *              richieste.
     * @return Una lista di oggetti {@link RichiestaServizio} associate all'email
     *         fornita.
     */
    public List<RichiestaServizio> getRichiesteByEmail(String email);

    /**
     * Recupera la lista delle richieste di servizio in attesa associate a una
     * specifica email.
     * Generalmente utilizzato per visualizzare le richieste che necessitano ancora
     * di una risposta o azione.
     *
     * @param email L'indirizzo email dell'utente o ente per cui recuperare le
     *              richieste in attesa.
     * @return Una lista di oggetti {@link RichiestaServizio} in attesa associate
     *         all'email fornita.
     */
    public List<RichiestaServizio> getRichiesteInAttesaByEmail(String email);
}