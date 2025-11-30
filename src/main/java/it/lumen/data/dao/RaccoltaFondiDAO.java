package it.lumen.data.dao;

import it.lumen.data.entity.RaccoltaFondi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface RaccoltaFondiDAO extends  JpaRepository<RaccoltaFondi, Integer> {
    List<RaccoltaFondi> findAllByEnte_Email(String email);

    void removeRaccoltaFondiByIdRaccoltaFondi(int idRaccolta);
}
