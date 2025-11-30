package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.entity.RichiestaServizio;


public interface RichiestaServizioService {
    public void creaRichiestaServizio(RichiestaServizio richiestaServizio);
    public void accettaRichiestaServizio(RichiestaServizio richiestaServizio);
    public void rifiutaRichiestaServizio(RichiestaServizio richiestaServizio);

}