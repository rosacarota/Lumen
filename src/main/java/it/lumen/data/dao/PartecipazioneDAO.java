package it.lumen.data.dao;

import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartecipazioneDAO extends JpaRepository<Partecipazione, Integer> {

    List<Partecipazione> findAllByEvento_IdEvento(Integer idEvento);

    List<Partecipazione> findAllByVolontario(Utente volontario);

    void removePartecipazioneByIdPartecipazione(Integer idPartecipazione);

	Partecipazione getPartecipazioneByIdPartecipazione(Integer idPartecipazione);
}
