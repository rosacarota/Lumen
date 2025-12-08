package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.dto.RichiestaServizioDTO;
import it.lumen.data.entity.RichiestaServizio;

import java.util.List;


public interface RichiestaServizioService {


    void creaRichiestaServizio(RichiestaServizioDTO richiestaDTO);
    public void accettaRichiestaServizio(RichiestaServizio richiestaServizio);
    public void rifiutaRichiestaServizio(RichiestaServizio richiestaServizio);
    public List<RichiestaServizio> getRichiesteByEmail(String email);
    public List<RichiestaServizio>getRichiesteInAttesaByEmail(String email);
}