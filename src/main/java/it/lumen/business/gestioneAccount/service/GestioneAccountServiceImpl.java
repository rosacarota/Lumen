package it.lumen.business.gestioneAccount.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;

/**
 * Implementazione del servizio di gestione account.
 * Fornisce le funzionalità per modificare i dati degli utenti.
 */
@Service
public class GestioneAccountServiceImpl implements GestioneAccountService {

    private final UtenteDAO utenteDAO;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param utenteDAO Il DAO per l'accesso ai dati degli utenti.
     */
    @Autowired
    public GestioneAccountServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void modificaUtente(@Valid Utente utente) {
        utenteDAO.save(utente);
    }
}
