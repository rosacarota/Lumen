package it.lumen.data.dao;

import it.lumen.data.entity.RichiestaServizio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RichiestaServizioDAO extends JpaRepository<RichiestaServizio, Integer>{
    List<RichiestaServizio>findAllByEnteVolontraio_Email(String email);           //----TO CHECK
    List<RichiestaServizio>findAllByBeneficiario_Email(String email);
}
