package it.lumen.business.gestioneAccount;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import it.lumen.business.gestioneAccount.control.GestioneAccountControl;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.data.entity.Utente;
import it.lumen.security.JwtUtil;

@ExtendWith(MockitoExtension.class)
public class VisualizzazioneProfiloTest {


	@InjectMocks
	GestioneAccountControl gestioneAccountControl;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AutenticazioneService autenticazioneService;

	private Utente utente;
    private String token = "validToken";

	@BeforeEach
	void setUp(){

        utente = new Utente();
        utente.setEmail("test@lumen.it");
	}

	// TC_1.1.2_1: Formato dell'email non valido
	@Test
	void testVisualizzazioneProfilo_emailNonValido(){

        utente.setEmail("pasquale?.yepp");

        ResponseEntity<?> response = gestioneAccountControl.datiUtente(token);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Utente non autenticato", response.getBody());
        verify(autenticazioneService, never()).getUtente(Mockito.anyString());
	}
}
