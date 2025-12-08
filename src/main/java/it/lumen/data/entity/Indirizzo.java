package it.lumen.data.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;

import javax.validation.constraints.Pattern;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
@Table(name = "Indirizzo")
@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
/**
 * Entity che rappresenta un indirizzo (Città, Provincia, CAP, Strada, Civico).
 */
public class Indirizzo {

    /**
     * Identificativo univoco dell'indirizzo.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDIndirizzo")
    private Integer idIndirizzo;

    /**
     * Città dell'indirizzo.
     */
    @Column(name = "citta", nullable = false, length = 100)
    private String citta;

    /**
     * Provincia dell'indirizzo.
     */
    @Column(name = "provincia", nullable = false, length = 50)
    private String provincia;

    /**
     * Codice di Avviamento Postale (CAP). Deve essere di 5 cifre.
     */
    @Pattern(regexp = "\\d{5}", message = "Il CAP deve avere 5 cifre")
    @Column(name = "cap", nullable = false, length = 5)
    private String cap;

    /**
     * Nome della via o piazza.
     */
    @Column(name = "strada", nullable = false, length = 255)
    private String strada;

    /**
     * Numero civico.
     */
    @Column(name = "ncivico", nullable = true, length = 10)
    private Integer nCivico;

}
