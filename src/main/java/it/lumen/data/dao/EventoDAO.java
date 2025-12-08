package it.lumen.data.dao;

import it.lumen.data.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Evento.
 */
public interface EventoDAO extends JpaRepository<Evento, Integer> {

    /**
     * Trova tutti gli eventi creati da un utente specifico tramite la sua email.
     *
     * @param email L'email dell'utente creatore.
     * @return Una lista di eventi.
     */
    List<Evento> findAllByUtente_Email(String email);

    /**
     * Rimuove un evento dal database dato il suo ID.
     *
     * @param idEvento L'ID dell'evento da rimuovere.
     */
    void removeEventoByIdEvento(Integer idEvento);

    /**
     * Recupera un evento dato il suo ID.
     *
     * @param idEvento L'ID dell'evento.
     * @return L'evento trovato.
     */
    Evento getEventoByIdEvento(Integer idEvento);

    /**
     * Trova tutti gli eventi di un utente che sono in corso tra due date
     * specificate.
     *
     * @param email L'email dell'utente.
     * @param oggi1 Una data di riferimento.
     * @param oggi  Un'altra data di riferimento.
     * @return Una lista di eventi attivi.
     */
    List<Evento> findAllByUtente_EmailAndDataInizioLessThanEqualAndDataFineGreaterThanEqual(String email, Date oggi1,
            Date oggi);

    /**
     * Trova tutti gli eventi di un utente che sono terminati prima di una certa
     * data.
     *
     * @param email L'email dell'utente.
     * @param oggi  La data di riferimento.
     * @return Una lista di eventi passati.
     */
    List<Evento> findAllByUtente_EmailAndDataFineBefore(String email, Date oggi);

    /**
     * Trova tutti gli eventi di un utente che inizieranno dopo una certa data.
     *
     * @param email L'email dell'utente.
     * @param oggi  La data di riferimento.
     * @return Una lista di eventi futuri.
     */
    List<Evento> findAllByUtente_EmailAndDataInizioAfter(String email, Date oggi);

    /**
     * Trova un evento dato il suo ID.
     *
     * @param idEvento L'ID dell'evento.
     * @return L'evento trovato.
     */
    Evento findEventoByIdEvento(Integer idEvento);

    /**
     * Recupera tutti gli eventi presenti nel database.
     *
     * @return Una lista di tutti gli eventi.
     */
    @Override
    List<Evento> findAll();
}
