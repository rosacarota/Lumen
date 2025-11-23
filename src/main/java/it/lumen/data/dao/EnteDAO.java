package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EnteDAO extends UtenteDAO{

    @Query("SELECT u FROM Utente u WHERE u.email = ?1 AND u.ruolo = 'Ente'")
    Utente findByEmail(String email);

    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1% AND u.ruolo = 'Ente'")
    List<Utente> findAllByNome(String nome);
}
