package it.lumen.business.gestionePartecipazione.service;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dao.EventoDAO;
import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.dto.PartecipazioneDTO;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Utente;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.lumen.data.dao.PartecipazioneDAO;
import it.lumen.data.entity.Partecipazione;
import jakarta.transaction.Transactional;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Implementazione del servizio sulla gestione delle partecipazioni agli eventi.
 */
@Service
public class PartecipazioneEventoServiceImpl implements PartecipazioneEventoService{

	private final PartecipazioneDAO partecipazioneDAO;
    private final EventoDAO eventoDAO;
    private final UtenteDAO utenteDAO;
    private final AutenticazioneService autenticazioneService;

    /**
     * Costruttore per la classe {@link PartecipazioneEventoServiceImpl}.
     *
     * @param partecipazioneDAO Oggetto DAO per l'accesso ai dati delle partecipazioni.
     * @param eventoDAO Oggetto DAO per l'accesso ai dati degli eventi.
     * @param utenteDAO Oggetto DAO per l'accesso ai dati degli utenti.
     * @param autenticazioneService Servizio per l'autenticazione.
     */
    @Autowired
	public PartecipazioneEventoServiceImpl(PartecipazioneDAO partecipazioneDAO, EventoDAO eventoDAO, UtenteDAO utenteDAO, AutenticazioneService autenticazioneService) {
        this.eventoDAO = eventoDAO;
		this.partecipazioneDAO = partecipazioneDAO;
        this.utenteDAO = utenteDAO;
        this.autenticazioneService = autenticazioneService;
    }
	/**
     * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void aggiungiPartecipazione(@Valid Partecipazione partecipazione) {

		partecipazioneDAO.save(partecipazione);

	}
	/**
     * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void modificaPartecipazione(@Valid Partecipazione partecipazione) {
		partecipazioneDAO.save(partecipazione);
		
	}
	/**
     * {@inheritDoc}
	 */
	@Override
	@Transactional
	public void eliminaPartecipazione(Integer idPartecipazione) {
		
		partecipazioneDAO.removePartecipazioneByIdPartecipazione(idPartecipazione);
	}

	/**
     * {@inheritDoc}
	 */
	@Override
	@Transactional
	public List<Partecipazione> listaPartecipazioni(Integer idEvento){

		return partecipazioneDAO.findAllByEvento_IdEvento(idEvento);
	}

	/**
     * {@inheritDoc}
	 */
    @Override
    @Transactional
    public List<PartecipazioneDTO> cronologiaPartecipazioni(@Email(message = "Email non valida")String email){

        Utente utente = autenticazioneService.getUtente(email);

        List<Partecipazione> cronologiaENTITY =  partecipazioneDAO.findAllByVolontario(utente);
        List<PartecipazioneDTO> cronologia = cronologiaENTITY.stream()
                .map(partecipazione -> {
                    PartecipazioneDTO partecipazioneDTO = new PartecipazioneDTO();
                    partecipazioneDTO.setIdEvento(partecipazione.getEvento().getIdEvento());
                    partecipazioneDTO.setIdPartecipazione(partecipazione.getIdPartecipazione());
                    partecipazioneDTO.setEmailVolontario(partecipazione.getVolontario().getEmail());
                    partecipazioneDTO.setData(partecipazione.getData());
                    partecipazioneDTO.setNomeEvento(partecipazione.getEvento().getTitolo());
                    return partecipazioneDTO;
                }).collect(Collectors.toList());
        return cronologia;
    }

	/**
     * {@inheritDoc}
	 */
    @Override
    public Evento getEventoById(Integer idEvento) {
        return eventoDAO.findEventoByIdEvento(idEvento);
    }

	/**
     * {@inheritDoc}
	 */
    @Override
    public Partecipazione getPartecipazioneById(Integer idPartecipazione) {
       return partecipazioneDAO.getPartecipazioneByIdPartecipazione(idPartecipazione);
    }
}
