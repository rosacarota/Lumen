package it.lumen.business.gestioneRicercaUtente.service;

import it.lumen.data.entity.Utente;

import java.util.List;

public interface RicercaUtenteService {

    List<Utente> getUtentiPerNome(String nome);

}
