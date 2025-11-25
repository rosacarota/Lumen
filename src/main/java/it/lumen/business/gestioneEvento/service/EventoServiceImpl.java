package it.lumen.business.gestioneEvento.service;

import it.lumen.data.dao.EventoDAO;
import it.lumen.data.entity.Evento;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;

@Service
public class EventoServiceImpl implements EventoService{


    private final EventoDAO eventoDAO;

    @Autowired
    public EventoServiceImpl(EventoDAO eventoDAO) {
        this.eventoDAO = eventoDAO;
    }

    @Override
    @Transactional
    public Evento aggiungiEvento(Evento evento){

       return eventoDAO.save(evento);
    }

    @Override
    @Transactional
    public Evento modificaEvento(Evento evento){
        return eventoDAO.save(evento);
    }

    @Override
    @Transactional
    public void eliminaEvento(Integer idEvento){
        eventoDAO.removeEventoByIdEvento(idEvento);
    }
    @Override
    public boolean checkId(int idEvento) {

        return eventoDAO.existsById(idEvento);

    }


    @Override
    public List <Evento> cronologiaEventi(String email){
        return eventoDAO.findAllByUtente_Email(email);
    }

}
