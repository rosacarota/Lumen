package it.lumen.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class Encrypter {

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public String encrypt(String rawPassword) {
        return passwordEncoder().encode(rawPassword);
    }
}
