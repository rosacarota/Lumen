package it.lumen.data.dao;

import it.lumen.data.entity.Donazione;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface  DonazioneDAO extends JpaRepository<Donazione, Integer> {
    List<Donazione> findAllByRaccoltaFondi_IDRaccolta(int idRaccolta);
    List<Donazione> findAllByEnte_Email(String enteEmail);
}
