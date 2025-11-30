package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.dao.AffiliazioneDAO;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AffiliazioneServiceImpl implements AffiliazioneService {

    private AffiliazioneDAO affiliazioneDAO;
    private UtenteDAO utenteDAO;

    @Autowired
    public AffiliazioneServiceImpl(AffiliazioneDAO affiliazioneDAO, UtenteDAO utenteDAO) {
        this.affiliazioneDAO = affiliazioneDAO;
        this.utenteDAO = utenteDAO;
    }

    @Override
    public void richiediAffiliazione(Affiliazione affiliazione) {
        affiliazioneDAO.save(affiliazione);
    }

    @Override
    public Affiliazione getAffiliazione(int id) {
        return affiliazioneDAO.findByIdAffiliazione(id);
    }


    @Override
    public List<Utente> getAffiliati(String email) {
       Utente ente = utenteDAO.findByEmail(email);
       return affiliazioneDAO.findVolontariAffiliati(ente);
    }

    @Override
    public List<Affiliazione> getAffiliazioni(Utente ente) {
        return affiliazioneDAO.findAffiliatibyEnte(ente);
    }

    @Override
    public void accettaAffiliazione(int id) {
        Affiliazione affiliazione = affiliazioneDAO.findByIdAffiliazione(id);
        affiliazione.setStato(Affiliazione.StatoAffiliazione.Accettata);
        affiliazioneDAO.save(affiliazione);
    }

    @Override
    public void rifiutaAffiliazione(int id) {
        affiliazioneDAO.removeByIdAffiliazione(id);
    }

    @Override
    public List<Affiliazione> getRichiesteInAttesa(Utente ente) {
        return affiliazioneDAO.findAffiliazioneByStato_InAttesa(ente);
    }

    @Override
    public boolean checkAffiliazione(String ente, String volontario) {
        return affiliazioneDAO.existsByEnte_EmailAndVolontario_Email(ente, volontario);
    }

}
