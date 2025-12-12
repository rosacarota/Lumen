package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.dao.AffiliazioneDAO;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

/**
 * Implementazione del servizio di gestione delle affiliazioni.
 */
@Service
public class AffiliazioneServiceImpl implements AffiliazioneService {

    private AffiliazioneDAO affiliazioneDAO;
    private UtenteDAO utenteDAO;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param affiliazioneDAO DAO per l'accesso ai dati delle affiliazioni.
     * @param utenteDAO       DAO per l'accesso ai dati degli utenti.
     */
    @Autowired
    public AffiliazioneServiceImpl(AffiliazioneDAO affiliazioneDAO, UtenteDAO utenteDAO) {
        this.affiliazioneDAO = affiliazioneDAO;
        this.utenteDAO = utenteDAO;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void richiediAffiliazione(@Valid Affiliazione affiliazione) {
        affiliazioneDAO.save(affiliazione);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Affiliazione getAffiliazione(int id) {
        return affiliazioneDAO.findByIdAffiliazione(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Utente> getAffiliati(@Email(message = "Email non valida") String email) {
        Utente ente = utenteDAO.findByEmail(email);
        return affiliazioneDAO.findVolontariAffiliati(ente);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Affiliazione> getAffiliazioni(@Valid Utente ente) {
        return affiliazioneDAO.findAffiliatibyEnte(ente);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void accettaAffiliazione(int id) {
        Affiliazione affiliazione = affiliazioneDAO.findByIdAffiliazione(id);
        affiliazione.setStato(Affiliazione.StatoAffiliazione.Accettata);
        affiliazioneDAO.save(affiliazione);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void rifiutaAffiliazione(int id) {
        affiliazioneDAO.removeByIdAffiliazione(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Affiliazione> getRichiesteInAttesa(Utente ente) {
        return affiliazioneDAO.findAffiliazioneByStato_InAttesa(ente);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean checkAffiliazione(@Email(message = "Email non valida") String volontario) {
        return affiliazioneDAO.existsByVolontario_Email(volontario);
    }

    public UtenteDTO getAffiliante(String email){
        List<Affiliazione> affiliazione = affiliazioneDAO.findByVolontario(utenteDAO.findByEmail(email));
        UtenteDTO utenteDTO = new UtenteDTO();
        utenteDTO.setEmail(email);
        utenteDTO.setNome(affiliazione.get(0).getEnte().getNome());
        return utenteDTO;
    }
}
