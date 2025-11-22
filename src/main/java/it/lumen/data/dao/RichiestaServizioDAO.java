package it.lumen.data.dao;

import it.lumen.data.entity.RichiestaServizio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RichiestaServizioDAO {
    List<RichiestaServizio>findAllByEnte_Email_or_Volontario_Email(String email);           //----TO CHECK
    List<RichiestaServizio>findAllByBeneficiario_Email(String email);
}
