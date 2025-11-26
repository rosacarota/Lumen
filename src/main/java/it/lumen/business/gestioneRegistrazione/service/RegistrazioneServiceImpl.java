package it.lumen.business.gestioneRegistrazione.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import it.lumen.security.Encrypter;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class RegistrazioneServiceImpl implements RegistrazioneService {

    private final UtenteDAO utenteDAO;

    public RegistrazioneServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }


    @Override
    public boolean checkEmail(String email) {
        return utenteDAO.existsByEmail(email);
    }

    public void registraUtente(Utente utente) {

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

    public String salvaImmagine(String base64String) throws IOException {

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
