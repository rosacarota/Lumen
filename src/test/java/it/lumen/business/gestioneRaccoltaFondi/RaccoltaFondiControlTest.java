package it.lumen.business.gestioneRaccoltaFondi;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRaccoltaFondi.control.RaccoltaFondiControl;
import it.lumen.business.gestioneRaccoltaFondi.service.RaccoltaFondiService;
import it.lumen.data.entity.RaccoltaFondi;
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
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RaccoltaFondiControlTest {

    @InjectMocks
    private RaccoltaFondiControl raccoltaFondiControl;

    @Mock
    private RaccoltaFondiService raccoltaFondiService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BindingResult bindingResult;

    @Mock
    private AutenticazioneService autenticazioneService;


    private Utente utenteValido;
    private RaccoltaFondi raccoltaFondiValida;
    private final String token = "test-token";
    private final Integer idAffiliazione = 1;

    @BeforeEach
    public void setUp() {

        utenteValido = new Utente();
        utenteValido.setEmail("uniciock@gmail.com");
        utenteValido.setRuolo(Utente.Ruolo.Ente);

        raccoltaFondiValida = new RaccoltaFondi();
        raccoltaFondiValida.setIdRaccoltaFondi(idAffiliazione);
        raccoltaFondiValida.setEnte(utenteValido);
        raccoltaFondiValida.setTitolo("Raccolta fondi per il Kenya");
        raccoltaFondiValida.setDescrizione(null);
        raccoltaFondiValida.setObiettivo(new BigDecimal("1000.00"));
        raccoltaFondiValida.setDataApertura(Date.valueOf(LocalDate.now()));
        raccoltaFondiValida.setDataChiusura(Date.valueOf("2026-10-03"));



    }

    private void mockValidationErrors(String errorMessage) {
        when(bindingResult.hasErrors()).thenReturn(true);
        ObjectError error = new ObjectError("utente", errorMessage);
        when(bindingResult.getAllErrors()).thenReturn(List.of(error));
    }

    /**
     * TC_1.3.4_1: L'avvio della raccolta fondi non va a buon fine perché il titolo non è stato inserito
     */
    @Test
    void testRaccoltaFondi_TitoloNonInserito(){

        raccoltaFondiValida.setTitolo(null);

        mockValidationErrors("Il titolo non è stato inserito");

        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Il titolo non è stato inserito"));

        verify(jwtUtil, never()).extractEmail(anyString());
        verify(raccoltaFondiService, never()).avviaRaccoltaFondi(any(RaccoltaFondi.class));

    }
    /**
     * TC_1.3.4_2: L’avvio della raccolta fondi non va a buon fine perché la lunghezza del titolo supera il limite di caratteri.
     */
    @Test
    void testRaccoltaFondi_TitoloTroppoLungo(){
        raccoltaFondiValida.setTitolo("Aiuta il Kenya: porta acqua, cibo e istruzione alle comunità vulnerabili. Il tuo contributo trasforma vite e dona speranza reale. Insieme possiamo costruire un futuro migliore per chi ne ha più bisogno. Dona ora e fai la differenza salvando delle vite! ");
        mockValidationErrors("Il titolo è troppo lungo");
        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Il titolo è troppo lungo"));
        verify(jwtUtil, never()).extractEmail(anyString());
        verify(raccoltaFondiService, never()).avviaRaccoltaFondi(any(RaccoltaFondi.class));

    }
    /**
     * TC_1.3.4_3: L’avvio della raccolta fondi non va a buon fine perché l’obiettivo non è stato inserito.
     */
    @Test
    void testRaccoltaFondi_ObiettivoNonInserito(){
        raccoltaFondiValida.setObiettivo(null);
        mockValidationErrors("L'obiettivo non è stato inserito");
        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("L'obiettivo non è stato inserito"));
        verify(jwtUtil, never()).extractEmail(anyString());
        verify(raccoltaFondiService, never()).avviaRaccoltaFondi(any(RaccoltaFondi.class));
    }

    /**
     * TC_1.3.4_4: L’avvio della raccolta fondi non va a buon fine perché il formato dell’obiettivo è errato.
     */
    @Test
    void testRaccoltaFondi_ObiettivoErrato(){
        raccoltaFondiValida.setObiettivo(new BigDecimal("-1000"));
        mockValidationErrors("L'obiettivo non rispetta il formato prestabilito");
        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("L'obiettivo non rispetta il formato prestabilito"));
        verify(jwtUtil, never()).extractEmail(anyString());
        verify(raccoltaFondiService, never()).avviaRaccoltaFondi(any(RaccoltaFondi.class));

    }

    /**
     * TC_1.3.4_5: L’avvio della raccolta fondi non va a buon fine perché la data di chiusura non è stata inserita.
     */
    @Test
    void testRaccoltaFondi_DataDiChiusuraNonInserita(){
        raccoltaFondiValida.setDataChiusura(null);
        mockValidationErrors("La data di chiusura non è stata inserita");
        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("La data di chiusura non è stata inserita"));
        verify(jwtUtil, never()).extractEmail(anyString());
        verify(raccoltaFondiService, never()).avviaRaccoltaFondi(any(RaccoltaFondi.class));

    }
    /**
     * TC_1.3.4_6: L’avvio della raccolta fondi non va a buon fine perché la data di chiusura precede la data di avvio della raccolta.
     */
    @Test
    void testRaccoltaFondi_DataDiChiusuraErrata(){
        raccoltaFondiValida.setDataChiusura(Date.valueOf("1900-01-01"));
        when(bindingResult.hasErrors()).thenReturn(false);
        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("La data di avvio deve precedere la data di fine"));
        verify(jwtUtil, never()).extractEmail(anyString());
        verify(raccoltaFondiService, never()).avviaRaccoltaFondi(any(RaccoltaFondi.class));


    }

    /**
     * TC_1.3.4_7: L’avvio della raccolta fondi va a buon fine.
     */
    @Test
    void testRaccoltaFondi_Successo(){
        when(bindingResult.hasErrors()).thenReturn(false);
        when(jwtUtil.extractEmail(token)).thenReturn(utenteValido.getEmail());
        when(autenticazioneService.getUtente(utenteValido.getEmail())).thenReturn(utenteValido);
        ResponseEntity<String> response = raccoltaFondiControl.avvioRaccoltaFondi(raccoltaFondiValida, bindingResult, token);
        System.out.println(">>> DEBUG BODY: [" + response.getBody() + "]");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("avviata con successo"));
        verify(raccoltaFondiService, times(1)).avviaRaccoltaFondi(raccoltaFondiValida);
        assertEquals(utenteValido, raccoltaFondiValida.getEnte());
    }


}

