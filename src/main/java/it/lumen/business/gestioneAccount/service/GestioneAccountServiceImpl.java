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
        Utente existingUtente = utenteDAO.findByEmail(utente.getEmail());
        if (existingUtente != null) {
            existingUtente.setNome(utente.getNome());
            existingUtente.setCognome(utente.getCognome());
            existingUtente.setPassword(utente.getPassword());
            existingUtente.setDescrizione(utente.getDescrizione());
            existingUtente.setRecapitoTelefonico(utente.getRecapitoTelefonico());
            existingUtente.setRuolo(utente.getRuolo());
            existingUtente.setAmbito(utente.getAmbito());
            existingUtente.setImmagine(utente.getImmagine());

            if (existingUtente.getIndirizzo() != null && utente.getIndirizzo() != null) {
                existingUtente.getIndirizzo().setCitta(utente.getIndirizzo().getCitta());
                existingUtente.getIndirizzo().setProvincia(utente.getIndirizzo().getProvincia());
                existingUtente.getIndirizzo().setCap(utente.getIndirizzo().getCap());
                existingUtente.getIndirizzo().setStrada(utente.getIndirizzo().getStrada());
                existingUtente.getIndirizzo().setNCivico(utente.getIndirizzo().getNCivico());
            } else if (utente.getIndirizzo() != null) {
                existingUtente.setIndirizzo(utente.getIndirizzo());
            }

            utenteDAO.save(existingUtente);
        } else {
            utenteDAO.save(utente);
        }
    }
}
