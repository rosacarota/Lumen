package it.lumen.data.dao;

import it.lumen.data.entity.RichiestaServizio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RichiestaServizioDAO extends JpaRepository<RichiestaServizio, Integer>{
    List<RichiestaServizio>findAllByEnteVolontario_Email(String email);           //----TO CHECK
    List<RichiestaServizio>findAllByBeneficiario_Email(String email);

    @Query("SELECT r FROM RichiestaServizio r WHERE r.enteVolontario.email = :email AND r.stato = 'InAttesa'")
    List<RichiestaServizio>findAllByEmailInAttesa(@Param("email")String email);
}
