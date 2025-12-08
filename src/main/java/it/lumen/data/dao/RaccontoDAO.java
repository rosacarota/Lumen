package it.lumen.data.dao;

import it.lumen.data.entity.Racconto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Racconto.
 */
public interface RaccontoDAO extends JpaRepository<Racconto, Integer> {

    /**
     * Trova tutti i racconti creati da un utente specifico tramite email.
     *
     * @param email L'email dell'utente.
     * @return Una lista di racconti dell'utente.
     */
    List<Racconto> findAllByUtente_Email(String email);

    /**
     * Rimuove un racconto dato il suo ID.
     *
     * @param idRacconto L'ID del racconto da rimuovere.
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM Racconto r WHERE r.idRacconto = :idRacconto")
    void removeByIdRacconto(@Param("idRacconto") Integer idRacconto);

    /**
     * Recupera un racconto dato il suo ID.
     *
     * @param idRacconto L'ID del racconto.
     * @return Il racconto trovato.
     */
    Racconto getRaccontoByIdRacconto(Integer idRacconto);

}
