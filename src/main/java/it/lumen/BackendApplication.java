package it.lumen;

import it.lumen.data.DBPopulator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);

    }

}








//----- MAIN PER TESTARE I DAO -----
/*package it.lumen;

import it.lumen.data.dao.EnteDAO;
import it.lumen.data.entity.Utente;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.List;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);

        EnteDAO enteDAO = context.getBean(EnteDAO.class);
        System.out.println("--- INTERROGAZIONE DB ---");

        try {
            String emailDaCercare = "msf.italia@lumen.it";
            Utente risultato = enteDAO.findByEmail(emailDaCercare);
            List<Utente> risultatoNome = enteDAO.findAllByNome("Medici Senza");
            if (risultato != null) {
                System.out.println("Trovato: " + risultato.toString());
            } else {
                System.out.println("Nessun utente trovato con email: " + emailDaCercare);
            }
            if(risultatoNome != null) {
                System.out.println("Trovato: " + risultatoNome.toString());
            } else {
                System.out.println("Nessun utente trovato con nome: " + "Medici Senza");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("-------------------------");
    }
}
*/












