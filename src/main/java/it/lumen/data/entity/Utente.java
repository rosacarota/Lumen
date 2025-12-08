package it.lumen.data.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import javax.validation.constraints.Pattern;
import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
@Table(name = "Utente")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
/**
 * Entity generica che rappresenta un utente del sistema (Volontario,
 * Beneficiario, Ente).
 */
public class Utente implements Serializable {

    /**
     * Enumerazione per i ruoli possibili dell'utente.
     */
    public enum Ruolo {
        Volontario,
        Beneficiario,
        Ente
    }

    /**
     * Email dell'utente, funge da identificativo univoco.
     */
    @Id
    @Column(name = "email", nullable = false, length = 255)
    @Email(message = "Email non valida")
    private String email;

    /**
     * Nome dell'utente.
     */
    @NotBlank(message = "Un nome è obbligatorio")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    /**
     * Cognome dell'utente.
     */
    @Column(name = "cognome", nullable = false, length = 100)
    private String cognome;

    /**
     * Indirizzo associato all'utente.
     */
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "Indirizzo")
    private Indirizzo indirizzo;

    /**
     * Hash della password dell'utente.
     */
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    /**
     * Descrizione o biografia dell'utente.
     */
    @Column(name = "descrizione", nullable = false)
    private String descrizione;

    /**
     * Numero di telefono dell'utente (10 cifre).
     */
    @Pattern(regexp = "\\d{10}", message = "Il numero deve essere composto da 10 cifre")
    @Column(name = "recapitotelefonico", nullable = true, length = 10)
    private String recapitoTelefonico;

    /**
     * Ruolo dell'utente nel sistema.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "ruolo", nullable = false)
    @NotNull(message = "Il ruolo non può essere nullo")
    private Utente.Ruolo ruolo;

    /**
     * Ambito di operatività (rilevante soprattutto per Enti).
     */
    @Column(name = "ambito", nullable = true, length = 100)
    private String ambito;

    /**
     * Percorso o URL dell'immagine del profilo.
     */
    @Column(name = "immagine", nullable = true)
    @Pattern(regexp = "^[a-zA-Z0-9\\s._/\\\\:-]*\\.(jpg|jpeg|png|gif|webp)$", message = "Formato immagine non supportato. Usa jpg, jpeg, png, gif o webp")
    private String immagine;

}
