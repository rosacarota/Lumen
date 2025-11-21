package it.lumen.data.dao;

import it.lumen.data.entity.Indirizzo;
import org.springframework.data.jpa.repository.JpaRepository;

interface IndirizzoDAO extends JpaRepository<Indirizzo, Integer> {
}
