package it.lumen.business.gestioneEvento.service;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.dao.EventoDAO;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Utente;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;

import javax.validation.constraints.Pattern;

@Service
public class GestioneEventoServiceImpl implements GestioneEventoService {


    private final EventoDAO eventoDAO;
    private final AutenticazioneService autenticazioneService;

    @Autowired
    public GestioneEventoServiceImpl(EventoDAO eventoDAO, AutenticazioneService autenticazioneService) {
        this.eventoDAO = eventoDAO;
        this.autenticazioneService = autenticazioneService;
    }

    @Override
    @Transactional
    public Evento aggiungiEvento(Evento evento) {

        return eventoDAO.save(evento);
    }

    @Override
    @Transactional
    public Evento modificaEvento(Evento evento) {

        try {
            String path = salvaImmagine(evento.getImmagine());
            evento.setImmagine(path);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return eventoDAO.save(evento);
    }

    @Override
    @Transactional
    public void eliminaEvento(int idEvento) {
        eventoDAO.removeEventoByIdEvento(idEvento);
    }

    @Override
    public boolean checkId(int idEvento) {

        return eventoDAO.existsById(idEvento);

    }

    @Override
    public Evento getEventoById(int idEvento){

       Evento evento = eventoDAO.getEventoByIdEvento(idEvento);
        try {
            evento.setImmagine(recuperaImmagine(evento.getImmagine()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return evento;
    }

    @Override
    public List<Evento> cronologiaEventi(String email, String stato) {
        Date oggi = new Date();


        if (stato == null)
            stato = "";

        switch (stato.toLowerCase()) {
            case "attivi":

                return eventoDAO.findAllByUtente_EmailAndDataInizioLessThanEqualAndDataFineGreaterThanEqual(email, oggi, oggi);

            case "terminati":

                return eventoDAO.findAllByUtente_EmailAndDataFineBefore(email, oggi);

            case "futuri":

                return eventoDAO.findAllByUtente_EmailAndDataInizioAfter(email, oggi);

            default:

                return eventoDAO.findAllByUtente_Email(email);
        }
    }

    public List<Evento> tuttiGliEventi(){
        List<Evento> eventList = eventoDAO.findAll();

        eventList.stream().map(evento -> {
            Utente utente = evento.getUtente();
            try {
                utente.setImmagine(autenticazioneService.recuperaImmagine(utente.getImmagine()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return evento;
        }).collect(Collectors.toList());
        return eventList;
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

    public String salvaImmagine(String base64String) throws IOException {

        if (base64String == null || base64String.trim().isEmpty()) {
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

        String UPLOAD_DIR = "uploads/stories/";
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, imageBytes);


        return "/stories/" + fileName;


    }
}
