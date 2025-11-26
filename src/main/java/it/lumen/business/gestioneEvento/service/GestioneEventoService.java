package it.lumen.business.gestioneEvento.service;

import it.lumen.data.entity.Evento;

import java.util.List;


public interface GestioneEventoService {

    public Evento aggiungiEvento(Evento evento);
    public Evento modificaEvento(Evento evento);
    public void eliminaEvento(int idEvento);
    public boolean checkId(int idEvento);
    public List<Evento> cronologiaEventi(String email, String stato);
    public Evento getEventoById(int idEvento);
}

