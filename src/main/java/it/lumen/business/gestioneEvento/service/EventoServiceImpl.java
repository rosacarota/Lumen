package it.lumen.business.gestioneEvento.service;

import it.lumen.data.dao.EventoDAO;
import it.lumen.data.entity.Evento;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class EventoServiceImpl implements EventoService{


    private EventoDAO eventoDAO;


    @Override
    public void aggiungiEvento(Evento evento){

        eventoDAO.save(evento);
    }

    @Override
    public void modificaEvento(Evento evento){
        eventoDAO.save(evento);
    }

    @Override
    public void eliminaEvento(Integer idEvento){
        eventoDAO.removeEventoByIdEvento(idEvento);
    }
    @Override
    public List <Evento> cronologiaEventi(String email){
        return eventoDAO.findAllByUtente_Email(email);
    }

}
