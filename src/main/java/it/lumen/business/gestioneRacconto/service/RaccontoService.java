package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.entity.Racconto;

public interface RaccontoService {

public void aggiungiRacconto(Racconto racconto);
public void modificaRacconto(Racconto nuovoRacconto);
public void eliminaRacconto(Integer idRacconto);
}
