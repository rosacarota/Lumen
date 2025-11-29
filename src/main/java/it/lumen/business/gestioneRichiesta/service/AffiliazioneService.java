package it.lumen.business.gestioneRichiesta.service;

import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;

import java.util.List;

public interface AffiliazioneService {

    public void richiediAffiliazione(Affiliazione affiliazione);

    public Affiliazione getAffiliazione(int id);

    public List<Utente> getAffiliazioni(String email);

    public void accettaAffiliazione(int id);

    public void rifiutaAffiliazione(int id);

    public List<Affiliazione> getRichiesteInAttesa(Utente ente);

    public boolean checkAffiliazione(String ente, String volontario);
}
