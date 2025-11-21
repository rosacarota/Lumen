package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.sql.Date;

@Entity
@Table(name = "Racconto")
public class Racconto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDRacconto")
    private int IDRacconto;

    @Column(name = "titolo", nullable = false, length = 255)
    @NotBlank(message = "Il titolo non può essere vuoto")
    @Size(max = 255, message = "Il titolo deve massimo di 255 caratteri")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.!?'-]{10,255}$", message = "Il titolo contiene caratteri non validi")
    private String titolo;

    @Column(name = "descrizione", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "La descrizione non può essere vuota")
    private String descrizione;

    @Column(name = "datapubblicazione", nullable = false)
    @NotNull(message = "La data di creazione non può essere nulla")
    private Date dataPubblicazione;

    @Column(name = "utente", nullable = false, length = 255)
    @NotBlank(message = "L'email dell'utente non può essere vuota")
    @Email(message = "Email non valida")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Formato email non valido")
    private String utente;

    @Column(name = "immagine", length = 255)
    @Pattern(regexp = "^[a-zA-Z0-9\\s._/\\\\:-]*\\.(jpg|jpeg|png|gif|webp)$",
            message = "Formato immagine non supportato. Usa jpg, jpeg, png, gif o webp")
    private String immagine;

}