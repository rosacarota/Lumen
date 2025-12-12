package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Beneficiario.
 */
public interface BeneficiarioDAO {

    /**
     * Trova un beneficiario tramite la sua email.
     *
     * @param email L'email del beneficiario.
     * @return L'utente beneficiario trovato.
     */
    @Query("SELECT u FROM Utente u WHERE u.email = ?1 AND u.ruolo = 'Beneficiario'")
    Utente findByEmail(String email);

    /**
     * Trova tutti i beneficiari il cui nome contiene la stringa specificata
     * (case-insensitive).
     *
     * @param nome La stringa da cercare nel nome.
     * @return Una lista di utenti beneficiari che corrispondono ai criteri.
     */
    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.ruolo = 'Beneficiario'")
    List<Utente> findAllByNome(String nome);

    /**
     * Trova tutti i beneficiari il cui cognome contiene la stringa specificata
     * (case-insensitive).
     *
     * @param cognome La stringa da cercare nel cognome.
     * @return Una lista di utenti beneficiari che corrispondono ai criteri.
     */
    @Query("SELECT u FROM Utente u WHERE u.cognome ILIKE %?1% AND u.ruolo = 'Beneficiario'")
    List<Utente> findAllByCognome(String cognome);

    /**
     * Trova tutti i beneficiari il cui nome e cognome contengono le stringhe
     * specificate (case-insensitive).
     *
     * @param nome    La stringa da cercare nel nome.
     * @param cognome La stringa da cercare nel cognome.
     * @return Una lista di utenti beneficiari che corrispondono ai criteri.
     */
    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.cognome ILIKE %?2% AND u.ruolo = 'Beneficiario'")
    List<Utente> findAllByNome(String nome, String cognome);
}
