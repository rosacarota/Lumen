package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.dao.RichiestaServizioDAO;
import it.lumen.data.entity.RichiestaServizio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RichiestaServizioServiceImpl implements RichiestaServizioService {

    private final RichiestaServizioDAO richiestaServizioDAO;

    @Autowired
    public RichiestaServizioServiceImpl(RichiestaServizioDAO richiestaServizioDAO) {this.richiestaServizioDAO = richiestaServizioDAO;}

    @Override
    @Transactional
    public void creaRichiestaServizio(RichiestaServizio  richiestaServizio) {richiestaServizioDAO.save(richiestaServizio);}

    @Override
    @Transactional
    public void accettaRichiestaServizio(RichiestaServizio richiestaServizio) {richiestaServizioDAO.save(richiestaServizio);}   //Cambio stato: InAttesa -> Accettato

    @Override
    @Transactional
    //----------------------------------------------------------TO ARGUE----------------------------------------------------------
    public void rifiutaRichiestaServizio(RichiestaServizio richiestaServizio) {richiestaServizioDAO.delete(richiestaServizio);} //Rimozione della richiesta dal database
}
