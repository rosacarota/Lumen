package it.lumen.business.gestioneRegistrazione;

import it.lumen.business.gestioneRegistrazione.control.RegistrazioneControl;
import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.entity.Indirizzo;
import it.lumen.data.entity.Utente;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegistraUtenteTest {

    @InjectMocks
    private RegistrazioneControl registrazioneControl;

    @Mock
    private RegistrazioneService registrazioneService;

    @Mock
    private BindingResult bindingResult;

    private Utente utenteValido;
    private Indirizzo indirizzoValido;

    @BeforeEach
    void setUp() {
        indirizzoValido = new Indirizzo();
        indirizzoValido.setCitta("Angri");
        indirizzoValido.setProvincia("SA");
        indirizzoValido.setCap("84012");
        indirizzoValido.setStrada("Via Matteotti");
        indirizzoValido.setNCivico(3);

        utenteValido = new Utente();
        utenteValido.setNome("Pasquale");
        utenteValido.setCognome("Bianchi");
        utenteValido.setEmail("pasqualebianchi@gmail.com");
        utenteValido.setPassword("Pasquale32!");
        utenteValido.setRecapitoTelefonico("3346971117");
        utenteValido.setDescrizione("Sono Pasquale...");
        utenteValido.setRuolo(Utente.Ruolo.Volontario);
        utenteValido.setAmbito("Health");
        utenteValido.setImmagine("pasquale.jpg");
        utenteValido.setIndirizzo(indirizzoValido);
    }

    private void mockValidationErrors(String errorMessage) {
        when(bindingResult.hasErrors()).thenReturn(true);
        ObjectError error = new ObjectError("utente", errorMessage);
        when(bindingResult.getAllErrors()).thenReturn(List.of(error));
    }

    // TC_1.1.1_1: Nome troppo lungo
    @Test
    void testRegistrazione_NomeTroppoLungo() {
        String nomeTroppoLungo = "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y";
        utenteValido.setNome(nomeTroppoLungo);
        mockValidationErrors("Il nome è troppo lungo");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Il nome è troppo lungo"));
        verify(registrazioneService, never()).registraUtente(any());
    }

    // TC_1.1.1_2: Cognome troppo lungo
    @Test
    void testRegistrazione_CognomeTroppoLungo() {
        String cognomeTroppoLungo = "Wolfeschlegelsteinhausenbergerdorffvoralternwarengewissenhaftschaferswessenschafewarenwohlgepflegenvundsorgfaltigkeitbeschutzenvor";
        utenteValido.setCognome(cognomeTroppoLungo);
        mockValidationErrors("Il cognome è troppo lungo");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Il cognome è troppo lungo"));
    }

    // TC_1.1.1_3: Email formato non valido
    @Test
    void testRegistrazione_EmailNonValida() {
        utenteValido.setEmail("Pasqualebianchi.gmail.com");
        mockValidationErrors("Email non valida");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Email non valida"));
    }

    // TC_1.1.1_4: Password non abbastanza lunga
    @Test
    void testRegistrazione_PasswordCorta() {
        utenteValido.setPassword("1234");
        mockValidationErrors("La password non è abbastanza lunga");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("La password non è abbastanza lunga"));
    }

    // TC_1.1.1_5: Numero telefonico formato non valido
    @Test
    void testRegistrazione_TelefonoNonValido() {
        utenteValido.setRecapitoTelefonico("3PH74jnd94dn393!");
        mockValidationErrors("Il numero deve essere composto da 10 cifre");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Il numero deve essere composto da 10 cifre"));
    }

    // TC_1.1.1_6: Ruolo non valido
    @Test
    void testRegistrazione_RuoloNonValido() {
        // Simuliamo l'errore di binding che avverrebbe se il ruolo fosse invalido
        mockValidationErrors("Ruolo non valido o formato errato");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Ruolo non valido"));
    }

    // TC_1.1.1_7: Ambito troppo lungo
    @Test
    void testRegistrazione_AmbitoTroppoLungo() {
        String ambitoLungo = "Associazione di Volontariato per l'Assistenza Psicologica, Sociale e Riabilitativa dei Minori Vittime di Abbandono e Maltrattamenti";
        utenteValido.setAmbito(ambitoLungo);
        mockValidationErrors("L'ambito è troppo lungo");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("L'ambito è troppo lungo"));
    }

    // TC_1.1.1_8: Immagine formato sbagliato
    @Test
    void testRegistrazione_ImmagineFormatoErrato() {
        utenteValido.setImmagine("pasquale.mp4");
        mockValidationErrors("Formato immagine non supportato");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Formato immagine non supportato"));
    }

    // TC_1.1.1_9: CAP formato errato
    @Test
    void testRegistrazione_CapErrato() {
        indirizzoValido.setCap("8401m5");
        utenteValido.setIndirizzo(indirizzoValido);
        mockValidationErrors("Il CAP deve avere 5 cifre");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("Il CAP deve avere 5 cifre"));
    }

    // TC_1.1.1_10: Provincia formato errato
    @Test
    void testRegistrazione_ProvinciaErrata() {
        indirizzoValido.setProvincia("A61HBoewj73ksn103nsu");
        utenteValido.setIndirizzo(indirizzoValido);
        mockValidationErrors("La provincia è in un formato errato");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("La provincia è in un formato errato"));
    }

    // TC_1.1.1_11: Città troppo lunga
    @Test
    void testRegistrazione_CittaTroppoLunga() {
        String cittaLunga = "Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu";
        indirizzoValido.setCitta(cittaLunga);
        utenteValido.setIndirizzo(indirizzoValido);
        mockValidationErrors("La città è troppo lunga");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("La città è troppo lunga"));
    }

    // TC_1.1.1_12: Strada troppo lunga
    @Test
    void testRegistrazione_StradaTroppoLunga() {
        String stradaLunga = "Via lmsjiwqjiwoqjshqopkiqpopkuqnijaisjdiwqkqusoeknuddcidjcidoc";
        indirizzoValido.setStrada(stradaLunga);
        utenteValido.setIndirizzo(indirizzoValido);
        mockValidationErrors("La strada è troppo lunga");

        ResponseEntity<Map<String, String>> response = registrazioneControl.registraUtente(utenteValido, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").contains("La strada è troppo lunga"));
    }
}
