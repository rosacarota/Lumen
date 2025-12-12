package it.lumen.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "richiestaservizio")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
/**
 * Entity che rappresenta una richiesta di servizio da parte di un beneficiario
 * a un ente.
 */
public class RichiestaServizio {

    /**
     * Enumerazione per lo stato della richiesta di servizio.
     * Accettata: la richiesta è stata accettata dall'ente.
     * InAttesa: la richiesta è in attesa di valutazione.
     */
    public enum StatoRichiestaServizio {
        Accettata,
        InAttesa
    }

    /**
     * Identificativo univoco della richiesta di servizio.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idrichiestaservizio")
    private Integer idRichiestaServizio;

    /**
     * Testo descrittivo della richiesta.
     */
    @NotNull(message = "Specificare la richiesta")
    @Column(name = "testo", nullable = false)
    private String testo;

    /**
     * Data in cui è stata effettuata la richiesta.
     */
    @NotNull(message = "La data di creazione della richiesta è obbligatoria")
    @Column(name = "data")
    private Date dataRichiesta;

    /**
     * Stato attuale della richiesta.
     */
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Lo stato della richiesta è obbligatorio")
    @Column(name = "stato")
    StatoRichiestaServizio stato;

    /**
     * Il beneficiario che effettua la richiesta.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Il mittente della ricerca è obbligatorio")
    @JoinColumn(name = "beneficiario")
    @JsonIgnoreProperties({ "password", "ambito", "ruolo", "hibernateLazyInitializer" })
    Utente beneficiario;

    /**
     * L'ente volontario destinatario della richiesta.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Il destinatario della richiesta è sbagliato")
    @JoinColumn(name = "entevolontario")
    @JsonIgnoreProperties({ "password", "ambito", "ruolo", "hibernateLazyInitializer" })
    Utente enteVolontario;

}
