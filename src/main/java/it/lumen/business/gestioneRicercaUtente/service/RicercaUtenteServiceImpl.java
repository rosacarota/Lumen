package it.lumen.business.gestioneRicercaUtente.service;
//import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;

import java.util.List;

@Service
public class RicercaUtenteServiceImpl implements RicercaUtenteService {

    private final UtenteDAO utenteDAO;

    @Autowired
    public RicercaUtenteServiceImpl(UtenteDAO utenteDAO) {this.utenteDAO = utenteDAO;}

    @Override
    public List<Utente> getUtentiPerNome(String nome) {
        List <Utente> listaUtenti;

        if(nome == null){return null;}
        listaUtenti = utenteDAO.findUtentiByNome(nome);
        return listaUtenti;
    }
}
