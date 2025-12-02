package it.lumen.business.gestioneRicercaUtente.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class GREGAdapterService {

    private final WebClient webClient;
    private static final String PYTHON_SERVICE_URL = "http://localhost:8000"; // Assumi l'URL del tuo servizio Python

    @Autowired
    public GREGAdapterService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(PYTHON_SERVICE_URL).build();
    }

    /**
     * Chiama l'API Python per ottenere la lista di email dei volontari
     */
    public VolontarioMatchResponse findMatchingVolunteers(VolontarioMatchRequest request) {

        // Esegue una chiamata POST all'endpoint Python dedicato al matching
        return this.webClient.post()
                .uri("/api/volunteers/match") // Endpoint da definire nel tuo servizio Python
                .bodyValue(request) // Invia l'oggetto VolontarioMatchRequest come corpo JSON
                .retrieve()
                .bodyToMono(VolontarioMatchResponse.class) // Mappa la risposta JSON nella classe VolontarioMatchResponse
                .block(); // Utilizzo sincrono. Per un'applicazione reattiva, potresti restituire Mono<VolontarioMatchResponse>
    }

    // Java/src/main/java/com/example/dto/VolontarioMatchRequest.java
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VolontarioMatchRequest {
        private String cap; // Codice Postale (es. "20121")
        private String category;
        private String subcategory;
    }

    // Java/src/main/java/com/example/dto/VolontarioMatchResponse.java

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VolontarioMatchResponse {
        // La lista di email dei volontari che soddisfano i criteri di ricerca
        private List<String> volunteerEmails;

    }
}