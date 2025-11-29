package it.lumen.data.dao;

import it.lumen.data.entity.Affiliazione;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AffiliazioneDAO extends JpaRepository<Affiliazione, Integer> {

    @Query("SELECT a.volontario FROM Affiliazione a WHERE a.ente = :ente AND a.stato = 'Accettata'")
    List<Utente> findVolontariAffiliati(@Param("ente") Utente ente);

    @Query("SELECT a FROM Affiliazione a WHERE a.ente = :ente AND a.stato = 'InAttesa'")
    List<Affiliazione> findAffiliazioneByStato_InAttesa(@Param("ente") Utente ente);

    boolean existsByEnte_EmailAndVolontario_Email(String emailEnte, String emailVolontario);


    Affiliazione findByIdAffiliazione(int id);

    @Transactional
    void removeByIdAffiliazione(int id);
}
