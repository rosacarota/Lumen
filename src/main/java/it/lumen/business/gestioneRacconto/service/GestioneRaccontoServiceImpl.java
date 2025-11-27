package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
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

        return raccontoDAO.getRaccontoByIdRacconto(idRacconto);

    }

    public boolean checkId(int idRacconto) {

        return raccontoDAO.existsById(idRacconto);

    }

    public List<Racconto> listaRaccontiUtente(String email) {

        return raccontoDAO.findAllByUtente_Email(email);


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


        return "/stories/" + fileName;


    }

    public boolean eliminaImmagine(String imageName) {
        Path path = Paths.get("uploads/" + imageName);
        try {
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
