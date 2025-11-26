package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtenteDAO extends JpaRepository<Utente,String>{

    Utente findByEmail(String email);

    boolean existsByEmail(String email);
}
