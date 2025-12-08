package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Interfaccia DAO per la gestione dell'entità Utente.
 */
public interface UtenteDAO extends JpaRepository<Utente, String> {

    /**
     * Trova un utente tramite la sua email.
     *
     * @param email L'email dell'utente.
     * @return L'utente trovato.
     */
    Utente findByEmail(String email);

    /**
     * Trova utenti il cui nome contiene la stringa specificata.
     *
     * @param nome La stringa da cercare nel nome.
     * @return Una lista di utenti che corrispondono al criterio.
     */
    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1%")
    List<Utente> findUtentiByNome(String nome);

    /**
     * Verifica se un utente con una data email esiste.
     *
     * @param email L'email da verificare.
     * @return true se l'utente esiste, false altrimenti.
     */
    boolean existsByEmail(String email);
}
