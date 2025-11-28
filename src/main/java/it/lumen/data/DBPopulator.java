package it.lumen.data;

import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService; // Adatta il package se necessario
import it.lumen.data.entity.*;
import it.lumen.data.dao.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

@Component
public class DBPopulator implements CommandLineRunner { // 1. Implementa questa interfaccia

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
        popolaDatabase();
    }

    public void popolaDatabase(){
        System.out.println("Inizio popolamento database...");

        // --- 1. Creazione Indirizzi ---
        // Nota: Se i tuoi DAO non hanno la save automatica a cascata, salviamo prima gli indirizzi
        Indirizzo indEnte = new Indirizzo(null, "Roma", "RM", "00100", "Via Roma", 10);
        indirizzoDAO.save(indEnte);

        Indirizzo indBeneficiario = new Indirizzo(null, "Milano", "MI", "20100", "Via Milano", 5);
        indirizzoDAO.save(indBeneficiario);

        Indirizzo indVolontario = new Indirizzo(null, "Napoli", "NA", "80100", "Via Napoli", 20);
        indirizzoDAO.save(indVolontario);


        // --- 2. Creazione Utenti (Tramite RegistrazioneService come richiesto) ---

        // ENTE: No cognome (""), Ha ambito
        Utente ente = new Utente();
        ente.setEmail("ente@lumen.it");
        ente.setPassword("password");
        ente.setNome("Croce Rossa");
        ente.setCognome(""); // Vincolo: Ente senza cognome
        ente.setRuolo(Utente.Ruolo.Ente);
        ente.setAmbito("Sanitario"); // Vincolo: Ente ha ambito
        ente.setDescrizione("Ente benefico internazionale");
        ente.setRecapitoTelefonico("1234567890");
        ente.setIndirizzo(indEnte);

        try {
            registrazioneService.registraUtente(ente);
        } catch (Exception e) {
            System.out.println("Nota: Utente Ente già presente o errore: " + e.getMessage());
        }


        // BENEFICIARIO: Ha cognome, No ambito (null)
        Utente beneficiario = new Utente();
        beneficiario.setEmail("beneficiario@lumen.it");
        beneficiario.setPassword("password");
        beneficiario.setNome("Mario");
        beneficiario.setCognome("Rossi");
        beneficiario.setRuolo(Utente.Ruolo.Beneficiario);
        beneficiario.setAmbito(null); // Vincolo: Beneficiario non ha ambito
        beneficiario.setDescrizione("Ho bisogno di assistenza per la spesa");
        beneficiario.setRecapitoTelefonico("0987654321");
        beneficiario.setIndirizzo(indBeneficiario);

        try {
            registrazioneService.registraUtente(beneficiario);
        } catch (Exception e) {
            System.out.println("Nota: Utente Beneficiario già presente o errore: " + e.getMessage());
        }


        // VOLONTARIO: Ha cognome, Può avere ambito
        Utente volontario = new Utente();
        volontario.setEmail("volontario@lumen.it");
        volontario.setPassword("password");
        volontario.setNome("Luigi");
        volontario.setCognome("Verdi");
        volontario.setRuolo(Utente.Ruolo.Volontario);
        volontario.setAmbito("Sociale");
        volontario.setDescrizione("Voglio aiutare nel tempo libero");
        volontario.setRecapitoTelefonico("1122334455");
        volontario.setIndirizzo(indVolontario);

        try {
            registrazioneService.registraUtente(volontario);
        } catch (Exception e) {
            System.out.println("Nota: Utente Volontario già presente o errore: " + e.getMessage());
        }


        // --- 3. Creazione Evento (Solo ENTE) ---
        Evento evento = new Evento();
        evento.setTitolo("Raccolta Alimentare");
        evento.setDescrizione("Raccolta cibo per i bisognosi in piazza");
        evento.setDataInizio(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setDataFine(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setMaxPartecipanti(50);
        evento.setIndirizzo(indEnte);
        evento.setUtente(ente); // L'organizzatore è l'Ente

        eventoDAO.save(evento);


        // --- 4. Creazione Richiesta Servizio (Solo BENEFICIARIO) ---
        RichiestaServizio richiesta = new RichiestaServizio();
        richiesta.setTesto("Ho bisogno di qualcuno che mi porti la spesa il martedì");
        richiesta.setDataRichiesta(Date.valueOf(LocalDate.now()));
        richiesta.setStato(RichiestaServizio.StatoRichiestaServizio.InAttesa);
        richiesta.setBeneficiario(beneficiario); // Il richiedente è il Beneficiario
        richiesta.setEnteVolontraio(ente); // Esempio: assegnata all'ente, o null se ancora non presa in carico

        richiestaServizioDAO.save(richiesta);


        // --- 5. Creazione Partecipazione (VOLONTARIO partecipa a Evento) ---
        Partecipazione partecipazione = new Partecipazione();
        partecipazione.setEvento(evento);
        partecipazione.setVolontario(volontario);
        partecipazione.setData(Date.valueOf(LocalDate.now()));

        partecipazioneDAO.save(partecipazione);


        // --- 6. Creazione Raccolta Fondi (Solo ENTE) ---
        RaccoltaFondi raccolta = new RaccoltaFondi();
        raccolta.setTitolo("Nuova Ambulanza");
        raccolta.setDescrizione("Fondi per l'acquisto di un nuovo mezzo di soccorso");
        raccolta.setObiettivo(new BigDecimal("50000.00"));
        raccolta.setTotaleRaccolto(new BigDecimal("1250.50"));
        raccolta.setDataApertura(Date.valueOf(LocalDate.now()));
        raccolta.setDataChiusura(Date.valueOf(LocalDate.now().plusMonths(6)));
        raccolta.setEnte(ente);

        raccoltaFondiDAO.save(raccolta);


        // --- 7. Creazione Racconto (VOLONTARIO) ---
        Racconto racconto = new Racconto();
        racconto.setTitolo("La mia giornata alla mensa");
        racconto.setDescrizione("Oggi è stata una giornata fantastica aiutando gli altri...");
        racconto.setDataPubblicazione(Date.valueOf(LocalDate.now()));
        racconto.setUtente(volontario);

        raccontoDAO.save(racconto);


        Affiliazione affiliazione = new Affiliazione();
        affiliazione.setDescrizione("Richiesta di adesione standard");
        affiliazione.setDataInizio(Date.valueOf(LocalDate.now()));
        affiliazione.setStato(Affiliazione.StatoAffiliazione.InAttesa);
        affiliazione.setEnte(ente);
        affiliazione.setVolontario(volontario);

        affiliazioneDAO.save(affiliazione);

        System.out.println("Popolamento database completato con successo!");
    }
}
