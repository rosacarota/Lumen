package it.lumen.business.gestionePartecipazione.service;


import it.lumen.data.dto.PartecipazioneDTO;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Partecipazione;
import java.util.List;

/**
 * Interfaccia per i servizi relativi alla gestione delle partecipazioni agli eventi.
 */
public interface PartecipazioneEventoService{

	/**
	 * Aggiunta della partecipazione del volontario a un evento.
	 * @param partecipazione Oggetto partecipazione da aggiungere.
	 */
	public void aggiungiPartecipazione(Partecipazione partecipazione);
	/**
	 * Modifica della partecipazione del volontario a un evento.
	 * @param partecipazione Oggetto partecipazione da sostituire a quello attuale.
	 */
	public void modificaPartecipazione(Partecipazione partecipazione);
	/**
	 * Eliminazione della partecipazione del volontario a un evento.
	 * @param idPartecipazione id della partecipazione da eliminare.
	 */
	public void eliminaPartecipazione(Integer idPartecipazione);
	/**
	 * Recupero della lista partecipazioni di un evento. 
	 * @param idEvento Evento da cui recuperare le partecipazioni.
	 *
	 * @return Una lista di oggetti {@link Partecipazione}.
	 */
	public List<Partecipazione> listaPartecipazioni(Integer idEvento);
	/**
	 * Recupero della cronologia delle partecipazioni effettuate di un volontario.
	 * @param email email del volontario.
	 *
	 * @return Una lista di oggetti {@link PartecipazioneDTO}
	 */
    public List<PartecipazioneDTO> cronologiaPartecipazioni(String email);
	/**
	 * Recupero di un evento dal suo id.
	 * @param idEvento Id dell'evento.
	 *
	 * @return Un oggetto {@link Evento} con l'id specificato, oppure null se l'evento non esiste.
	 */
    public Evento getEventoById(Integer idEvento);
	/**
	 * Recupero di una partecipazione dal suo id.
	 * @param idEvento Id dell'evento.
	 *
	 * @return Un oggetto {@link Partecipazione} con l'id specificato, oppure null se la partecipazione non esiste.
	 */
    public Partecipazione getPartecipazioneById(Integer idEvento);
}
