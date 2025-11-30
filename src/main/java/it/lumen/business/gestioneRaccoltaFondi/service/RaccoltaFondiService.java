package it.lumen.business.gestioneRaccoltaFondi.service;

import it.lumen.data.entity.RaccoltaFondi;
import it.lumen.data.entity.Utente;
import java.util.List;

public interface RaccoltaFondiService {

    public void avviaRaccoltaFondi(RaccoltaFondi raccoltaFondi);
    public void terminaRaccoltaFondi(int idRaccoltaFondi);
    public List <RaccoltaFondi> ottieniRaccolteDiEnte(Utente utente);

}
