package it.lumen.data.dao;

import it.lumen.data.entity.Affiliazione;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AffiliazioneDAO extends JpaRepository<Affiliazione, Integer> {

    List<Affiliazione> findAllByEnte_Email(String email);
}
