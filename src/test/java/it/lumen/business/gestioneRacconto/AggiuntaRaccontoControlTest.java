package it.lumen.business.gestioneRacconto;

import org.junit.jupiter.api.*;
import it.lumen.business.gestioneAutenticazione.service.AutenticazioneService;
import it.lumen.business.gestioneRacconto.control.GestioneRaccontoControl;
import it.lumen.business.gestioneRacconto.service.GestioneRaccontoService;
import it.lumen.data.entity.Racconto;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

    @ExtendWith(MockitoExtension.class)
    public class AggiuntaRaccontoControlTest {

        @InjectMocks
        private GestioneRaccontoControl gestioneRaccontoControl;

        @Mock
        private GestioneRaccontoService gestioneRaccontoService;

        @Mock
        private JwtUtil jwtUtil;

        @Mock
        private AutenticazioneService autenticazioneService;

        private Racconto racconto;
        private Utente utente;
        private String token = "validToken";
        private final int idRacconto = 1;

        @BeforeEach
        void setUp() {

            utente= new Utente();
            utente.setEmail("pasquale@lumen.it");
            utente.setNome("Pasquale");
            utente.setCognome("Bianchi");

            racconto = new Racconto();
            racconto.setTitolo("Vi racconto la storia della mia vita, da quando da giovane lasciai il mio piccolo paese tra le montagne del sud sperando in un futuro migliore.");
            racconto.setDescrizione("Voglio raccontarvi della povertà che da sempre soffoca il mio paese d’origine: strade rotte, case che cadono a pezzi, famiglie che vivono di sacrifici e speranze mai realizzate. Ogni inverno il freddo entra dai muri, ogni estate il lavoro manca, e i giovani sono costretti a partire per cercare altrove un futuro che le loro radici non possono offrirgli. Sogno di tornare un giorno e portare un cambiamento reale, aiutando chi è rimasto a costruire una vita dignitosa e finalmente libera dal bisogno.");
            racconto.setUtente(utente);
            racconto.setImmagine("data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");


            // Common Mocks
            lenient().when(jwtUtil.extractEmail(token)).thenReturn("pasquale@lumen.it");
            lenient().when(autenticazioneService.getUtente("pasquale@lumen.it")).thenReturn(utente);

            // Mocking existence and ownership checks
            lenient().when(gestioneRaccontoService.checkId(idRacconto)).thenReturn(true);
            lenient().when(gestioneRaccontoService.getByIdRaccontoRaw(idRacconto)).thenReturn(racconto);
        }

        // TC_1.2.1_1: Titolo troppo lungo
        @Test
        void testAggiuntaRacconto_TitoloTroppoLungo_SenzaImmagine() {
            racconto.setImmagine(null);
            String titoloLungo= "Vi racconto la storia della mia vita, da quando da giovane lasciai il mio piccolo paese tra le montagne del sud sperando in un futuro migliore, ma non riuscii mai a dimenticare la povertà che divorava la mia terra d’origine, le famiglie senza lavoro, i bambini senza scuole e le strade che cadevano a pezzi mentre lottavo per cambiare il destino della mia gente.";
            racconto.setTitolo(titoloLungo);

            ResponseEntity<Racconto> response = gestioneRaccontoControl.aggiuntaRacconto(racconto, token);

            // Oracle: La modifica non va a buon fine
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        // TC_1.2.1_2: Titolo troppo lungo
        @Test
        void testAggiuntaRacconto_TitoloTroppoLungo_ConImmagine() {

            // immagine di default
            String titoloLungo= "Vi racconto la storia della mia vita, da quando da giovane lasciai il mio piccolo paese tra le montagne del sud sperando in un futuro migliore, ma non riuscii mai a dimenticare la povertà che divorava la mia terra d’origine, le famiglie senza lavoro, i bambini senza scuole e le strade che cadevano a pezzi mentre lottavo per cambiare il destino della mia gente.";
            racconto.setTitolo(titoloLungo);

            ResponseEntity<Racconto> response = gestioneRaccontoControl.aggiuntaRacconto(racconto, token);

            // Oracle: La modifica non va a buon fine
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
           // assertTrue(response.getBody().get("message").contains("La password non è abbastanza lunga"));
        }

        // TC_1.2.1_3 (Variant): Titolo vuoto
        @Test
        void testAggiuntaRacconto_TitoloVuoto_SenzaImmagine() {
            racconto.setImmagine(null);
            racconto.setTitolo("");

            ResponseEntity<Racconto> response = gestioneRaccontoControl.aggiuntaRacconto(racconto, token);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        // TC_1.2.1_4 (Variant): Titolo vuoto
        @Test
        void testAggiuntaRacconto_TitoloVuoto_ConImmagine() {

            // immagine di default
            racconto.setTitolo("");

            ResponseEntity<Racconto> response = gestioneRaccontoControl.aggiuntaRacconto(racconto, token);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }


        // TC_1.2.1_5: Immagine formato non valido
        @Test
        void testModificaEvento_ImmagineFormatoErrato() {
            String mp4Base64 = "data:video/mp4;base64,AAAAHGZ0eXBNU";
            racconto.setImmagine(mp4Base64);

            ResponseEntity<Racconto> response = gestioneRaccontoControl.aggiuntaRacconto(racconto, token);

            // Oracle: La modifica non va a buon fine
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        // TC_1.3.3_6: Racconto valido
        @Test
        void testModificaEvento_RaccontoValido() {
            // immagine valida jpg set in setUp
            when(gestioneRaccontoService.aggiungiRacconto(any(Racconto.class))).thenReturn(racconto);

            ResponseEntity<Racconto> response = gestioneRaccontoControl.aggiuntaRacconto(racconto, token);

            assertEquals(HttpStatus.CREATED, response.getStatusCode());
        }

}

