package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.entity.Racconto;

public interface GestioneRaccontoService {

public Racconto aggiungiRacconto(Racconto racconto);
public Racconto modificaRacconto(Racconto nuovoRacconto);
public void eliminaRacconto(Integer idRacconto);
}
