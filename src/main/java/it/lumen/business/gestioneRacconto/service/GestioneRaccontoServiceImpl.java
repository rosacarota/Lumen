package it.lumen.business.gestioneRacconto.service;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
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
    private final AutenticazioneService autenticazioneService;
    private static final String UPLOAD_DIR = Paths.get("uploads/stories").toAbsolutePath().toString();


    @Autowired
    public GestioneRaccontoServiceImpl(RaccontoDAO raccontoDAO, AutenticazioneService autenticazioneService) {
        this.raccontoDAO = raccontoDAO;
        this.autenticazioneService = autenticazioneService;
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

            try {
                racconto.setImmagine(recuperaImmagine(racconto.getImmagine()));
                Utente utente=racconto.getUtente();


               // utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
               // racconto.setUtente(utente);

            } catch (IOException e) {
                System.out.println("Errore nel recupero immagine: " + e.getMessage());
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

    public String recuperaImmagine(String pathImmagine) throws IOException {

        if (pathImmagine == null || pathImmagine.trim().isEmpty()) {
            return null;
        }

        String fileName = pathImmagine.substring(pathImmagine.lastIndexOf("/") + 1);

        if (fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome file non valido estratto dal percorso: " + pathImmagine);
        }


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
