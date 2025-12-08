package it.lumen.data.dao;

import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità Affiliazione.
 */
public interface AffiliazioneDAO extends JpaRepository<Affiliazione, Integer> {

    /**
     * Trova la lista dei volontari affiliati a un ente che hanno lo stato
     * "Accettata".
     *
     * @param ente L'ente per cui cercare i volontari affiliati.
     * @return Una lista di utenti volontari affiliati.
     */
    @Query("SELECT a.volontario FROM Affiliazione a WHERE a.ente = :ente AND a.stato = 'Accettata'")
    List<Utente> findVolontariAffiliati(@Param("ente") Utente ente);

    /**
     * Trova tutte le affiliazioni "Accettata" associate a un determinato ente.
     *
     * @param ente L'ente per cui cercare le affiliazioni.
     * @return Una lista di affiliazioni accettate per l'ente.
     */
    @Query("SELECT a FROM Affiliazione a WHERE a.ente = :ente AND a.stato = 'Accettata'")
    List<Affiliazione> findAffiliatibyEnte(Utente ente);

    /**
     * Trova tutte le affiliazioni con stato "InAttesa" per un determinato ente.
     *
     * @param ente L'ente per cui cercare le affiliazioni in attesa.
     * @return Una lista di affiliazioni in attesa per l'ente.
     */
    @Query("SELECT a FROM Affiliazione a WHERE a.ente = :ente AND a.stato = 'InAttesa'")
    List<Affiliazione> findAffiliazioneByStato_InAttesa(@Param("ente") Utente ente);

    /**
     * Verifica se esiste un'affiliazione associata all'email di un volontario.
     *
     * @param emailVolontario L'email del volontario.
     * @return true se esiste un'affiliazione per il volontario, false altrimenti.
     */
    boolean existsByVolontario_Email(String emailVolontario);

    /**
     * Trova un'affiliazione data il suo ID.
     *
     * @param id L'ID dell'affiliazione.
     * @return L'affiliazione trovata, o null se non esiste.
     */
    Affiliazione findByIdAffiliazione(int id);

    /**
     * Rimuove un'affiliazione dato il suo ID.
     *
     * @param id L'ID dell'affiliazione da rimuovere.
     */
    @Transactional
    void removeByIdAffiliazione(int id);
}
