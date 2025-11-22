package it.lumen.data.dao;

import it.lumen.data.entity.Utente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface UtenteDAO extends JpaRepository<Utente, Integer>{
    List <Utente> findallByUtente_ruolo(Utente.Ruolo ruolo);
}
