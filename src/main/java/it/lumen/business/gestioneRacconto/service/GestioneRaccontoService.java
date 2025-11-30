package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;

import java.util.List;

public interface GestioneRaccontoService {

public Racconto aggiungiRacconto(Racconto racconto);
public Racconto modificaRacconto(Racconto nuovoRacconto);
public void eliminaRacconto(Integer idRacconto);
public Racconto getByIdRacconto(int idRacconto);
public boolean checkId(int idRacconto);
public List<Racconto> listaRaccontiUtente(String email);
public Racconto getByIdRaccontoRaw(int idRacconto);
}
