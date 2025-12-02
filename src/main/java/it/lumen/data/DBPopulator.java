package it.lumen.data;

import it.lumen.business.gestioneRegistrazione.service.RegistrazioneService;
import it.lumen.data.entity.*;
import it.lumen.data.dao.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

@Component
public class DBPopulator implements CommandLineRunner {

    @Autowired private JdbcTemplate jdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired private RegistrazioneService registrazioneService;
    @Autowired private EventoDAO eventoDAO;
    @Autowired private RichiestaServizioDAO richiestaServizioDAO;
    @Autowired private PartecipazioneDAO partecipazioneDAO;
    @Autowired private RaccoltaFondiDAO raccoltaFondiDAO;
    @Autowired private RaccontoDAO raccontoDAO;
    @Autowired private AffiliazioneDAO affiliazioneDAO;
    @Autowired private IndirizzoDAO indirizzoDAO;

    // FIX: Metti @Transactional QUI, sul metodo d'ingresso
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        pulisciDatabase();
        popolaDatabase();
    }

    // Puoi rimuovere @Transactional da qui, dato che eredita quella di run()
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

    // Anche qui non serve più, ma male non fa (purché run sia transazionale)
    public void popolaDatabase(){
        System.out.println("Inizio popolamento database...");

        // --- 1. Creazione Indirizzi Utenti ---
        Indirizzo indEnte = new Indirizzo(null, "Roma", "RM", "00100", "Via Roma", 10);
        indEnte = indirizzoDAO.save(indEnte);

        Indirizzo indBeneficiario = new Indirizzo(null, "Milano", "MI", "20100", "Via Milano", 5);
        indBeneficiario = indirizzoDAO.save(indBeneficiario);

        Indirizzo indVolontario = new Indirizzo(null, "Napoli", "NA", "80100", "Via Napoli", 20);
        indVolontario = indirizzoDAO.save(indVolontario);

        // --- 2. Creazione Utenti ---
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
        // Ora merge funzionerà perché siamo in una transazione attiva
        ente = entityManager.merge(ente);

        // --- VOLONTARI (15 con indirizzi reali da NYC dataset) ---

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


        // Volontario 1
            Indirizzo indVol1 = new Indirizzo(null, "New York", "NY", "10038", "Maiden Ln", 80);
            indVol1 = indirizzoDAO.save(indVol1);
            Utente vol1 = new Utente();
            vol1.setEmail("matteo.russo80@volontario.it");
            vol1.setPassword("password");
            vol1.setNome("Matteo");
            vol1.setCognome("Russo");
            vol1.setRuolo(Utente.Ruolo.Volontario);
            vol1.setAmbito("Strengthening Communities");
            vol1.setDescrizione("Lifeguard Workshop Facilitators");
            vol1.setRecapitoTelefonico("3346913810");
            vol1.setIndirizzo(indVol1);
            try { registrazioneService.registraUtente(vol1); } catch (Exception e) { e.printStackTrace(); }
            vol1 = entityManager.merge(vol1);

            // Volontario 2
            Indirizzo indVol2 = new Indirizzo(null, "Bronx", "NY", "10474", "Garrison Ave", 890);
            indVol2 = indirizzoDAO.save(indVol2);
            Utente vol2 = new Utente();
            vol2.setEmail("francesca.esposito84@volontario.it");
            vol2.setPassword("password");
            vol2.setNome("Francesca");
            vol2.setCognome("Esposito");
            vol2.setRuolo(Utente.Ruolo.Volontario);
            vol2.setAmbito("Strengthening Communities");
            vol2.setDescrizione("Iridescent Science Studio Open House Volunteers");
            vol2.setRecapitoTelefonico("3323756669");
            vol2.setIndirizzo(indVol2);
            try { registrazioneService.registraUtente(vol2); } catch (Exception e) { e.printStackTrace(); }
            vol2 = entityManager.merge(vol2);

            // Volontario 3
            Indirizzo indVol3 = new Indirizzo(null, "New York", "NY", "10007", "Broadway", 253);
            indVol3 = indirizzoDAO.save(indVol3);
            Utente vol3 = new Utente();
            vol3.setEmail("matteo.gallo97@volontario.it");
            vol3.setPassword("password");
            vol3.setNome("Matteo");
            vol3.setCognome("Gallo");
            vol3.setRuolo(Utente.Ruolo.Volontario);
            vol3.setAmbito("Helping Neighbors in Need");
            vol3.setDescrizione("Help New Yorkers Affected by the Storm in Queens");
            vol3.setRecapitoTelefonico("3321668732");
            vol3.setIndirizzo(indVol3);
            try { registrazioneService.registraUtente(vol3); } catch (Exception e) { e.printStackTrace(); }
            vol3 = entityManager.merge(vol3);

            // Volontario 4
            Indirizzo indVol4 = new Indirizzo(null, "New York", "NY", "10001", "Seventh Avenue", 401);
            indVol4 = indirizzoDAO.save(indVol4);
            Utente vol4 = new Utente();
            vol4.setEmail("chiara.colombo81@volontario.it");
            vol4.setPassword("password");
            vol4.setNome("Chiara");
            vol4.setCognome("Colombo");
            vol4.setRuolo(Utente.Ruolo.Volontario);
            vol4.setAmbito("Education");
            vol4.setDescrizione("Undergraduate and Graduate Students Program");
            vol4.setRecapitoTelefonico("3313999315");
            vol4.setIndirizzo(indVol4);
            try { registrazioneService.registraUtente(vol4); } catch (Exception e) { e.printStackTrace(); }
            vol4 = entityManager.merge(vol4);

            // Volontario 5
            Indirizzo indVol5 = new Indirizzo(null, "New York", "NY", "10065", "First Avenue", 1250);
            indVol5 = indirizzoDAO.save(indVol5);
            Utente vol5 = new Utente();
            vol5.setEmail("luca.esposito87@volontario.it");
            vol5.setPassword("password");
            vol5.setNome("Luca");
            vol5.setCognome("Esposito");
            vol5.setRuolo(Utente.Ruolo.Volontario);
            vol5.setAmbito("Emergency Preparedness");
            vol5.setDescrizione("Memorial Sloan-Kettering Cancer Center");
            vol5.setRecapitoTelefonico("3377827638");
            vol5.setIndirizzo(indVol5);
            try { registrazioneService.registraUtente(vol5); } catch (Exception e) { e.printStackTrace(); }
            vol5 = entityManager.merge(vol5);

            // Volontario 6
            Indirizzo indVol6 = new Indirizzo(null, "Staten Island", "NY", "10308", "Greaves Lane", 150);
            indVol6 = indirizzoDAO.save(indVol6);
            Utente vol6 = new Utente();
            vol6.setEmail("chiara.rossi97@volontario.it");
            vol6.setPassword("password");
            vol6.setNome("Chiara");
            vol6.setCognome("Rossi");
            vol6.setRuolo(Utente.Ruolo.Volontario);
            vol6.setAmbito("Helping Neighbors in Need");
            vol6.setDescrizione("Snow Shoveling for Seniors");
            vol6.setRecapitoTelefonico("3336687537");
            vol6.setIndirizzo(indVol6);
            try { registrazioneService.registraUtente(vol6); } catch (Exception e) { e.printStackTrace(); }
            vol6 = entityManager.merge(vol6);

            // Volontario 7
            Indirizzo indVol7 = new Indirizzo(null, "Bronx", "NY", "10453", "Tremont Ave", 40);
            indVol7 = indirizzoDAO.save(indVol7);
            Utente vol7 = new Utente();
            vol7.setEmail("sara.bruno97@volontario.it");
            vol7.setPassword("password");
            vol7.setNome("Sara");
            vol7.setCognome("Bruno");
            vol7.setRuolo(Utente.Ruolo.Volontario);
            vol7.setAmbito("Strengthening Communities");
            vol7.setDescrizione("Girl Scout Series - Bronx");
            vol7.setRecapitoTelefonico("3366306997");
            vol7.setIndirizzo(indVol7);
            try { registrazioneService.registraUtente(vol7); } catch (Exception e) { e.printStackTrace(); }
            vol7 = entityManager.merge(vol7);

            // Volontario 8
            Indirizzo indVol8 = new Indirizzo(null, "Brooklyn", "NY", "11206", "Seaview Avenue", 9502);
            indVol8 = indirizzoDAO.save(indVol8);
            Utente vol8 = new Utente();
            vol8.setEmail("francesca.ricci98@volontario.it");
            vol8.setPassword("password");
            vol8.setNome("Francesca");
            vol8.setCognome("Ricci");
            vol8.setRuolo(Utente.Ruolo.Volontario);
            vol8.setAmbito("Health");
            vol8.setDescrizione("JASA Volunteer Exercise Teachers");
            vol8.setRecapitoTelefonico("3347338124");
            vol8.setIndirizzo(indVol8);
            try { registrazioneService.registraUtente(vol8); } catch (Exception e) { e.printStackTrace(); }
            vol8 = entityManager.merge(vol8);

            // Volontario 9
            Indirizzo indVol9 = new Indirizzo(null, "New York", "NY", "10013", "Broome Street", 407);
            indVol9 = indirizzoDAO.save(indVol9);
            Utente vol9 = new Utente();
            vol9.setEmail("davide.deluca80@volontario.it");
            vol9.setPassword("password");
            vol9.setNome("Davide");
            vol9.setCognome("DeLuca");
            vol9.setRuolo(Utente.Ruolo.Volontario);
            vol9.setAmbito("Strengthening Communities");
            vol9.setDescrizione("CEO Expert Advice for Professionals");
            vol9.setRecapitoTelefonico("3331429110");
            vol9.setIndirizzo(indVol9);
            try { registrazioneService.registraUtente(vol9); } catch (Exception e) { e.printStackTrace(); }
            vol9 = entityManager.merge(vol9);

            // Volontario 10
            Indirizzo indVol10 = new Indirizzo(null, "Harlem", "NY", "10027", "129th St", 509);
            indVol10 = indirizzoDAO.save(indVol10);
            Utente vol10 = new Utente();
            vol10.setEmail("sara.colombo90@volontario.it");
            vol10.setPassword("password");
            vol10.setNome("Sara");
            vol10.setCognome("Colombo");
            vol10.setRuolo(Utente.Ruolo.Volontario);
            vol10.setAmbito("Education");
            vol10.setDescrizione("Girl Scout Series - Harlem");
            vol10.setRecapitoTelefonico("3347295260");
            vol10.setIndirizzo(indVol10);
            try { registrazioneService.registraUtente(vol10); } catch (Exception e) { e.printStackTrace(); }
            vol10 = entityManager.merge(vol10);

            // Volontario 11
            Indirizzo indVol11 = new Indirizzo(null, "New York", "NY", "10011", "17th Street", 150);
            indVol11 = indirizzoDAO.save(indVol11);
            Utente vol11 = new Utente();
            vol11.setEmail("giulia.esposito90@volontario.it");
            vol11.setPassword("password");
            vol11.setNome("Giulia");
            vol11.setCognome("Esposito");
            vol11.setRuolo(Utente.Ruolo.Volontario);
            vol11.setAmbito("Strengthening Communities");
            vol11.setDescrizione("Shop Volunteer");
            vol11.setRecapitoTelefonico("3323718431");
            vol11.setIndirizzo(indVol11);
            try { registrazioneService.registraUtente(vol11); } catch (Exception e) { e.printStackTrace(); }
            vol11 = entityManager.merge(vol11);

            // Volontario 12
            Indirizzo indVol12 = new Indirizzo(null, "New York", "NY", "10013", "Broome Street", 407);
            indVol12 = indirizzoDAO.save(indVol12);
            Utente vol12 = new Utente();
            vol12.setEmail("luca.colombo83@volontario.it");
            vol12.setPassword("password");
            vol12.setNome("Luca");
            vol12.setCognome("Colombo");
            vol12.setRuolo(Utente.Ruolo.Volontario);
            vol12.setAmbito("Strengthening Communities");
            vol12.setDescrizione("Social Media Campaign for Professionals");
            vol12.setRecapitoTelefonico("3358181396");
            vol12.setIndirizzo(indVol12);
            try { registrazioneService.registraUtente(vol12); } catch (Exception e) { e.printStackTrace(); }
            vol12 = entityManager.merge(vol12);

            // Volontario 13
            Indirizzo indVol13 = new Indirizzo(null, "New York", "NY", "10007", "Chambers St", 51);
            indVol13 = indirizzoDAO.save(indVol13);
            Utente vol13 = new Utente();
            vol13.setEmail("elena.romano99@volontario.it");
            vol13.setPassword("password");
            vol13.setNome("Elena");
            vol13.setCognome("Romano");
            vol13.setRuolo(Utente.Ruolo.Volontario);
            vol13.setAmbito("Environment");
            vol13.setDescrizione("Divert Clothing & Textiles From Landfill");
            vol13.setRecapitoTelefonico("3345503389");
            vol13.setIndirizzo(indVol13);
            try { registrazioneService.registraUtente(vol13); } catch (Exception e) { e.printStackTrace(); }
            vol13 = entityManager.merge(vol13);

            // Volontario 14
            Indirizzo indVol14 = new Indirizzo(null, "Bronx", "NY", "10463", "Gale Place", 124);
            indVol14 = indirizzoDAO.save(indVol14);
            Utente vol14 = new Utente();
            vol14.setEmail("davide.rossi94@volontario.it");
            vol14.setPassword("password");
            vol14.setNome("Davide");
            vol14.setCognome("Rossi");
            vol14.setRuolo(Utente.Ruolo.Volontario);
            vol14.setAmbito("Strengthening Communities");
            vol14.setDescrizione("Hike-A-Thon");
            vol14.setRecapitoTelefonico("3381971316");
            vol14.setIndirizzo(indVol14);
            try { registrazioneService.registraUtente(vol14); } catch (Exception e) { e.printStackTrace(); }
            vol14 = entityManager.merge(vol14);

            // Volontario 15
            Indirizzo indVol15 = new Indirizzo(null, "Bronx", "NY", "10455", "St Anns Ave", 450);
            indVol15 = indirizzoDAO.save(indVol15);
            Utente vol15 = new Utente();
            vol15.setEmail("luca.mancini92@volontario.it");
            vol15.setPassword("password");
            vol15.setNome("Luca");
            vol15.setCognome("Mancini");
            vol15.setRuolo(Utente.Ruolo.Volontario);
            vol15.setAmbito("Health");
            vol15.setDescrizione("Bronx: Zumba Instructor for Shape Up NYC");
            vol15.setRecapitoTelefonico("3320576383");
            vol15.setIndirizzo(indVol15);
            try { registrazioneService.registraUtente(vol15); } catch (Exception e) { e.printStackTrace(); }
            vol15 = entityManager.merge(vol15);

            // --- BENEFICIARI (10 nelle stesse zone) ---

            // Beneficiario 1 (zona indVol1)
            Indirizzo indBen1 = new Indirizzo(null, "New York", "NY", "10038", "Maiden Ln", 84);
            indBen1 = indirizzoDAO.save(indBen1);
            Utente ben1 = new Utente();
            ben1.setEmail("aldo.rossi80@beneficiario.it");
            ben1.setPassword("password");
            ben1.setNome("Aldo");
            ben1.setCognome("Rossi");
            ben1.setRuolo(Utente.Ruolo.Beneficiario);
            ben1.setAmbito(null);
            ben1.setDescrizione("Necessito assistenza");
            ben1.setRecapitoTelefonico("3458537831");
            ben1.setIndirizzo(indBen1);
            try { registrazioneService.registraUtente(ben1); } catch (Exception e) { e.printStackTrace(); }
            ben1 = entityManager.merge(ben1);

            // Beneficiario 2
            Indirizzo indBen2 = new Indirizzo(null, "Bronx", "NY", "10474", "Garrison Ave", 895);
            indBen2 = indirizzoDAO.save(indBen2);
            Utente ben2 = new Utente();
            ben2.setEmail("maria.neri61@beneficiario.it");
            ben2.setPassword("password");
            ben2.setNome("Maria");
            ben2.setCognome("Neri");
            ben2.setRuolo(Utente.Ruolo.Beneficiario);
            ben2.setAmbito(null);
            ben2.setDescrizione("Cerco aiuto domestico");
            ben2.setRecapitoTelefonico("3440587988");
            ben2.setIndirizzo(indBen2);
            try { registrazioneService.registraUtente(ben2); } catch (Exception e) { e.printStackTrace(); }
            ben2 = entityManager.merge(ben2);

            // Beneficiario 3
            Indirizzo indBen3 = new Indirizzo(null, "New York", "NY", "10007", "Broadway", 254);
            indBen3 = indirizzoDAO.save(indBen3);
            Utente ben3 = new Utente();
            ben3.setEmail("giuseppe.gialli63@beneficiario.it");
            ben3.setPassword("password");
            ben3.setNome("Giuseppe");
            ben3.setCognome("Gialli");
            ben3.setRuolo(Utente.Ruolo.Beneficiario);
            ben3.setAmbito(null);
            ben3.setDescrizione("Cerco aiuto domestico");
            ben3.setRecapitoTelefonico("3447308985");
            ben3.setIndirizzo(indBen3);
            try { registrazioneService.registraUtente(ben3); } catch (Exception e) { e.printStackTrace(); }
            ben3 = entityManager.merge(ben3);

            // Beneficiario 4
            Indirizzo indBen4 = new Indirizzo(null, "New York", "NY", "10001", "Seventh Avenue", 401);
            indBen4 = indirizzoDAO.save(indBen4);
            Utente ben4 = new Utente();
            ben4.setEmail("luisa.verdi71@beneficiario.it");
            ben4.setPassword("password");
            ben4.setNome("Luisa");
            ben4.setCognome("Verdi");
            ben4.setRuolo(Utente.Ruolo.Beneficiario);
            ben4.setAmbito(null);
            ben4.setDescrizione("Necessito assistenza");
            ben4.setRecapitoTelefonico("3438119557");
            ben4.setIndirizzo(indBen4);
            try { registrazioneService.registraUtente(ben4); } catch (Exception e) { e.printStackTrace(); }
            ben4 = entityManager.merge(ben4);

            // Beneficiario 5
            Indirizzo indBen5 = new Indirizzo(null, "New York", "NY", "10065", "First Avenue", 1255);
            indBen5 = indirizzoDAO.save(indBen5);
            Utente ben5 = new Utente();
            ben5.setEmail("franco.neri79@beneficiario.it");
            ben5.setPassword("password");
            ben5.setNome("Franco");
            ben5.setCognome("Neri");
            ben5.setRuolo(Utente.Ruolo.Beneficiario);
            ben5.setAmbito(null);
            ben5.setDescrizione("Necessito assistenza");
            ben5.setRecapitoTelefonico("3432969840");
            ben5.setIndirizzo(indBen5);
            try { registrazioneService.registraUtente(ben5); } catch (Exception e) { e.printStackTrace(); }
            ben5 = entityManager.merge(ben5);

            // Beneficiario 6
            Indirizzo indBen6 = new Indirizzo(null, "Staten Island", "NY", "10308", "Greaves Lane", 151);
            indBen6 = indirizzoDAO.save(indBen6);
            Utente ben6 = new Utente();
            ben6.setEmail("maria.verdi74@beneficiario.it");
            ben6.setPassword("password");
            ben6.setNome("Maria");
            ben6.setCognome("Verdi");
            ben6.setRuolo(Utente.Ruolo.Beneficiario);
            ben6.setAmbito(null);
            ben6.setDescrizione("Necessito assistenza");
            ben6.setRecapitoTelefonico("3446231783");
            ben6.setIndirizzo(indBen6);
            try { registrazioneService.registraUtente(ben6); } catch (Exception e) { e.printStackTrace(); }
            ben6 = entityManager.merge(ben6);

            // Beneficiario 7
            Indirizzo indBen7 = new Indirizzo(null, "Bronx", "NY", "10453", "Tremont Ave", 40);
            indBen7 = indirizzoDAO.save(indBen7);
            Utente ben7 = new Utente();
            ben7.setEmail("aldo.gialli81@beneficiario.it");
            ben7.setPassword("password");
            ben7.setNome("Aldo");
            ben7.setCognome("Gialli");
            ben7.setRuolo(Utente.Ruolo.Beneficiario);
            ben7.setAmbito(null);
            ben7.setDescrizione("Ho bisogno di supporto");
            ben7.setRecapitoTelefonico("3417507864");
            ben7.setIndirizzo(indBen7);
            try { registrazioneService.registraUtente(ben7); } catch (Exception e) { e.printStackTrace(); }
            ben7 = entityManager.merge(ben7);

            // Beneficiario 8
            Indirizzo indBen8 = new Indirizzo(null, "Brooklyn", "NY", "11206", "Seaview Avenue", 9501);
            indBen8 = indirizzoDAO.save(indBen8);
            Utente ben8 = new Utente();
            ben8.setEmail("mario.blu72@beneficiario.it");
            ben8.setPassword("password");
            ben8.setNome("Mario");
            ben8.setCognome("Blu");
            ben8.setRuolo(Utente.Ruolo.Beneficiario);
            ben8.setAmbito(null);
            ben8.setDescrizione("Ho bisogno di supporto");
            ben8.setRecapitoTelefonico("3418883684");
            ben8.setIndirizzo(indBen8);
            try { registrazioneService.registraUtente(ben8); } catch (Exception e) { e.printStackTrace(); }
            ben8 = entityManager.merge(ben8);

            // Beneficiario 9
            Indirizzo indBen9 = new Indirizzo(null, "New York", "NY", "10013", "Broome Street", 412);
            indBen9 = indirizzoDAO.save(indBen9);
            Utente ben9 = new Utente();
            ben9.setEmail("paola.blu66@beneficiario.it");
            ben9.setPassword("password");
            ben9.setNome("Paola");
            ben9.setCognome("Blu");
            ben9.setRuolo(Utente.Ruolo.Beneficiario);
            ben9.setAmbito(null);
            ben9.setDescrizione("Cerco aiuto domestico");
            ben9.setRecapitoTelefonico("3477005685");
            ben9.setIndirizzo(indBen9);
            try { registrazioneService.registraUtente(ben9); } catch (Exception e) { e.printStackTrace(); }
            ben9 = entityManager.merge(ben9);

            // Beneficiario 10
            Indirizzo indBen10 = new Indirizzo(null, "Harlem", "NY", "10027", "129th St", 506);
            indBen10 = indirizzoDAO.save(indBen10);
            Utente ben10 = new Utente();
            ben10.setEmail("rita.verdi68@beneficiario.it");
            ben10.setPassword("password");
            ben10.setNome("Rita");
            ben10.setCognome("Verdi");
            ben10.setRuolo(Utente.Ruolo.Beneficiario);
            ben10.setAmbito(null);
            ben10.setDescrizione("Necessito assistenza");
            ben10.setRecapitoTelefonico("3443101783");
            ben10.setIndirizzo(indBen10);
            try { registrazioneService.registraUtente(ben10); } catch (Exception e) { e.printStackTrace(); }
            ben10 = entityManager.merge(ben10);


        // --- 3. Creazione Evento ---
        Indirizzo indEvento = new Indirizzo(null, "Roma", "RM", "00184", "Piazza del Colosseo", 1);
        indEvento = indirizzoDAO.save(indEvento);

        Evento evento = new Evento();
        evento.setTitolo("Raccolta Alimentare");
        evento.setDescrizione("Raccolta cibo");
        evento.setDataInizio(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setDataFine(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setMaxPartecipanti(50);
        evento.setIndirizzo(indEvento);
        evento.setUtente(ente);
        eventoDAO.save(evento);

        // --- 4. Altre Entità ---
        RichiestaServizio richiesta = new RichiestaServizio();
        richiesta.setTesto("Spesa a domicilio");
        richiesta.setDataRichiesta(Date.valueOf(LocalDate.now()));
        richiesta.setStato(RichiestaServizio.StatoRichiestaServizio.InAttesa);
        richiesta.setBeneficiario(beneficiario);
        richiesta.setEnteVolontario(ente);
        richiestaServizioDAO.save(richiesta);

        Partecipazione partecipazione = new Partecipazione();
        partecipazione.setEvento(evento);
        partecipazione.setVolontario(volontario);
        partecipazione.setData(Date.valueOf(LocalDate.now()));
        partecipazioneDAO.save(partecipazione);

        RaccoltaFondi raccolta = new RaccoltaFondi();
        raccolta.setTitolo("Nuova Ambulanza");
        raccolta.setDescrizione("Fondi ambulanza");
        raccolta.setObiettivo(new BigDecimal("50000.00"));
        raccolta.setTotaleRaccolto(new BigDecimal("1250.50"));
        raccolta.setDataApertura(Date.valueOf(LocalDate.now()));
        raccolta.setDataChiusura(Date.valueOf(LocalDate.now().plusMonths(6)));
        raccolta.setEnte(ente);
        raccoltaFondiDAO.save(raccolta);

        Racconto racconto = new Racconto();
        racconto.setTitolo("Esperienza Mensa");
        racconto.setDescrizione("Bellissima giornata");
        racconto.setDataPubblicazione(Date.valueOf(LocalDate.now()));
        racconto.setUtente(volontario);
        raccontoDAO.save(racconto);

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
