package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Volontario.
 * Estende UtenteDAO.
 */
public interface VolontarioDAO extends UtenteDAO {

    /**
     * Trova un volontario tramite la sua email.
     *
     * @param email L'email del volontario.
     * @return L'utente volontario trovato.
     */
    @Query("SELECT u FROM Utente u WHERE u.email = ?1 AND u.ruolo = 'Volontario'")
    Utente findByEmail(String email);

    /**
     * Trova tutti i volontari il cui nome contiene la stringa specificata
     * (case-insensitive).
     *
     * @param nome La stringa da cercare nel nome.
     * @return Una lista di utenti volontari.
     */
    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.ruolo = 'Volontario'")
    List<Utente> findAllByNome(String nome);

    /**
     * Trova tutti i volontari il cui cognome contiene la stringa specificata
     * (case-insensitive).
     *
     * @param cognome La stringa da cercare nel cognome.
     * @return Una lista di utenti volontari.
     */
    @Query("SELECT u FROM Utente u WHERE u.cognome ILIKE %?1% AND u.ruolo = 'Volontario'")
    List<Utente> findAllByCognome(String cognome);

    /**
     * Trova tutti i volontari che corrispondono sia al nome che al cognome
     * specificati (case-insensitive).
     *
     * @param nome    La stringa da cercare nel nome.
     * @param cognome La stringa da cercare nel cognome.
     * @return Una lista di utenti volontari.
     */
    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.cognome ILIKE %?2% AND u.ruolo = 'Volontario'")
    List<Utente> findAllByNome(String nome, String cognome);
}
