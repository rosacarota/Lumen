package it.lumen.business.gestioneEvento.service;

import it.lumen.data.entity.Evento;

import java.util.List;


public interface EventoService {

    public void aggiungiEvento(Evento evento);
    public void modificaEvento(Evento evento);
    public void eliminaEvento(Integer idEvento);
    public List<Evento> cronologiaEventi(String email);
}

