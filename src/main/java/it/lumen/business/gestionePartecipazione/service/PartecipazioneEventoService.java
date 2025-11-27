package it.lumen.business.gestionePartecipazione.service;


import it.lumen.data.entity.Partecipazione;
import java.util.List;

public interface PartecipazioneEventoService{

	public void aggiungiPartecipazione(Partecipazione partecipazione);
	public void modificaPartecipazione(Partecipazione partecipazione);
	public void eliminaPartecipazione(Integer idPartecipazione);
	public List<Partecipazione> listaPartecipazioni(Integer idEvento);
}
