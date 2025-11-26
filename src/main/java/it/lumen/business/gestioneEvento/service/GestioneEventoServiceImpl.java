package it.lumen.business.gestioneEvento.service;

import it.lumen.data.dao.EventoDAO;
import it.lumen.data.entity.Evento;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import java.util.List;
@Service
public class GestioneEventoServiceImpl implements GestioneEventoService {


    private final EventoDAO eventoDAO;

    @Autowired
    public GestioneEventoServiceImpl(EventoDAO eventoDAO) {
        this.eventoDAO = eventoDAO;
    }

    @Override
    @Transactional
    public Evento aggiungiEvento(Evento evento) {

        return eventoDAO.save(evento);
    }

    @Override
    @Transactional
    public Evento modificaEvento(Evento evento) {
        return eventoDAO.save(evento);
    }

    @Override
    @Transactional
    public void eliminaEvento(Integer idEvento) {
        eventoDAO.removeEventoByIdEvento(idEvento);
    }

    @Override
    public boolean checkId(int idEvento) {

        return eventoDAO.existsById(idEvento);

    }


    public List<Evento> cronologiaEventi(String email, String stato) {
        Date oggi = new Date();


        if (stato == null)
            stato = "";

        switch (stato.toLowerCase()) {
            case "attivi":

                return eventoDAO.findAllByUtente_EmailAndDataInizioLessThanEqualAndDataFineGreaterThanEqual(email, oggi, oggi);

            case "terminati":

                return eventoDAO.findAllByUtente_EmailAndDataFineBefore(email, oggi);

            default:

                return eventoDAO.findAllByUtente_Email(email);
        }
    }
}
