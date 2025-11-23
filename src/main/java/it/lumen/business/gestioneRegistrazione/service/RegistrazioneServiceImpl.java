package it.lumen.business.gestioneRegistrazione.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import it.lumen.security.Encrypter;
import org.springframework.stereotype.Service;


@Service
public class RegistrazioneServiceImpl implements RegistrazioneService {

    private UtenteDAO utenteDAO;

    @Override
    public void RegistraUtente(Utente utente) {

        Encrypter encrypter = new Encrypter();
        String passwordCriptata = encrypter.encrypt(utente.getPassword());

        utente.setPassword(passwordCriptata);
        utenteDAO.save(utente);
    }

}
