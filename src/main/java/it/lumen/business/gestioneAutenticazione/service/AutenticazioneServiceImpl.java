package it.lumen.business.gestioneAutenticazione.service;

import it.lumen.data.dao.UtenteDAO;
import it.lumen.data.entity.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.lumen.security.Encrypter;

import javax.validation.constraints.Pattern;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class AutenticazioneServiceImpl implements AutenticazioneService {

    private final UtenteDAO utenteDAO;

    @Autowired
    public AutenticazioneServiceImpl(UtenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    @Override
    public Utente login(String email, String password) {
        Encrypter encrypter = new Encrypter();
        Utente utente = utenteDAO.findByEmail(email);
        if (utente == null) return null;

        if (encrypter.checkPassword(password, utente.getPassword())) {
            return utente;
        }
        return null;
    }

    @Override
    public Utente getUtente(String email){
       return utenteDAO.findByEmail(email);
    }

    public String recuperaImmagine(String pathImmagine) throws IOException {



        if(pathImmagine == null || !(pathImmagine.endsWith("jpg") ||  pathImmagine.endsWith("jpeg") || pathImmagine.endsWith("png") || pathImmagine.endsWith("gif") ||  pathImmagine.endsWith("webp"))) {
            return pathImmagine;
        }
        if (pathImmagine.trim().isEmpty()) {
            return null;
        }
        String fileName = pathImmagine.substring(pathImmagine.lastIndexOf("/") + 1);

        if (fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome file non valido estratto dal percorso: " + pathImmagine);
        }

        String UPLOAD_DIR = "uploads/profile_images/";
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File non trovato: " + filePath.toString());
        }
        if (Files.isDirectory(filePath)) {
            throw new AccessDeniedException("Il percorso punta a una directory, non a un file: " + filePath.toString());
        }
        if (!Files.isReadable(filePath)) {
            throw new AccessDeniedException("Permessi di lettura mancanti per il file: " + filePath.toString());
        }

        byte[] imageBytes = Files.readAllBytes(filePath);

        String mimeType = "image/jpeg";
        if (fileName.toLowerCase().endsWith(".png")) mimeType = "image/png";
        else if (fileName.toLowerCase().endsWith(".gif")) mimeType = "image/gif";

        String base64Content = Base64.getEncoder().encodeToString(imageBytes);
        return "data:" + mimeType + ";base64," + base64Content;
    }

}
