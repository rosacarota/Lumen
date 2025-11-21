package it.lumen.data.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UtenteDTO {

    @Email(message = "Email non valida")
    @NotBlank(message = "Email obbligatoria")
    private String email;

    @NotBlank(message = "Nome obbligatorio")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "Cognome obbligatorio")
    @Size(max = 100)
    private String cognome;

    private Integer indirizzo; // FK verso Indirizzo, inviata come ID

    @NotBlank(message = "Password obbligatoria")
    private String password;

    private String descrizione;

    @Pattern(regexp = "\\d{10}", message = "Il recapito telefonico deve avere 10 cifre")
    private String recapitoTelefonico;

    @Size(max = 100)
    private String ambito;

    @NotBlank(message = "Ruolo obbligatorio")
    private String ruolo; // se vuoi puoi usare Enum e validarlo

    @Size(max = 255)
    private String immagine;

    // --- Getter e Setter ---
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }

    public Integer getIndirizzo() { return indirizzo; }
    public void setIndirizzo(Integer indirizzo) { this.indirizzo = indirizzo; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }

    public String getRecapitoTelefonico() { return recapitoTelefonico; }
    public void setRecapitoTelefonico(String recapitoTelefonico) { this.recapitoTelefonico = recapitoTelefonico; }

    public String getAmbito() { return ambito; }
    public void setAmbito(String ambito) { this.ambito = ambito; }

    public String getRuolo() { return ruolo; }
    public void setRuolo(String ruolo) { this.ruolo = ruolo; }

    public String getImmagine() { return immagine; }
    public void setImmagine(String immagine) { this.immagine = immagine; }
}


