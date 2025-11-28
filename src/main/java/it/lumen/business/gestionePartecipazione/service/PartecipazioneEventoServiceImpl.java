package it.lumen.business.gestionePartecipazione.service;

import it.lumen.data.dao.EventoDAO;
import it.lumen.data.entity.Evento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.lumen.data.dao.PartecipazioneDAO;
import it.lumen.data.entity.Partecipazione;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class PartecipazioneEventoServiceImpl implements PartecipazioneEventoService{

	private final PartecipazioneDAO partecipazioneDAO;
    private final EventoDAO eventoDAO;

	@Autowired
	public PartecipazioneEventoServiceImpl(PartecipazioneDAO partecipazioneDAO, EventoDAO eventoDAO) {
        this.eventoDAO = eventoDAO;
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

    @Override
    public Evento getEventoById(Integer idEvento) {
        return eventoDAO.findEventoByIdEvento(idEvento);
    }

    @Override
    public Partecipazione getPartecipazioneById(Integer idPartecipazione) {
       return partecipazioneDAO.getPartecipazioneByIdPartecipazione(idPartecipazione);
    }
}
