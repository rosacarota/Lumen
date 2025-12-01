package it.lumen.business.gestioneRichiesta.service;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dao.RichiestaServizioDAO;
import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RichiestaServizioServiceImpl implements RichiestaServizioService {

    private final RichiestaServizioDAO richiestaServizioDAO;
    private final AutenticazioneService autenticazioneService;

    @Autowired
    public RichiestaServizioServiceImpl(RichiestaServizioDAO richiestaServizioDAO, AutenticazioneService autenticazioneService) {
        this.richiestaServizioDAO = richiestaServizioDAO;
        this.autenticazioneService = autenticazioneService;
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
        richiesta.setDataRichiesta(richiestaServizioDTO.getDataRichiesta());
        richiesta.setBeneficiario(beneficiario);
        richiesta.setEnteVolontario(volontario);
        richiesta.setStato(RichiestaServizio.StatoRichiestaServizio.InAttesa);
        richiestaServizioDAO.save(richiesta);
    }

    @Override
    @Transactional
    public void accettaRichiestaServizio(RichiestaServizio richiestaServizio) {richiestaServizioDAO.save(richiestaServizio);}   //Cambio stato: InAttesa -> Accettato

    @Override
    @Transactional
    //----------------------------------------------------------TO ARGUE----------------------------------------------------------
    public void rifiutaRichiestaServizio(RichiestaServizio richiestaServizio) {richiestaServizioDAO.delete(richiestaServizio);} //Rimozione della richiesta dal database
}
