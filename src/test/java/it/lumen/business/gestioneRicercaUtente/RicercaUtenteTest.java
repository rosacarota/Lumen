package it.lumen.business.gestioneRicercaUtente;

import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRicercaUtente.control.RicercaUtenteControl;
import it.lumen.business.gestioneRicercaUtente.service.GREGAdapterService;
import it.lumen.business.gestioneRicercaUtente.service.RicercaUtenteService;
import it.lumen.data.dto.UtenteDTO;
import it.lumen.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RicercaUtenteTest {

    @InjectMocks
    private RicercaUtenteControl ricercaUtenteControl;

    @Mock
    private RicercaUtenteService ricercaUtenteService;

    @Mock
    private GREGAdapterService gregAdapterService;

    @Mock
    private AutenticazioneService autenticazioneService;

    @Mock
    private JwtUtil jwtUtil;

    // TC_1.5.1_2: Nome troppo lungo
    @Test
    void testRicercaUtente_NomeTroppoLungo() {
        String nomeTroppoLungo = "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso";

        ResponseEntity<?> response = ricercaUtenteControl.ricercaUtente(nomeTroppoLungo);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertTrue(body.get("message").toString().contains("Il nome è troppo lungo"));

        verify(ricercaUtenteService, never()).getUtentiPerNome(anyString());
    }

    // TC_1.5.1_3: Nome valido
    @Test
    void testRicercaUtente_NomeValido() {
        String nomeValido = "Luca";
        UtenteDTO utenteDTO = new UtenteDTO();
        utenteDTO.setNome(nomeValido);
        List<UtenteDTO> expectedList = List.of(utenteDTO);

        when(ricercaUtenteService.getUtentiPerNome(nomeValido)).thenReturn(expectedList);

        ResponseEntity<?> response = ricercaUtenteControl.ricercaUtente(nomeValido);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedList, response.getBody());

        verify(ricercaUtenteService, times(1)).getUtentiPerNome(nomeValido);
    }
}
