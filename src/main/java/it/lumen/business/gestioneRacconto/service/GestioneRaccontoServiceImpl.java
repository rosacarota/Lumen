package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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
    private static final String UPLOAD_DIR = Paths.get("uploads/stories").toAbsolutePath().toString();


    @Autowired
    public GestioneRaccontoServiceImpl(RaccontoDAO raccontoDAO) {
        this.raccontoDAO = raccontoDAO;
    }

    // ========================= CRUD =========================

    @Override
    @Transactional
    public Racconto aggiungiRacconto(Racconto racconto) {
        if (racconto.getImmagine() != null && !racconto.getImmagine().isEmpty()) {
            try {
                String fileName = salvaImmagine(racconto.getImmagine());
                racconto.setImmagine(fileName); // salvo solo il nome del file
            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }
        return raccontoDAO.save(racconto);
    }

    @Override
    @Transactional
    public Racconto modificaRacconto(Racconto nuovoRacconto) {
        // Recupera il racconto esistente dal DB
        Racconto vecchioRacconto = raccontoDAO.getRaccontoByIdRacconto(nuovoRacconto.getIdRacconto());
        if (vecchioRacconto == null) {
            throw new RuntimeException("Racconto non trovato con id: " + nuovoRacconto.getIdRacconto());
        }

        // Mantieni vecchia immagine se non viene inviata una nuova
        if (nuovoRacconto.getImmagine() == null || nuovoRacconto.getImmagine().isEmpty()) {
            nuovoRacconto.setImmagine(vecchioRacconto.getImmagine());
        } else {
            try {
                // Salva nuova immagine
                String fileName = salvaImmagine(nuovoRacconto.getImmagine());
                nuovoRacconto.setImmagine(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }

        // Mantieni data pubblicazione originale
        nuovoRacconto.setDataPubblicazione(vecchioRacconto.getDataPubblicazione());

        // Mantieni l’utente originale
        nuovoRacconto.setUtente(vecchioRacconto.getUtente());

        // Salva modifiche
        return raccontoDAO.save(nuovoRacconto);
    }


    @Override
    @Transactional
    public void eliminaRacconto(Integer idRacconto) {
        Racconto racconto = raccontoDAO.getRaccontoByIdRacconto(idRacconto);
        if (racconto == null) {
            System.out.println("Racconto non trovato: " + idRacconto);
            return;
        }

        /*
        // elimina immagine se presente
        if (racconto.getImmagine() != null && !racconto.getImmagine().trim().isEmpty()) {
            boolean deleted = eliminaImmagine(racconto.getImmagine());
            System.out.println("File eliminato immagine: " + deleted + " -> " + racconto.getImmagine());
        }
        */


        raccontoDAO.removeByIdRacconto(idRacconto);
    }

    @Override
    public Racconto getByIdRacconto(int idRacconto) {
        Racconto racconto = raccontoDAO.getRaccontoByIdRacconto(idRacconto);
        if (racconto != null && racconto.getImmagine() != null) {
            try {
                racconto.setImmagine(recuperaImmagine(racconto.getImmagine()));
            } catch (IOException e) {
                System.out.println("Errore nel recupero immagine: " + e.getMessage());
            }
        }
        return racconto;
    }

    @Override
    public Racconto getByIdRaccontoRaw(int idRacconto) {
        return raccontoDAO.getRaccontoByIdRacconto(idRacconto);
    }


    @Override
    public boolean checkId(int idRacconto) {
        return raccontoDAO.existsById(idRacconto);
    }

    @Override
    public List<Racconto> listaRaccontiUtente(String email) {
        List<Racconto> racconti = raccontoDAO.findAllByUtente_Email(email);
        for (Racconto racconto : racconti) {
            if (racconto.getImmagine() != null) {
                try {
                    racconto.setImmagine(recuperaImmagine(racconto.getImmagine()));
                } catch (IOException e) {
                    System.out.println("Errore nel recupero immagine: " + e.getMessage());
                }
            }
        }
        return racconti;
    }

    // ========================= IMMAGINI =========================

    public String salvaImmagine(String base64) throws IOException {
        String[] parts = base64.split(",");
        String header = parts[0];
        String content = parts[1];

        String ext = ".jpg";
        if (header.contains("image/png")) ext = ".png";
        else if (header.contains("image/gif")) ext = ".gif";

        byte[] bytes = Base64.getDecoder().decode(content);
        String fileName = UUID.randomUUID().toString() + ext;

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Files.write(uploadPath.resolve(fileName), bytes);

        return fileName; // salvo solo il nome
    }

    public String recuperaImmagine(String fileName) throws IOException {
        if (fileName == null || fileName.trim().isEmpty()) return null;

        Path path = Paths.get(UPLOAD_DIR).resolve(fileName);
        if (!Files.exists(path)) throw new FileNotFoundException(path.toString());
        if (Files.isDirectory(path)) throw new AccessDeniedException(path.toString());
        if (!Files.isReadable(path)) throw new AccessDeniedException(path.toString());

        byte[] bytes = Files.readAllBytes(path);
        String mime = "image/jpeg";
        if (fileName.toLowerCase().endsWith(".png")) mime = "image/png";
        else if (fileName.toLowerCase().endsWith(".gif")) mime = "image/gif";

        return "data:" + mime + ";base64," + Base64.getEncoder().encodeToString(bytes);
    }

    /*
    public boolean eliminaImmagine(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) return false;

        Path path = Paths.get(UPLOAD_DIR, fileName).toAbsolutePath();
        System.out.println("Provo a eliminare file: " + path);

        if (!Files.exists(path)) {
            System.out.println("File non trovato: " + path);
            return false;
        }

        try {
            boolean deleted = Files.deleteIfExists(path);
            System.out.println("File eliminato: " + deleted);
            return deleted;
        } catch (IOException e) {
            System.out.println("Errore eliminazione file: " + e.getMessage());
            return false;
        }
    }
    */



}
