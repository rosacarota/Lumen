package it.lumen.business.gestioneAccount.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

/**
 * Implementazione del servizio di gestione account.
 * Fornisce le funzionalità per modificare i dati degli utenti.
 */
@Service
public class GestioneAccountServiceImpl implements GestioneAccountService {

    private final UtenteDAO utenteDAO;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param utenteDAO Il DAO per l'accesso ai dati degli utenti.
     */
    @Autowired
    public GestioneAccountServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void modificaUtente(@Valid Utente utente) {
        Utente existingUtente = utenteDAO.findByEmail(utente.getEmail());
        if (existingUtente != null) {
            existingUtente.setNome(utente.getNome());
            existingUtente.setCognome(utente.getCognome());
            existingUtente.setPassword(utente.getPassword());
            existingUtente.setDescrizione(utente.getDescrizione());
            existingUtente.setRecapitoTelefonico(utente.getRecapitoTelefonico());
            existingUtente.setRuolo(utente.getRuolo());
            existingUtente.setAmbito(utente.getAmbito());
            //existingUtente.setImmagine(utente.getImmagine());

            if(utente.getImmagine() != null && !utente.getImmagine().isEmpty()){
                try {
                    String pathImmagineSalvata = salvaImmagine(utente.getImmagine());
                    utente.setImmagine(pathImmagineSalvata);
                } catch (IOException e) {
                    throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
                }
            }

            if (existingUtente.getIndirizzo() != null && utente.getIndirizzo() != null) {
                existingUtente.getIndirizzo().setCitta(utente.getIndirizzo().getCitta());
                existingUtente.getIndirizzo().setProvincia(utente.getIndirizzo().getProvincia());
                existingUtente.getIndirizzo().setCap(utente.getIndirizzo().getCap());
                existingUtente.getIndirizzo().setStrada(utente.getIndirizzo().getStrada());
                existingUtente.getIndirizzo().setNCivico(utente.getIndirizzo().getNCivico());
            } else if (utente.getIndirizzo() != null) {
                existingUtente.setIndirizzo(utente.getIndirizzo());
            }

            utenteDAO.save(existingUtente);
        } else {
            utenteDAO.save(utente);
        }
    }

    public String salvaImmagine(String base64String) throws IOException {

        if (base64String == null || base64String.isEmpty()) {
            return null;
        }

        String[] parts = base64String.split(",");
        String header = parts[0];
        String content = parts[1];

        String extension = ".jpg";
        if (header.contains("image/png")) {
            extension = ".png";
        } else if (header.contains("image/jpeg") || header.contains("image/jpg")) {
            extension = ".jpg";
        } else if (header.contains("image/gif")) {
            extension = ".gif";
        }

        byte[] imageBytes = Base64.getDecoder().decode(content);

        String fileName = UUID.randomUUID().toString() + extension;

        String UPLOAD_DIR = "uploads/profile_images/";
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, imageBytes);

        return "/profile_images/" + fileName;

    }
}
