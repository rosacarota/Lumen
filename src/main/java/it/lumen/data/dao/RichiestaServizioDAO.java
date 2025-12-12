package it.lumen.data.dao;

import it.lumen.data.entity.RichiestaServizio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità RichiestaServizio.
 */
public interface RichiestaServizioDAO extends JpaRepository<RichiestaServizio, Integer> {
    /**
     * Trova tutte le richieste di servizio associate a un ente volontario tramite
     * email.
     *
     * @param email L'email dell'ente volontario.
     * @return Una lista di richieste di servizio.
     */
    List<RichiestaServizio> findAllByEnteVolontario_Email(String email); // ----TO CHECK

    /**
     * Trova tutte le richieste di servizio fatte da un beneficiario tramite email.
     *
     * @param email L'email del beneficiario.
     * @return Una lista di richieste di servizio.
     */
    List<RichiestaServizio> findAllByBeneficiario_Email(String email);

    /**
     * Trova tutte le richieste di servizio in stato "InAttesa" per un determinato
     * ente volontario.
     *
     * @param email L'email dell'ente volontario.
     * @return Una lista di richieste di servizio in attesa.
     */
    @Query("SELECT r FROM RichiestaServizio r WHERE r.enteVolontario.email = :email AND r.stato = 'InAttesa'")
    List<RichiestaServizio> findAllByEmailInAttesa(@Param("email") String email);
}
