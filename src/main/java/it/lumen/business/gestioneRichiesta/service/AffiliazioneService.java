package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;

import java.util.List;

/**
 * Interfaccia che definisce i servizi per la gestione delle affiliazioni.
 */
public interface AffiliazioneService {

    /**
     * Invia una richiesta di affiliazione.
     *
     * @param affiliazione L'oggetto Affiliazione contenente i dettagli della
     *                     richiesta.
     */
    public void richiediAffiliazione(Affiliazione affiliazione);

    /**
     * Recupera un'affiliazione in base al suo ID.
     *
     * @param id L'identificativo dell'affiliazione.
     * @return L'oggetto Affiliazione trovato.
     */
    public Affiliazione getAffiliazione(int id);

    /**
     * Restituisce la lista dei volontari affiliati a un ente (identificato tramite
     * email).
     *
     * @param email L'email dell'ente.
     * @return Una lista di Utenti (volontari) affiliati.
     */
    public List<Utente> getAffiliati(String email);

    /**
     * Restituisce la lista di tutte le affiliazioni (accettate) relative a un ente.
     *
     * @param ente L'oggetto Utente (ente) di cui si vogliono le affiliazioni.
     * @return Una lista di oggetti Affiliazione.
     */
    public List<Affiliazione> getAffiliazioni(Utente ente);

    /**
     * Accetta una richiesta di affiliazione pendente.
     *
     * @param id L'identificativo dell'affiliazione da accettare.
     */
    public void accettaAffiliazione(int id);

    /**
     * Rifiuta (e rimuove) una richiesta di affiliazione.
     *
     * @param id L'identificativo dell'affiliazione da rifiutare.
     */
    public void rifiutaAffiliazione(int id);

    /**
     * Restituisce la lista delle richieste di affiliazione in attesa per un dato
     * ente.
     *
     * @param ente L'oggetto Utente (ente) destinatario delle richieste.
     * @return Una lista di affiliazioni in stato "InAttesa".
     */
    public List<Affiliazione> getRichiesteInAttesa(Utente ente);

    /**
     * Verifica se esiste un'affiliazione per un dato volontario.
     *
     * @param volontario L'email del volontario.
     * @return true se esiste un'affiliazione, false altrimenti.
     */
    public boolean checkAffiliazione(String volontario);

    public UtenteDTO getAffiliante(String email);
}
