package it.lumen.business.raccoltaFondi.service;

import it.lumen.data.entity.RaccoltaFondi;
import it.lumen.data.entity.Utente;
import java.util.List;

public interface RaccoltaFondiService {

    public void avviaRaccoltaFondi(RaccoltaFondi raccoltaFondi);
    public void terminaRaccoltaFondi(RaccoltaFondi raccoltaFondi);
    public List <RaccoltaFondi> ottieniRaccolteDiEnte(Utente utente);

}
