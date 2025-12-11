package it.lumen.business.gestioneAccount;

import it.lumen.business.gestioneAccount.control.GestioneAccountControl;
import it.lumen.business.gestioneAccount.service.GestioneAccountService;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ModificaProfiloTest {

    @InjectMocks
    private GestioneAccountControl gestioneAccountControl;

    @Mock
    private GestioneAccountService gestioneAccountService;

    @Mock
    private AutenticazioneService autenticazioneService;

    @Mock
    private JwtUtil jwtUtil;

    private Utente utenteValido;
    private Indirizzo indirizzoValido;

    @BeforeEach
    void setUp() {
        indirizzoValido = new Indirizzo();
        indirizzoValido.setCitta("Salerno");
        indirizzoValido.setProvincia("SA");
        indirizzoValido.setCap("84129");
        indirizzoValido.setStrada("Via Donato Somma");
        indirizzoValido.setNCivico(18);

        utenteValido = new Utente();
        utenteValido.setEmail("giovanni@example.com");
        utenteValido.setNome("Giovanni Pio");
        utenteValido.setCognome("Scardone");
        utenteValido.setPassword("Password123!");
        utenteValido.setRecapitoTelefonico("3891246847");
        utenteValido.setDescrizione("Descrizione valida");
        utenteValido.setRuolo(Utente.Ruolo.Volontario);
        utenteValido.setAmbito("Health");
        utenteValido.setImmagine("data:image/jpeg;base64,valid-base64-string");
        utenteValido.setIndirizzo(indirizzoValido);

        when(jwtUtil.extractEmail(anyString())).thenReturn("giovanni@example.com");
        // Return a new user object to be populated by the controller
        lenient().when(autenticazioneService.getUtente(anyString())).thenReturn(new Utente());
    }

    // TC_1.1.3_1: Nome troppo lungo
    @Test
    void testModificaUtente_NomeTroppoLungo() {
        utenteValido.setNome("Uvuvwevwevwe Onyetenyevwe Ugwemubwem Ossas Uvuvwevwevwe Onyetenyevwe Ugwemubwem Ossas Uvuvwevwevwe Onyetenyevwe Ugwemubwem Ossas");

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Nome non valido", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_2: Cognome troppo lungo
    @Test
    void testModificaUtente_CognomeTroppoLungo() {
        utenteValido.setCognome("KkwazzawazzakkwaquikkwalaquazazzabolazzaKkwazzawazzakkwaquikkwalaquazazzabolazzaKkwazzawazzakkwaquikkwalaquazazzabolazza");

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Cognome non valido", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_3: Numero Telefonico formato non valido
    @Test
    void testModificaUtente_NumeroTelefonicoNonValido() {
        utenteValido.setRecapitoTelefonico("3PH74jnd94dn393!");

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Numero di telefono non valido", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_4: Ambito troppo lungo
    @Test
    void testModificaUtente_AmbitoTroppoLungo() {
        utenteValido.setAmbito("Associazione di Volontariato per l'Assistenza Psicologica, Sociale e Riabilitativa dei Minori Vittime di Abbandono e Maltrattamenti");

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Ambito non valido", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_5: Immagine formato non valido
    @Test
    void testModificaUtente_ImmagineFormatoNonValido() {
        // Use a base64 string that does not represent a valid image format header
        utenteValido.setImmagine("data:video/mp4;base64,AAAA");

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Formato non valido (ammessi: JPG, PNG, GIF, WEBP)", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_6: CAP formato non valido
    @Test
    void testModificaUtente_CapNonValido() {
        indirizzoValido.setCap("8401m5");
        utenteValido.setIndirizzo(indirizzoValido);

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Cap non valido", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_7: Provincia formato non valido (troppo lunga)
    @Test
    void testModificaUtente_ProvinciaNonValida() {
        indirizzoValido.setProvincia("A61HBoewj73ksn103nsuo10293829einbuyowu190ieuhb9247uhusjdh043iuj8fsni83h");
        utenteValido.setIndirizzo(indirizzoValido);

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Provincia non valida", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_8: Città troppo lunga
    @Test
    void testModificaUtente_CittaTroppoLunga() {
        indirizzoValido.setCitta("Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahufejiuwfbcdinq9chwneifwb");
        utenteValido.setIndirizzo(indirizzoValido);

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Citta non valida", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }

    // TC_1.1.3_9: Strada troppo lunga
    @Test
    void testModificaUtente_StradaTroppoLunga() {
        indirizzoValido.setStrada("VialmsjiwqjiwoqjshqopKiqpopkuqnijai sjdiwqkqusoeknuddcidjcidoc2u4398thr22 9ionoru2 ewfhu2ri29ur8hfeduqwibewfi21 ur9823oi428 fhw924 uf83ifhr348gf3uibwkeh3847fg 309uhbieuo8y44 g93yu 58bw824u83gfqh294ut398gh7348gfhb389yf9384g583yt9yhgb5ug o2h4892gfqbei284gf7i247842 bfi48hy348vt4ug853yfg834g5u89 h54bug4in548g7th439cg7f73f7vynhv7");
        utenteValido.setIndirizzo(indirizzoValido);

        ResponseEntity<?> response = gestioneAccountControl.modificaUtente(utenteValido, "token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Strada non valida", response.getBody());
        verify(gestioneAccountService, never()).modificaUtente(any());
    }
}
