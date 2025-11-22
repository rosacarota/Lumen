package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name = "Racconto")
@Getter
@Setter
public class Racconto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDRacconto")
    private Integer IDRacconto;

    @Column(name = "titolo", nullable = false, length = 255)
    @NotBlank(message = "Il titolo non può essere vuoto")
    @Size(max = 255, message = "Il titolo deve massimo di 255 caratteri")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.!?'-]{0,255}$", message = "Il titolo contiene caratteri non validi")
    private String titolo;

    @Column(name = "descrizione", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "La descrizione non può essere vuota")
    private String descrizione;

    @Column(name = "datapubblicazione", nullable = false)
    @NotNull(message = "La data di creazione non può essere nulla")
    private Date dataPubblicazione;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente")
    private Utente utente;


    @Column(name = "immagine", length = 255)
    @Pattern(regexp = "^[a-zA-Z0-9\\s._/\\\\:-]*\\.(jpg|jpeg|png|gif|webp)$",
            message = "Formato immagine non supportato. Usa jpg, jpeg, png, gif o webp")
    private String immagine;

}