package it.lumen.data.dao;

import it.lumen.data.entity.Racconto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RaccontoDAO extends JpaRepository<Racconto, Integer> {

    List<Racconto> findAllByUtente_Email(String email);

    void removeByIdRacconto(Integer idRacconto);
}
