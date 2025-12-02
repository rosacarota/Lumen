package it.lumen.security;

import org.springframework.context.annotation.Bean; // Import necessario
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient; // Import necessario
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // --- Configurazione esistente per Resource Handlers ---

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/profile_images/**")
                .addResourceLocations("file:uploads/profile_images/");
    }

    // --- Configurazione WebClient per l'Adapter ---

    /**
     * Rende WebClient.Builder disponibile come Bean per l'autowiring nell'Adapter.
     */
    @Bean
    public WebClient.Builder webClientBuilder() {
        // Qui puoi configurare parametri globali del client come i timeout.
        return WebClient.builder();
    }

    /**
     * Configura un'istanza di WebClient specifica per il servizio Python.
     * Consigliato per mantenere l'URL in un unico punto (la configurazione).
     */
    private static final String PYTHON_SERVICE_URL = "http://localhost:8000";

    @Bean(name = "pythonWebClient")
    public WebClient pythonWebClient(WebClient.Builder builder) {
        return builder.baseUrl(PYTHON_SERVICE_URL).build();
    }
}