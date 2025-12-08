package it.lumen.data.dao;

import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Partecipazione.
 */
public interface PartecipazioneDAO extends JpaRepository<Partecipazione, Integer> {

    /**
     * Trova tutte le partecipazioni relative a un determinato evento.
     *
     * @param idEvento L'ID dell'evento.
     * @return Una lista di partecipazioni per l'evento specificato.
     */
    List<Partecipazione> findAllByEvento_IdEvento(Integer idEvento);

    /**
     * Trova tutte le partecipazioni effettuate da un determinato volontario.
     *
     * @param volontario L'utente volontario.
     * @return Una lista di partecipazioni del volontario.
     */
    List<Partecipazione> findAllByVolontario(Utente volontario);

    /**
     * Rimuove una partecipazione data il suo ID.
     *
     * @param idPartecipazione L'ID della partecipazione da rimuovere.
     */
    void removePartecipazioneByIdPartecipazione(Integer idPartecipazione);

    /**
     * Recupera una partecipazione dato il suo ID.
     *
     * @param idPartecipazione L'ID della partecipazione.
     * @return La partecipazione trovata.
     */
    Partecipazione getPartecipazioneByIdPartecipazione(Integer idPartecipazione);
}
