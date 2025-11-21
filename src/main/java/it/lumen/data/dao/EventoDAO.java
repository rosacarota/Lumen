package it.lumen.data.dao;

import it.lumen.data.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

interface EventoDAO extends JpaRepository<Evento, Integer> {
}
