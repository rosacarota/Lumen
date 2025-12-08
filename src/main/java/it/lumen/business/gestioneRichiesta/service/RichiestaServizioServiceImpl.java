package it.lumen.business.gestioneRichiesta.service;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dao.RichiestaServizioDAO;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.time.LocalDate;
import java.sql.Date;
import java.util.List;

@Service
public class RichiestaServizioServiceImpl implements RichiestaServizioService {

    private final RichiestaServizioDAO richiestaServizioDAO;
    private final AutenticazioneService autenticazioneService;
    private final UtenteDAO utenteDAO;

    @Autowired
    public RichiestaServizioServiceImpl(RichiestaServizioDAO richiestaServizioDAO, AutenticazioneService autenticazioneService, UtenteDAO utenteDAO) {
        this.richiestaServizioDAO = richiestaServizioDAO;
        this.autenticazioneService = autenticazioneService;
        this.utenteDAO = utenteDAO;
    }

    @Override
    @Transactional
    public void creaRichiestaServizio(RichiestaServizioDTO  richiestaServizioDTO) {
        Utente volontario = autenticazioneService.getUtente(richiestaServizioDTO.getEnteVolontario());
        Utente beneficiario = autenticazioneService.getUtente(richiestaServizioDTO.getBeneficiario());
        if(volontario == null || beneficiario == null) {
            throw new IllegalArgumentException("Utenti non trovati");
        }
        RichiestaServizio richiesta = new RichiestaServizio();
        richiesta.setTesto(richiestaServizioDTO.getTesto());
        richiesta.setDataRichiesta(Date.valueOf(LocalDate.now()));
        richiesta.setBeneficiario(beneficiario);
        richiesta.setEnteVolontario(volontario);
        richiesta.setStato(RichiestaServizio.StatoRichiestaServizio.InAttesa);
        richiestaServizioDAO.save(richiesta);
    }

    @Override
    @Transactional
    public void accettaRichiestaServizio(@Valid RichiestaServizio richiestaServizio) {
        richiestaServizio.setStato(RichiestaServizio.StatoRichiestaServizio.valueOf("Accettata"));
        richiestaServizioDAO.save(richiestaServizio);}   //Cambio stato: InAttesa -> Accettato

    @Override
    @Transactional
    //----------------------------------------------------------TO ARGUE----------------------------------------------------------
    public void rifiutaRichiestaServizio(@Valid RichiestaServizio richiestaServizio) {richiestaServizioDAO.delete(richiestaServizio);} //Rimozione della richiesta dal database

    public List<RichiestaServizio> getRichiesteByEmail(@Email(message = "Email non valida") String email) {

        return richiestaServizioDAO.findAllByEnteVolontario_Email(email);
    }

    public List<RichiestaServizio>getRichiesteInAttesaByEmail(@Email(message = "Email non valida") String email) {

        //Utente utente = utenteDAO.findByEmail(email);
        List<RichiestaServizio> richiesta = richiestaServizioDAO.findAllByEmailInAttesa(email);
        return richiesta;
    }
}
