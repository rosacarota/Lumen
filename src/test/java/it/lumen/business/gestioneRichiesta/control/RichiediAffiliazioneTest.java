package it.lumen.business.gestioneRichiesta.control;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRichiesta.service.AffiliazioneService;
import it.lumen.data.entity.Affiliazione;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RichiediAffiliazioneTest {

    @InjectMocks
    private AffiliazioneControl affiliazioneControl;

    @Mock
    private AffiliazioneService affiliazioneService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AutenticazioneService autenticazioneService;

    private Utente volontario;
    private Utente ente;
    private Affiliazione affiliazione;
    private String token;

    @BeforeEach
    void setUp() {
        token = "valid_token";

        volontario = new Utente();
        volontario.setEmail("pasqualebianchi@gmail.com");
        volontario.setRuolo(Utente.Ruolo.Volontario);

        ente = new Utente();
        ente.setEmail("Uniciock@gmail.it");
        ente.setRuolo(Utente.Ruolo.Ente);

        affiliazione = new Affiliazione();
        // Affiliazione needs an Ente inside it for the request body
        // The service usually expects the Ente object to be populated with at least the
        // email
        // based on: if (affiliazione.getEnte() == null ||
        // affiliazione.getEnte().getEmail() == null)
        Utente enteInRequest = new Utente();
        enteInRequest.setEmail("Uniciock@gmail.it");
        affiliazione.setEnte(enteInRequest);
    }

    // TC_1.4.1_1: Utente non trovato
    @Test
    void testRichiediAffiliazione_UtenteNonTrovato() {
        // Input: Email empty (simulated by returning email from token, but findByName
        // returns null)
        // Adjusting based on user input: "Email" is empty in the table.
        // In the code: String email = jwtUtil.extractEmail(token);
        // If that email is used to find user and user is null -> "Utente non trovato".

        when(jwtUtil.extractEmail(token)).thenReturn("");
        when(autenticazioneService.getUtente("")).thenReturn(null);

        ResponseEntity<String> response = affiliazioneControl.richiediAffiliazione(affiliazione, token);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Utente non trovato", response.getBody());
    }

    // TC_1.4.1_2: Ruolo non Volontario (e.g. Empty or other)
    @Test
    void testRichiediAffiliazione_RuoloNonVolontario() {
        // User Input: Ruolo is empty/invalid.
        // We simulate a user that exists but has no role or wrong role?
        // Code checks: if (richiedente.getRuolo() != Utente.Ruolo.Volontario)
        // Let's set role to null or Ente to trigger this. The TC says "Ruolo" is empty.
        // If role field is null, the check (null != Volontario) is true.

        volontario.setRuolo(null);

        when(jwtUtil.extractEmail(token)).thenReturn(volontario.getEmail());
        when(autenticazioneService.getUtente(volontario.getEmail())).thenReturn(volontario);

        ResponseEntity<String> response = affiliazioneControl.richiediAffiliazione(affiliazione, token);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Solo i volontari possono richiedere l'affiliazione", response.getBody());
    }

    // TC_1.4.1_3: Ente destinatario mancante (Email Ente empty)
    @Test
    void testRichiediAffiliazione_EnteEmailMancante() {
        // Input: Email Ente is empty.
        // Code check: if (affiliazione.getEnte() == null ||
        // affiliazione.getEnte().getEmail() == null)

        affiliazione.getEnte().setEmail(null);

        when(jwtUtil.extractEmail(token)).thenReturn(volontario.getEmail());
        when(autenticazioneService.getUtente(volontario.getEmail())).thenReturn(volontario);

        ResponseEntity<String> response = affiliazioneControl.richiediAffiliazione(affiliazione, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Ente destinatario mancante", response.getBody());
    }

    // TC_1.4.1_4: Ruolo Ente non valido
    @Test
    void testRichiediAffiliazione_RuoloEnteNonValido() {
        // Input: Ruolo Ente is empty (or just not 'Ente').
        // Code flow:
        // String emailEnte = affiliazione.getEnte().getEmail();
        // Utente ente = autenticazioneService.getUtente(emailEnte);
        // if (ente.getRuolo() != Utente.Ruolo.Ente)

        // We mock that the user found by the ente email exists but has wrong role
        Utente fakeEnte = new Utente();
        fakeEnte.setRuolo(null); // Or Volontario, just not Ente

        when(jwtUtil.extractEmail(token)).thenReturn(volontario.getEmail());
        when(autenticazioneService.getUtente(volontario.getEmail())).thenReturn(volontario);
        when(autenticazioneService.getUtente(affiliazione.getEnte().getEmail())).thenReturn(fakeEnte);

        ResponseEntity<String> response = affiliazioneControl.richiediAffiliazione(affiliazione, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Puoi fare la richiesta solo ad un ente", response.getBody());
    }

    // TC_1.4.1_5: Successo
    @Test
    void testRichiediAffiliazione_Successo() {
        when(jwtUtil.extractEmail(token)).thenReturn(volontario.getEmail());
        when(autenticazioneService.getUtente(volontario.getEmail())).thenReturn(volontario);

        // Mock retrieving the ente
        when(autenticazioneService.getUtente(affiliazione.getEnte().getEmail())).thenReturn(ente);

        // Mock checkAffiliazione returning false (no existing affiliation)
        when(affiliazioneService.checkAffiliazione(volontario.getEmail())).thenReturn(false);

        // Mock success void method
        doNothing().when(affiliazioneService).richiediAffiliazione(any(Affiliazione.class));

        ResponseEntity<String> response = affiliazioneControl.richiediAffiliazione(affiliazione, token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Richiesta di affiliazione inviata con successo", response.getBody());

        verify(affiliazioneService, times(1)).richiediAffiliazione(any(Affiliazione.class));
    }
}
