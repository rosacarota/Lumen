package it.lumen.data.entity;

import jakarta.persistence.*;
import lombok.*;

import javax.validation.constraints.Pattern;

@Entity
@Table(name="Indirizzo")
@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class Indirizzo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="IDIndirizzo")
    private Integer idIndirizzo;

    @Column(name="citta", nullable= false, length=100)
    private String citta;

    @Column(name="provincia", nullable=false, length=50)
    private String provincia;

    @Pattern(regexp = "\\d{5}", message = "Il CAP deve avere 5 cifre")
    @Column(name="cap", nullable=false, length=5)
    private String cap;

    @Column(name="strada", nullable=false, length=255)
    private String strada;

    @Column(name="ncivico", nullable=true, length=10)
    private Integer nCivico;

}
