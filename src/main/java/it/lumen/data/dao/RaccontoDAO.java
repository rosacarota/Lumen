package it.lumen.data.dao;

import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RaccontoDAO extends JpaRepository<Racconto, Integer> {

    List<Racconto> findAllByUtente_Email(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM Racconto r WHERE r.idRacconto = :idRacconto")
    void removeByIdRacconto(@Param("idRacconto") Integer idRacconto);

    Racconto getRaccontoByIdRacconto(Integer idRacconto);

}
