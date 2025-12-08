package it.lumen.data.dao;

import it.lumen.data.entity.RaccoltaFondi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Interfaccia DAO per la gestione dell'entità RaccoltaFondi.
 */
public interface RaccoltaFondiDAO extends JpaRepository<RaccoltaFondi, Integer> {
    /**
     * Trova tutte le raccolte fondi create da un ente specifico tramite email.
     *
     * @param email L'email dell'ente.
     * @return Una lista di raccolte fondi dell'ente.
     */
    List<RaccoltaFondi> findAllByEnte_Email(String email);

    /**
     * Rimuove una raccolta fondi dato il suo ID.
     *
     * @param idRaccolta L'ID della raccolta fondi da rimuovere.
     */
    void removeRaccoltaFondiByIdRaccoltaFondi(int idRaccolta);
}
