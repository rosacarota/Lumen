package it.lumen.business.gestioneEvento;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneEvento.control.GestioneEventoControl;
import it.lumen.business.gestioneEvento.service.GestioneEventoService;
import it.lumen.data.entity.Evento;
import it.lumen.data.entity.Indirizzo;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ModificaEventoTest {

    @InjectMocks
    private GestioneEventoControl gestioneEventoControl;

    @Mock
    private GestioneEventoService gestioneEventoService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AutenticazioneService autenticazioneService;

    private Evento eventoValido;
    private Indirizzo indirizzoValido;
    private Utente utente;
    private String token = "validToken";
    private final int EXISTING_EVENT_ID = 1;

    @BeforeEach
    void setUp() {
        // Setup Indirizzo (Luogo)
        indirizzoValido = new Indirizzo();
        indirizzoValido.setCitta("Avellino");
        indirizzoValido.setStrada("Via dei Goti");
        indirizzoValido.setNCivico(5);
        indirizzoValido.setProvincia("AV");
        indirizzoValido.setCap("83100");

        // Setup User
        utente = new Utente();
        utente.setEmail("test@lumen.it");

        // Setup Evento
        eventoValido = new Evento();
        eventoValido.setIdEvento(EXISTING_EVENT_ID);
        eventoValido.setTitolo("Giornata ecologia");
        eventoValido.setDescrizione("Giornata dedicata alla pulizia del parco");
        eventoValido.setDataInizio(Date.valueOf(LocalDate.of(2026, 10, 25)));
        eventoValido.setDataFine(Date.valueOf(LocalDate.of(2026, 10, 25)));
        eventoValido.setIndirizzo(indirizzoValido);
        eventoValido.setMaxPartecipanti(66);
        eventoValido.setImmagine("data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="); // Mock valid base64 jpg
        eventoValido.setUtente(utente);

        // Common Mocks
        lenient().when(jwtUtil.extractEmail(token)).thenReturn("test@lumen.it");
        lenient().when(autenticazioneService.getUtente("test@lumen.it")).thenReturn(utente);
        
        // Mocking existence and ownership checks
        lenient().when(gestioneEventoService.checkId(EXISTING_EVENT_ID)).thenReturn(true);
        lenient().when(gestioneEventoService.getEventoById(EXISTING_EVENT_ID)).thenReturn(eventoValido);
    }

    // TC_1.3.3_1: Titolo vuoto
    @Test
    void testModificaEvento_TitoloVuoto() {
        eventoValido.setTitolo("");

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        // Oracle: La modifica non va a buon fine
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // TC_1.3.3_1 (Variant): Titolo troppo lungo
    @Test
    void testModificaEvento_TitoloTroppoLungo() {
        String titoloLungo = "Giornata dedicata alla riqualificazione del quartiere: pulizia strade e cortili, raccolta rifiuti, sistemazione delle aree verdi e momenti di ascolto con le famiglie del territorio per creare un ambiente più vivibile e rafforzare il senso di comunità tra cittadini, volontari ed enti locali.";
        eventoValido.setTitolo(titoloLungo);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // TC_1.3.3_1 (Variant): Titolo valido
    @Test
    void testModificaEvento_TitoloValido() {
        eventoValido.setTitolo("Ecologia Day");
        when(gestioneEventoService.modificaEvento(any(Evento.class))).thenReturn(eventoValido);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody().contains("successo"));
    }

    // TC_1.3.3_2: Descrizione vuota
    @Test
    void testModificaEvento_DescrizioneVuota() {
        eventoValido.setDescrizione("");

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // TC_1.3.3_2 (Variant): Descrizione valida
    @Test
    void testModificaEvento_DescrizioneValida() {
        eventoValido.setDescrizione("Giornata dedicata alla riqualificazione del quartiere: pulizia strade e cortili, raccolta rifiuti, sistemazione delle aree verdi e momenti di ascolto con le famiglie del territorio");
        when(gestioneEventoService.modificaEvento(any(Evento.class))).thenReturn(eventoValido);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    // TC_1.3.3_3: Data passata
    @Test
    void testModificaEvento_DataPassata() {
        eventoValido.setDataInizio(Date.valueOf(LocalDate.of(2023, 5, 5)));

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // TC_1.3.3_3 (Variant): Data valida futura
    @Test
    void testModificaEvento_DataFutura() {
        eventoValido.setDataInizio(Date.valueOf(LocalDate.of(2026, 12, 3)));
        when(gestioneEventoService.modificaEvento(any(Evento.class))).thenReturn(eventoValido);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    // TC_1.3.3_4: Luogo mancante (vuoto)
    @Test
    void testModificaEvento_LuogoVuoto() {
        eventoValido.setIndirizzo(null);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // TC_1.3.3_4 (Variant): Luogo valido
    @Test
    void testModificaEvento_LuogoValido() {
        Indirizzo nuovoLuogo = new Indirizzo();
        nuovoLuogo.setCitta("Salerno");
        nuovoLuogo.setStrada("Piazza della Libertà");
        eventoValido.setIndirizzo(nuovoLuogo);
        
        when(gestioneEventoService.modificaEvento(any(Evento.class))).thenReturn(eventoValido);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    // TC_1.3.3_5: Max partecipanti negativo
    @Test
    void testModificaEvento_MaxPartecipantiNegativo() {
        eventoValido.setMaxPartecipanti(-3);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // TC_1.3.3_5 (Variant): Max partecipanti valido
    @Test
    void testModificaEvento_MaxPartecipantiValido() {
        eventoValido.setMaxPartecipanti(100);
        when(gestioneEventoService.modificaEvento(any(Evento.class))).thenReturn(eventoValido);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    // TC_1.3.3_6: Immagine formato non valido
    @Test
    void testModificaEvento_ImmagineFormatoErrato() {
        String mp4Base64 = "data:video/mp4;base64,AAAAHGZ0eXBNU";
        eventoValido.setImmagine(mp4Base64);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        // Oracle: La modifica non va a buon fine
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
    
    // TC_1.3.3_7: Immagine valida
    @Test
    void testModificaEvento_ImmagineValida() {
        // immagine valida jpg set in setUp
        when(gestioneEventoService.modificaEvento(any(Evento.class))).thenReturn(eventoValido);

        ResponseEntity<String> response = gestioneEventoControl.modificaEvento(eventoValido, token);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
}
