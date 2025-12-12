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
    private static final String PYTHON_SERVICE_URL = "http://localhost:5000";

    @Autowired
    public GREGAdapterService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(PYTHON_SERVICE_URL).build();
    }

    public VolontarioMatchResponse findMatchingVolunteers(VolontarioMatchRequest request) {
        return this.webClient.post()
                .uri("/ricercaGeografica") // Endpoint corretto del server Python
                .bodyValue(request)
                .retrieve()
                .bodyToMono(VolontarioMatchResponse.class)
                .block();
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VolontarioMatchRequest {
        private String strada;
        private Integer nCivico;
        private String citta;
        private String provincia;
        private String cap;

        private String category;
        private String subcategory;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
        public static class VolontarioMatchResponse {
            private List<String> volunteerEmails;
    }

}