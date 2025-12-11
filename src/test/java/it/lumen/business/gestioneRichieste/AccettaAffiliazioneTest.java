package it.lumen.business.gestioneRichieste;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRichiesta.control.AffiliazioneControl;
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
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccettaAffiliazioneTest {

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
    private final String token = "test-token";
    private final Integer idAffiliazione = 1;

    @BeforeEach
    void setUp() {
        volontario = new Utente();
        volontario.setEmail("volontario@lumen.it");
        volontario.setRuolo(Utente.Ruolo.Volontario);

        ente = new Utente();
        ente.setEmail("ente@lumen.it");
        ente.setRuolo(Utente.Ruolo.Ente);

        affiliazione = new Affiliazione();
        affiliazione.setIdAffiliazione(idAffiliazione);
        affiliazione.setVolontario(volontario);
        affiliazione.setEnte(ente);
        affiliazione.setStato(Affiliazione.StatoAffiliazione.InAttesa);
    }

    /**
     * TC_1.4.2_1: L'accettazione non va a buon fine perché il formato dell’email non è valido.
     * Interpreto questo come un utente non trovato/autenticato a causa di un'email non valida.
     */
    @Test
    void testAccettaAffiliazione_EmailNonValida() {
        String invalidEmail = "Pasquale?.yepp";
        when(jwtUtil.extractEmail(token)).thenReturn(invalidEmail);
        when(autenticazioneService.getUtente(invalidEmail)).thenReturn(null);

        ResponseEntity<String> response = affiliazioneControl.accettaAffiliazione(idAffiliazione, token);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Utente non autenticato", response.getBody());
        verify(affiliazioneService, never()).accettaAffiliazione(anyInt());
    }

    /**
     * TC_1.4.2_2: L'accettazione non va a buon fine perché il ruolo non è né Volontario né Ente.
     * Interpreto questo come un utente con un ruolo non coinvolto (es. Beneficiario) che tenta di accettare.
     */
    @Test
    void testAccettaAffiliazione_RuoloNonCoinvolto() {
        Utente beneficiario = new Utente();
        beneficiario.setEmail("beneficiario@lumen.it");
        beneficiario.setRuolo(Utente.Ruolo.Beneficiario);

        when(jwtUtil.extractEmail(token)).thenReturn(beneficiario.getEmail());
        when(autenticazioneService.getUtente(beneficiario.getEmail())).thenReturn(beneficiario);
        when(affiliazioneService.getAffiliazione(idAffiliazione)).thenReturn(affiliazione);

        ResponseEntity<String> response = affiliazioneControl.accettaAffiliazione(idAffiliazione, token);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Non hai i permessi per accettare questa richiesta", response.getBody());
        verify(affiliazioneService, never()).accettaAffiliazione(anyInt());
    }

    /**
     * Test per il caso di successo in cui l'ente accetta la richiesta.
     */
    @Test
    void testAccettaAffiliazione_Successo() {
        when(jwtUtil.extractEmail(token)).thenReturn(ente.getEmail());
        when(autenticazioneService.getUtente(ente.getEmail())).thenReturn(ente);
        when(affiliazioneService.getAffiliazione(idAffiliazione)).thenReturn(affiliazione);
        doNothing().when(affiliazioneService).accettaAffiliazione(idAffiliazione);

        ResponseEntity<String> response = affiliazioneControl.accettaAffiliazione(idAffiliazione, token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Affiliazione accettata con successo", response.getBody());
        verify(affiliazioneService, times(1)).accettaAffiliazione(idAffiliazione);
    }

     /**
     * TC_1.4.2_3: L'accettazione non va a buon fine perché il ruolo non è in un formato valido.
     * Questo caso è complesso da testare a livello di unit test poiché l'errore di "formato non valido"
     * per un campo enum come Ruolo avviene tipicamente a livello di deserializzazione del JSON,
     * che richiederebbe un test di integrazione con il contesto Spring MVC.
     * Un'altra interpretazione è che il recupero dell'utente fallisca in modo imprevisto.
     */
    @Test
    void testAccettaAffiliazione_ErroreGenerico() {
        when(jwtUtil.extractEmail(token)).thenReturn(ente.getEmail());
        when(autenticazioneService.getUtente(ente.getEmail())).thenReturn(ente);
        when(affiliazioneService.getAffiliazione(idAffiliazione)).thenThrow(new RuntimeException("Errore database"));

        ResponseEntity<String> response = affiliazioneControl.accettaAffiliazione(idAffiliazione, token);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Errore nell'accettazione: Errore database"));
    }
}
