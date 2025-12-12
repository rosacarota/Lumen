package it.lumen.business.gestionePartecipazione;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestionePartecipazione.control.PartecipazioneEventoControl;
import it.lumen.business.gestionePartecipazione.service.PartecipazioneEventoService;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Partecipazione;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AggiungiPartecipazioneEventoTest {

    @InjectMocks
    private PartecipazioneEventoControl partecipazioneEventoControl;

    @Mock
    private PartecipazioneEventoService partecipazioneEventoService;

    @Mock
    private AutenticazioneService autenticazioneService;

    @Mock
    private JwtUtil util;

    private Utente volontario;
    private Evento evento;
    private final String validToken = "validToken";
    private final int idEvento = 3;

    @BeforeEach
    void setUp() {
        volontario = new Utente();
        volontario.setEmail("franco@gmail.com");
        volontario.setRuolo(Utente.Ruolo.Volontario);

        evento = new Evento();
        evento.setIdEvento(idEvento);
        evento.setMaxPartecipanti(10);
    }

    @Test
    @DisplayName("TC_1.3.1_1: Partecipazione fallita a causa di email non valida")
    void testAggiungiPartecipazione_EmailNonValida() {
        String invalidEmail = "francogmail.com";
        when(util.extractRuolo(validToken)).thenReturn("Volontario");
        when(util.extractEmail(validToken)).thenReturn(invalidEmail);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(evento);
        when(autenticazioneService.getUtente(invalidEmail)).thenReturn(null); // L'utente non viene trovato

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Utente non trovato", response.getBody());
    }

    @Test
    @DisplayName("TC_1.3.1_2: Partecipazione fallita a causa di ruolo non autorizzato")
    void testAggiungiPartecipazione_RuoloNonVolontario() {
        String email = "franco@gmail.com";
        when(util.extractRuolo(validToken)).thenReturn("Beneficiario"); // Ruolo non corretto
        when(util.extractEmail(validToken)).thenReturn(email);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(evento);
        when(autenticazioneService.getUtente(email)).thenReturn(volontario);

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Utente deve essere volontario per partecipare", response.getBody());
    }

    @Test
    @DisplayName("TC_1.3.1_3: Partecipazione avvenuta con successo")
    void testAggiungiPartecipazione_Successo() {
        String email = "franco@gmail.com";
        when(util.extractRuolo(validToken)).thenReturn("Volontario");
        when(util.extractEmail(validToken)).thenReturn(email);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(evento);
        when(autenticazioneService.getUtente(email)).thenReturn(volontario);
        when(partecipazioneEventoService.listaPartecipazioni(idEvento)).thenReturn(new ArrayList<>());

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Aggiunta partecipazione avvenuta con successo", response.getBody());
    }

    // Mantengo anche gli altri test per completezza

    @Test
    void aggiungiPartecipazione_EventoNotFound() {
        when(util.extractRuolo(validToken)).thenReturn("Volontario");
        when(util.extractEmail(validToken)).thenReturn("franco@gmail.com");
        when(autenticazioneService.getUtente(anyString())).thenReturn(volontario);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(null);

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Evento non trovato", response.getBody());
    }

    @Test
    void aggiungiPartecipazione_VolontarioGiaPresente() {
        String email = "franco@gmail.com";
        when(util.extractRuolo(validToken)).thenReturn("Volontario");
        when(util.extractEmail(validToken)).thenReturn(email);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(evento);
        when(autenticazioneService.getUtente(email)).thenReturn(volontario);

        Partecipazione partecipazioneEsistente = new Partecipazione();
        partecipazioneEsistente.setVolontario(volontario);
        when(partecipazioneEventoService.listaPartecipazioni(idEvento)).thenReturn(List.of(partecipazioneEsistente));

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Volontario partecipa già all'evento", response.getBody());
    }

    @Test
    void aggiungiPartecipazione_EventoAlCompleto() {
        String email = "franco@gmail.com";
        when(util.extractRuolo(validToken)).thenReturn("Volontario");
        when(util.extractEmail(validToken)).thenReturn(email);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(evento);
        when(autenticazioneService.getUtente(email)).thenReturn(volontario);

        // Simula una lista di partecipazioni che ha raggiunto il limite
        evento.setMaxPartecipanti(1);
        List<Partecipazione> listaCompleta = new ArrayList<>();
        Utente altroVolontario = new Utente();
        altroVolontario.setEmail("altro@example.com");
        Partecipazione p = new Partecipazione();
        p.setVolontario(altroVolontario);
        listaCompleta.add(p);
        when(partecipazioneEventoService.listaPartecipazioni(idEvento)).thenReturn(listaCompleta);

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Numero di partecipanti al completo", response.getBody());
    }

    @Test
    void aggiungiPartecipazione_InternalServerError() {
        String email = "franco@gmail.com";
        when(util.extractRuolo(validToken)).thenReturn("Volontario");
        when(util.extractEmail(validToken)).thenReturn(email);
        when(partecipazioneEventoService.getEventoById(idEvento)).thenReturn(evento);
        when(autenticazioneService.getUtente(email)).thenReturn(volontario);
        when(partecipazioneEventoService.listaPartecipazioni(idEvento)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<String> response = partecipazioneEventoControl.aggiungiPartecipazione(validToken, idEvento);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Errore interno del server: DB error", response.getBody());
    }
}
