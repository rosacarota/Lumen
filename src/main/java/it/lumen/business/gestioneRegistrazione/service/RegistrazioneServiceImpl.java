package it.lumen.business.gestioneRegistrazione.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import it.lumen.security.Encrypter;
import jakarta.validation.constraints.Email;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

/**
 * Implementazione del servizio di registrazione.
 * Gestisce la logica di registrazione utente, inclusa la cifratura della
 * password e il salvataggio delle immagini.
 */
@Service
public class RegistrazioneServiceImpl implements RegistrazioneService {

    private final UtenteDAO utenteDAO;

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param utenteDAO Il DAO per l'accesso ai dati utente.
     */
    public RegistrazioneServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean checkEmail(@Email(message = "Email non valida") String email) {
        return utenteDAO.existsByEmail(email);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void registraUtente(@Valid Utente utente) {

        if (checkEmail(utente.getEmail())) {
            throw new IllegalArgumentException("Email già registrata");
        }

        Encrypter encrypter = new Encrypter();
        String passwordCriptata = encrypter.encrypt(utente.getPassword());

        utente.setPassword(passwordCriptata);

        if (utente.getImmagine() != null && !utente.getImmagine().isEmpty()) {
            try {
                String pathImmagineSalvata = salvaImmagine(utente.getImmagine());

                utente.setImmagine(pathImmagineSalvata);

            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }
        utenteDAO.save(utente);

    }

    /**
     * {@inheritDoc}
     */
    @Override
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
