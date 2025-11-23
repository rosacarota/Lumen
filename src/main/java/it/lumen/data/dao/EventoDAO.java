package it.lumen.data.dao;

import it.lumen.data.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventoDAO extends JpaRepository<Evento, Integer> {

    List<Evento> findAllByUtente_Email(String email);

    void removeEventoByIdEvento(Integer idEvento);

}
