package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class GestioneRaccontoServiceImpl implements GestioneRaccontoService {

    private final RaccontoDAO raccontoDAO;

    @Autowired
    public GestioneRaccontoServiceImpl(RaccontoDAO raccontoDAO) {
        this.raccontoDAO = raccontoDAO;
    }

    @Override
    @Transactional
    public Racconto aggiungiRacconto(Racconto racconto) {

        if (racconto.getImmagine() != null && !racconto.getImmagine().isEmpty()) {
            try {
                String pathImmagineSalvata = salvaImmagine(racconto.getImmagine());

                racconto.setImmagine(pathImmagineSalvata);

            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }
        return raccontoDAO.save(racconto);
    }

    @Override
    @Transactional
    public Racconto modificaRacconto(Racconto nuovoRacconto) {

        String pathImmagineDaCancellare=raccontoDAO.getRaccontoByIdRacconto(nuovoRacconto.getIdRacconto()).getImmagine();

        if(pathImmagineDaCancellare!=null) {
            eliminaImmagine(pathImmagineDaCancellare);
        }

        if (nuovoRacconto.getImmagine() != null && !nuovoRacconto.getImmagine().isEmpty()) {
            try {
                String pathImmagineSalvata = salvaImmagine(nuovoRacconto.getImmagine());
                nuovoRacconto.setImmagine(pathImmagineSalvata);

            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }

        return raccontoDAO.save(nuovoRacconto);
    }

    @Override
    @Transactional
    public void eliminaRacconto(Integer idRacconto) {

        String pathImmagineDaCancellare=raccontoDAO.getRaccontoByIdRacconto(idRacconto).getImmagine();

        if(pathImmagineDaCancellare!=null) {
            eliminaImmagine(pathImmagineDaCancellare);
        }

        raccontoDAO.removeByIdRacconto(idRacconto);
    }

    public Racconto getByIdRacconto(int idRacconto) {

        Racconto racconto = raccontoDAO.getRaccontoByIdRacconto(idRacconto);
        try {
            racconto.setImmagine(recuperaImmagine(racconto.getImmagine()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return racconto;
    }

    public boolean checkId(int idRacconto) {

        return raccontoDAO.existsById(idRacconto);

    }

    public List<Racconto> listaRaccontiUtente(String email) {

       List<Racconto> racconti=  raccontoDAO.findAllByUtente_Email(email);

       for(Racconto racconto : racconti){
           try {
               racconto.setImmagine(recuperaImmagine(racconto.getImmagine()));
           } catch (IOException e) {
               throw new RuntimeException(e);
           }
       }
        return racconti;
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

        String UPLOAD_DIR = "uploads/stories/";
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, imageBytes);


        return "uploads/stories/" + fileName;


    }

    public String recuperaImmagine(String pathImmagine) throws IOException {

        if (pathImmagine == null || pathImmagine.trim().isEmpty()) {
            return null;
        }

        String fileName = pathImmagine.substring(pathImmagine.lastIndexOf("/") + 1);

        if (fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome file non valido estratto dal percorso: " + pathImmagine);
        }

        String UPLOAD_DIR = "uploads/stories/";
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


    public boolean eliminaImmagine(String imageName) {
        Path path = Paths.get("uploads/stories/" + imageName);
        try {
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
