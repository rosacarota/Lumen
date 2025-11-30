package it.lumen.data;

import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.entity.*;
import it.lumen.data.dao.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate; // IMPORTANTE
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional; // IMPORTANTE

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

@Component
public class DBPopulator implements CommandLineRunner {

    @Autowired private JdbcTemplate jdbcTemplate; // Usiamo questo per le query native

    @Autowired private RegistrazioneService registrazioneService;
    @Autowired private EventoDAO eventoDAO;
    @Autowired private RichiestaServizioDAO richiestaServizioDAO;
    @Autowired private PartecipazioneDAO partecipazioneDAO;
    @Autowired private RaccoltaFondiDAO raccoltaFondiDAO;
    @Autowired private RaccontoDAO raccontoDAO;
    @Autowired private AffiliazioneDAO affiliazioneDAO;
    @Autowired private IndirizzoDAO indirizzoDAO;

    @Override
    public void run(String... args) throws Exception {
        pulisciDatabase(); // Pulisce tutto prima di riempire
        popolaDatabase();
    }

    @Transactional
    public void pulisciDatabase() {
        System.out.println("Pulizia database in corso...");

        String sql = """
            TRUNCATE TABLE 
                Partecipazione, 
                RichiestaServizio, 
                Affiliazione, 
                RaccoltaFondi, 
                Evento, 
                Racconto, 
                Utente, 
                Indirizzo 
            RESTART IDENTITY CASCADE
        """;

        jdbcTemplate.execute(sql);
        System.out.println("Database pulito con successo.");
    }

    public void popolaDatabase(){
        System.out.println("Inizio popolamento database...");

        Indirizzo indEnte = new Indirizzo(null, "Roma", "RM", "00100", "Via Roma", 10);
        indirizzoDAO.save(indEnte);

        Indirizzo indBeneficiario = new Indirizzo(null, "Milano", "MI", "20100", "Via Milano", 5);
        indirizzoDAO.save(indBeneficiario);

        Indirizzo indVolontario = new Indirizzo(null, "Napoli", "NA", "80100", "Via Napoli", 20);
        indirizzoDAO.save(indVolontario);

        Utente ente = new Utente();
        ente.setEmail("ente@lumen.it");
        ente.setPassword("password");
        ente.setNome("Croce Rossa");
        ente.setCognome("");
        ente.setRuolo(Utente.Ruolo.Ente);
        ente.setAmbito("Sanitario");
        ente.setDescrizione("Ente benefico internazionale");
        ente.setRecapitoTelefonico("1234567890");
        ente.setIndirizzo(indEnte);

        try { registrazioneService.registraUtente(ente); } catch (Exception e) { e.printStackTrace(); }

        // BENEFICIARIO
        Utente beneficiario = new Utente();
        beneficiario.setEmail("beneficiario@lumen.it");
        beneficiario.setPassword("password");
        beneficiario.setNome("Mario");
        beneficiario.setCognome("Rossi");
        beneficiario.setRuolo(Utente.Ruolo.Beneficiario);
        beneficiario.setAmbito(null);
        beneficiario.setDescrizione("Ho bisogno di assistenza");
        beneficiario.setRecapitoTelefonico("0987654321");
        beneficiario.setIndirizzo(indBeneficiario);
        try { registrazioneService.registraUtente(beneficiario); } catch (Exception e) { e.printStackTrace(); }

        // VOLONTARIO
        Utente volontario = new Utente();
        volontario.setEmail("volontario@lumen.it");
        volontario.setPassword("password");
        volontario.setNome("Luigi");
        volontario.setCognome("Verdi");
        volontario.setRuolo(Utente.Ruolo.Volontario);
        volontario.setAmbito("Sociale");
        volontario.setDescrizione("Voglio aiutare");
        volontario.setRecapitoTelefonico("1122334455");
        volontario.setIndirizzo(indVolontario);
        try { registrazioneService.registraUtente(volontario); } catch (Exception e) { e.printStackTrace(); }


        // RI-RECUPERA GLI UTENTI DAL DB PER ESSERE SICURI DI AVERE LE ENTITÀ MANAGED
        // (Questo evita problemi di "detached entity" se il service chiude la transazione)
        // Se usi i repository direttamente questo passaggio è cruciale
        // Ma dato che hai gli oggetti in memoria e gli ID sono stringhe (email), potrebbe funzionare.
        // Per sicurezza è meglio ricaricarli se Hibernate si lamenta.

        // --- 3. Creazione Evento ---
        Evento evento = new Evento();
        evento.setTitolo("Raccolta Alimentare");
        evento.setDescrizione("Raccolta cibo");
        evento.setDataInizio(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setDataFine(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setMaxPartecipanti(50);
        evento.setIndirizzo(indEnte);
        evento.setUtente(ente);
        eventoDAO.save(evento);

        // --- 4. Creazione Richiesta Servizio ---
        RichiestaServizio richiesta = new RichiestaServizio();
        richiesta.setTesto("Spesa a domicilio");
        richiesta.setDataRichiesta(Date.valueOf(LocalDate.now()));
        richiesta.setStato(RichiestaServizio.StatoRichiestaServizio.InAttesa);
        richiesta.setBeneficiario(beneficiario);
        richiesta.setEnteVolontraio(ente);
        richiestaServizioDAO.save(richiesta);

        // --- 5. Partecipazione ---
        Partecipazione partecipazione = new Partecipazione();
        partecipazione.setEvento(evento);
        partecipazione.setVolontario(volontario);
        partecipazione.setData(Date.valueOf(LocalDate.now()));
        partecipazioneDAO.save(partecipazione);

        // --- 6. Raccolta Fondi ---
        RaccoltaFondi raccolta = new RaccoltaFondi();
        raccolta.setTitolo("Nuova Ambulanza");
        raccolta.setDescrizione("Fondi ambulanza");
        raccolta.setObiettivo(new BigDecimal("50000.00"));
        raccolta.setTotaleRaccolto(new BigDecimal("1250.50"));
        raccolta.setDataApertura(Date.valueOf(LocalDate.now()));
        raccolta.setDataChiusura(Date.valueOf(LocalDate.now().plusMonths(6)));
        raccolta.setEnte(ente);
        raccoltaFondiDAO.save(raccolta);

        // --- 7. Racconto ---
        Racconto racconto = new Racconto();
        racconto.setTitolo("Esperienza Mensa");
        racconto.setDescrizione("Bellissima giornata");
        racconto.setDataPubblicazione(Date.valueOf(LocalDate.now()));
        racconto.setUtente(volontario);
        raccontoDAO.save(racconto);

        // --- 8. Affiliazione ---
        Affiliazione affiliazione = new Affiliazione();
        affiliazione.setDescrizione("Adesione standard");
        affiliazione.setDataInizio(Date.valueOf(LocalDate.now()));
        affiliazione.setStato(Affiliazione.StatoAffiliazione.Accettata);
        affiliazione.setEnte(ente);
        affiliazione.setVolontario(volontario);
        affiliazioneDAO.save(affiliazione);

        System.out.println("Popolamento completato!");
    }
}
