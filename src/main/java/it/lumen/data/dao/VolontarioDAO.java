package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VolontarioDAO extends UtenteDAO{

    @Query("SELECT u FROM Utente u WHERE u.email = ?1 AND u.ruolo = 'Volontario'")
    Utente findByEmail(String email);

    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.ruolo = 'Volontario'")
    List<Utente> findAllByNome(String nome);

    @Query("SELECT u FROM Utente u WHERE u.cognome ILIKE %?1% AND u.ruolo = 'Volontario'")
    List<Utente> findAllByCognome(String cognome);

    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.cognome ILIKE %?2% AND u.ruolo = 'Volontario'")
    List<Utente> findAllByNome(String nome, String cognome);
}
