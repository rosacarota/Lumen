package it.lumen.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;


@Entity
@Table(name="richiestaservizio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RichiestaServizio {

    public enum StatoRichiestaServizio {
        Accettata,
        InAttesa
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idrichiestaservizio")
    private Integer idRichiestaServizio;

    @NotNull(message = "Specificare la richiesta")
    @Column(name = "testo", nullable = false)
    private String testo;

    @NotNull(message = "La data di creazione della richiesta è obbligatoria")
    @Column(name = "data")
    private Date dataRichiesta;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Lo stato della richiesta è obbligatorio")
    @Column(name = "stato")
    StatoRichiestaServizio stato;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Il mittente della ricerca è obbligatorio")
    @JoinColumn(name = "beneficiario")
    Utente beneficiario;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Il destinatario della richiesta è sbagliato")
    @JoinColumn(name = "entevolontario")
    Utente enteVolontraio;


}
