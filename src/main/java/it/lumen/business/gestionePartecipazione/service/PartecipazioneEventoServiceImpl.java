package it.lumen.business.gestionePartecipazione.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.lumen.data.dao.PartecipazioneDAO;
import it.lumen.data.entity.Partecipazione;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class PartecipazioneEventoServiceImpl implements PartecipazioneEventoService{

	private final PartecipazioneDAO partecipazioneDAO;

	@Autowired
	public PartecipazioneEventoServiceImpl(PartecipazioneDAO partecipazioneDAO){

		this.partecipazioneDAO = partecipazioneDAO;
	}
	@Override
	@Transactional
	public void aggiungiPartecipazione(Partecipazione partecipazione) {

		partecipazioneDAO.save(partecipazione);

	}
	@Override
	@Transactional
	public void modificaPartecipazione(Partecipazione partecipazione) {
		partecipazioneDAO.save(partecipazione);
		
	}
	@Override
	@Transactional
	public void eliminaPartecipazione(Integer idPartecipazione) {
		
		partecipazioneDAO.removePartecipazioneByIdPartecipazione(idPartecipazione);
	}

	@Override
	@Transactional
	public List<Partecipazione> listaPartecipazioni(Integer idEvento){

		return partecipazioneDAO.findAllByEvento_IdEvento(idEvento);
	}
}
