package it.lumen.data.dao;

import it.lumen.data.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface EventoDAO extends JpaRepository<Evento, Integer> {

    List<Evento> findAllByUtente_Email(String email);

    void removeEventoByIdEvento(Integer idEvento);

    Evento getEventoByIdEvento(Integer idEvento);
    List<Evento> findAllByUtente_EmailAndDataInizioLessThanEqualAndDataFineGreaterThanEqual(String email, Date oggi1, Date oggi);

    List<Evento> findAllByUtente_EmailAndDataFineBefore(String email, Date oggi);

    Evento findEventoByIdEvento(Integer idEvento);
}
