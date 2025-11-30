package it.lumen.business.gestioneAccount.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class GestioneAccountServiceImpl implements GestioneAccountService {

    private final UtenteDAO utenteDAO;

    @Autowired
    public GestioneAccountServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }


    @Override
    public void modificaUtente(Utente utente) {
        utenteDAO.save(utente);
    }
}
