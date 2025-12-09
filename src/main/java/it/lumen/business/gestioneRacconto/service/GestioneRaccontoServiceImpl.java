package it.lumen.business.gestioneRacconto.service;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * Implementazione del servizio di gestione dei racconti.
 * Fornisce le funzionalità per aggiungere, modificare, eliminare e visualizzare i racconti degli utenti.
 */
@Service
public class GestioneRaccontoServiceImpl implements GestioneRaccontoService {

    private final RaccontoDAO raccontoDAO;
    private static final String UPLOAD_DIR = Paths.get("uploads/stories").toAbsolutePath().toString();

    /**
     * Costruttore per l'iniezione delle dipendenze.
     *
     * @param raccontoDAO Il DAO per l'accesso ai dati dei racconti
     */
    @Autowired
    public GestioneRaccontoServiceImpl(RaccontoDAO raccontoDAO) {
        this.raccontoDAO = raccontoDAO;

    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Racconto aggiungiRacconto(@Valid Racconto racconto) {
        if (racconto.getImmagine() != null && !racconto.getImmagine().isEmpty()) {
            try {
                String fileName = salvaImmagine(racconto.getImmagine());
                racconto.setImmagine(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }
        return raccontoDAO.save(racconto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Racconto modificaRacconto(@Valid Racconto nuovoRacconto) {

        Racconto vecchioRacconto = raccontoDAO.getRaccontoByIdRacconto(nuovoRacconto.getIdRacconto());
        if (vecchioRacconto == null) {
            throw new RuntimeException("Racconto non trovato con id: " + nuovoRacconto.getIdRacconto());
        }

        if (nuovoRacconto.getImmagine() == null || nuovoRacconto.getImmagine().isEmpty()) {
            nuovoRacconto.setImmagine(null);
        } else {
            try {
                // Salva nuova immagine
                String fileName = salvaImmagine(nuovoRacconto.getImmagine());
                nuovoRacconto.setImmagine(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Errore durante il salvataggio dell'immagine: " + e.getMessage());
            }
        }

        nuovoRacconto.setDataPubblicazione(vecchioRacconto.getDataPubblicazione());


        nuovoRacconto.setUtente(vecchioRacconto.getUtente());

        return raccontoDAO.save(nuovoRacconto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void eliminaRacconto(Integer idRacconto) {
        Racconto racconto = raccontoDAO.getRaccontoByIdRacconto(idRacconto);
        if (racconto == null) {
            System.out.println("Racconto non trovato: " + idRacconto);
            return;
        }

        raccontoDAO.removeByIdRacconto(idRacconto);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public Racconto getByIdRaccontoRaw(int idRacconto) {
        return raccontoDAO.getRaccontoByIdRacconto(idRacconto);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public boolean checkId(int idRacconto) {
        return raccontoDAO.existsById(idRacconto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Racconto> listaRaccontiUtente(@Email(message = "Email non valida") String email) {
        List<Racconto> racconti = raccontoDAO.findAllByUtente_Email(email);
        for (Racconto racconto : racconti) {

            try {
                racconto.setImmagine(recuperaImmagine(racconto.getImmagine()));

            } catch (IOException e) {
                System.out.println("Errore nel recupero immagine: " + e.getMessage());
            }

        }
        return racconti;
    }

    /**
     * {@inheritDoc}
     */
    public List<Racconto> listaRacconti() {
        List<Racconto> racconti = raccontoDAO.findAll();
        for (Racconto r : racconti) {
            try {
                r.setImmagine(recuperaImmagine(r.getImmagine()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return racconti;
    }

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

        return fileName;
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
