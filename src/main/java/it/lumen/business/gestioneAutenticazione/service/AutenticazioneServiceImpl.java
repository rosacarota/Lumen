package it.lumen.business.gestioneAutenticazione.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.lumen.security.Encrypter;

@Service
public class AutenticazioneServiceImpl implements AutenticazioneService {

    private final UtenteDAO utenteDAO;

    @Autowired
    public AutenticazioneServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    @Override
    public Utente login(String email, String password) {
        Encrypter encrypter = new Encrypter();
        Utente utente = utenteDAO.findByEmail(email);
        if (utente == null) return null;

        if (encrypter.checkPassword(password, utente.getPassword())) {
            return utente;
        }
        return null;
    }

}
