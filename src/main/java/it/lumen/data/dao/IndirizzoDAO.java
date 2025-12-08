package it.lumen.data.dao;

import it.lumen.data.entity.Indirizzo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interfaccia DAO per la gestione dell'entità Indirizzo.
 */
public interface IndirizzoDAO extends JpaRepository<Indirizzo, Integer> {
}
