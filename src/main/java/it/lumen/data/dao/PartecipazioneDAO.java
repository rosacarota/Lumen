package it.lumen.data.dao;

import it.lumen.data.entity.Partecipazione;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartecipazioneDAO extends JpaRepository<Partecipazione, Integer> {

    List<Partecipazione> findAllByEvento_IDEvento(Integer idEvento);
}
