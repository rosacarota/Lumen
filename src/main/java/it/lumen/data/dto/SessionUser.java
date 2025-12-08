package it.lumen.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Classe semplice per rappresentare le informazioni essenziali dell'utente in
 * sessione.
 */
@Getter
@Setter
@AllArgsConstructor
public class SessionUser {
    /** Token di autenticazione o sessione. */
    private String token;
    /** Ruolo dell'utente connesso. */
    private String ruolo;
}
