package it.lumen.business.richiestaServizio.service;

import it.lumen.data.entity.RaccoltaFondi;
import it.lumen.data.entity.RichiestaServizio;
import it.lumen.data.entity.Utente;
import java.util.List;


public interface RichiestaServizioService {
    public void creaRichiestaServizio(RichiestaServizio richiestaServizio);
    public void accettaRichiestaServizio(RichiestaServizio richiestaServizio);
    public void rifiutaRichiestaServizio(RichiestaServizio richiestaServizio);

}