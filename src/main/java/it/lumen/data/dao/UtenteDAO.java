package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UtenteDAO extends JpaRepository<Utente,String>{

    Utente findByEmail(String email);

    @Query("SELECT u FROM Utente u WHERE u.nome ILIKE %?1%")
    List<Utente> findUtentiByNome(String nome);

    boolean existsByEmail(String email);
}
