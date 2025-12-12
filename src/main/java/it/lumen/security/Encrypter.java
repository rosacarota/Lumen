package it.lumen.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Componente di utilità per la gestione della crittografia delle password.
 * Utilizza BCrypt per l'hashing sicuro delle credenziali utente.
 */
@Component
public class Encrypter {

    /**
     * Fornisce un'istanza del PasswordEncoder.
     *
     * @return Un'istanza di {@link BCryptPasswordEncoder}.
     */
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Esegue l'hashing di una password in chiaro.
     *
     * @param rawPassword La password in chiaro da cifrare.
     * @return La stringa contenente la password cifrata (hash).
     */
    public String encrypt(String rawPassword) {
        return passwordEncoder().encode(rawPassword);
    }

    /**
     * Verifica la corrispondenza tra una password in chiaro e una cifrata.
     *
     * @param rawPassword     La password in chiaro da verificare.
     * @param encodedPassword La password cifrata (hash) salvata nel database.
     * @return true se la password in chiaro corrisponde all'hash, false altrimenti.
     */
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isEmpty())
            return false;
        // Se la password nel DB non sembra un hash BCrypt (che inizia con $2a$...),
        // prova confronto in chiaro
        if (!encodedPassword.startsWith("$") && !encodedPassword.startsWith("{")) {
            return rawPassword.equals(encodedPassword);
        }
        return passwordEncoder().matches(rawPassword, encodedPassword);
    }
}
