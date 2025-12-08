package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Ente.
 * Estende UtenteDAO.
 */
public interface EnteDAO extends UtenteDAO {

    /**
     * Trova un ente tramite la sua email.
     *
     * @param email L'email dell'ente.
     * @return L'utente ente trovato.
     */
    @Query("SELECT u FROM Utente u WHERE u.email = ?1 AND u.ruolo = 'Ente'")
    Utente findByEmail(String email);

    /**
     * Trova tutti gli enti il cui nome contiene la stringa specificata
     * (case-insensitive).
     *
     * @param nome La stringa da cercare nel nome dell'ente.
     * @return Una lista di utenti ente che corrispondono ai criteri.
     */
    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.ruolo = 'Ente'")
    List<Utente> findAllByNome(String nome);
}
