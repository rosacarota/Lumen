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

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        pulisciDatabase();
        popolaDatabase();
    }

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

        // --- ENTE GENERICO (Non modificato) ---
        Indirizzo indEnte = new Indirizzo(null, "Roma", "RM", "00100", "Via Roma", 10);
        indEnte = indirizzoDAO.save(indEnte);

        Indirizzo indBeneficiario =new Indirizzo(null, "New York", "NY", "10012", "Broadway", 610);;
        indBeneficiario = indirizzoDAO.save(indBeneficiario);

        Indirizzo indVolontario = new Indirizzo(null, "Napoli", "NA", "80100", "Via Napoli", 20);
        indVolontario = indirizzoDAO.save(indVolontario);

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
        try { registrazioneService.registraUtente(ente); } catch (Exception e) { }
        ente = entityManager.merge(ente);

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
        try { registrazioneService.registraUtente(beneficiario); } catch (Exception e) { }

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
        try { registrazioneService.registraUtente(volontario); } catch (Exception e) { }

        // --- VOLONTARI DAL DATASET (V0 - V19) ---

        // V0: Strengthening Communities (Lat: 40.7258, Lon: -73.9808 -> East Village, Manhattan)
        Indirizzo indV0 = new Indirizzo(null, "New York", "NY", "10009", "E 9th St", 10);
        indV0 = indirizzoDAO.save(indV0);
        Utente v0 = new Utente();
        v0.setEmail("filipporicci@gmail.com");
        v0.setPassword("password");
        v0.setNome("Filippo");
        v0.setCognome("Ricci");
        v0.setRuolo(Utente.Ruolo.Volontario);
        v0.setAmbito("Strengthening Communities");
        v0.setDescrizione("Voglio aiutare le comunita");
        v0.setRecapitoTelefonico("333000000");
        v0.setIndirizzo(indV0);
        try { registrazioneService.registraUtente(v0); } catch (Exception e) { }
        v0 = entityManager.merge(v0);

        // V1: Education (Lat: 40.7147, Lon: -73.7936 -> Jamaica Estates, Queens)
        Indirizzo indV1 = new Indirizzo(null, "Queens", "NY", "11432", "169th St", 11);
        indV1 = indirizzoDAO.save(indV1);
        Utente v1 = new Utente();
        v1.setEmail("simone_marino@icloud.com");
        v1.setPassword("password");
        v1.setNome("Simone");
        v1.setCognome("Marino");
        v1.setRuolo(Utente.Ruolo.Volontario);
        v1.setAmbito("Education");
        v1.setDescrizione("Insegnante per rentegrazione immigrati");
        v1.setRecapitoTelefonico("333000001");
        v1.setIndirizzo(indV1);
        try { registrazioneService.registraUtente(v1); } catch (Exception e) { }
        v1 = entityManager.merge(v1);

        // V2: Helping Neighbors in Need (Lat: 40.7454, Lon: -73.9797 -> Murray Hill, Manhattan)
        Indirizzo indV2 = new Indirizzo(null, "New York", "NY", "10016", "3rd Ave", 12);
        indV2 = indirizzoDAO.save(indV2);
        Utente v2 = new Utente();
        v2.setEmail("alessandro.deangelis@libero.it");
        v2.setPassword("password");
        v2.setNome("Alessandro");
        v2.setCognome("Deangelis");
        v2.setRuolo(Utente.Ruolo.Volontario);
        v2.setAmbito("Helping Neighbors in Need");
        v2.setDescrizione("Mi piace aiutare i più bisognosi");
        v2.setRecapitoTelefonico("333000002");
        v2.setIndirizzo(indV2);
        try { registrazioneService.registraUtente(v2); } catch (Exception e) { }
        v2 = entityManager.merge(v2);

        // V3: Strengthening Communities (Lat: 40.7313, Lon: -73.9887 -> Union Square, Manhattan)
        Indirizzo indV3 = new Indirizzo(null, "New York", "NY", "10003", "4th Ave", 13);
        indV3 = indirizzoDAO.save(indV3);
        Utente v3 = new Utente();
        v3.setEmail("alessandro_deluca@outlook.it");
        v3.setPassword("password");
        v3.setNome("Alessandro");
        v3.setCognome("Deluca");
        v3.setRuolo(Utente.Ruolo.Volontario);
        v3.setAmbito("Strengthening Communities");
        v3.setRecapitoTelefonico("333000003");
        v3.setIndirizzo(indV3);
        try { registrazioneService.registraUtente(v3); } catch (Exception e) { }
        v3 = entityManager.merge(v3);

        // V4: Strengthening Communities (Lat: 40.6931, Lon: -73.9643 -> Clinton Hill, Brooklyn)
        Indirizzo indV4 = new Indirizzo(null, "Brooklyn", "NY", "11205", "Grand Ave", 14);
        indV4 = indirizzoDAO.save(indV4);
        Utente v4 = new Utente();
        v4.setEmail("l.serra@outlook.it");
        v4.setPassword("password");
        v4.setNome("Luca");
        v4.setCognome("Serra");
        v4.setRuolo(Utente.Ruolo.Volontario);
        v4.setAmbito("Strengthening Communities");
        v4.setRecapitoTelefonico("333000004");
        v4.setIndirizzo(indV4);
        try { registrazioneService.registraUtente(v4); } catch (Exception e) { }
        v4 = entityManager.merge(v4);

        // V5: Helping Neighbors in Need (Lat: 40.7978, Lon: -73.9675 -> Upper West Side, Manhattan)
        Indirizzo indV5 = new Indirizzo(null, "New York", "NY", "10025", "Columbus Ave", 15);
        indV5 = indirizzoDAO.save(indV5);
        Utente v5 = new Utente();
        v5.setEmail("simone.martini@hotmail.com");
        v5.setPassword("password");
        v5.setNome("Simone");
        v5.setCognome("Martini");
        v5.setRuolo(Utente.Ruolo.Volontario);
        v5.setAmbito("Helping Neighbors in Need");
        v5.setDescrizione("Aiutando il vicinato");
        v5.setRecapitoTelefonico("333000005");
        v5.setIndirizzo(indV5);
        try { registrazioneService.registraUtente(v5); } catch (Exception e) { }
        v5 = entityManager.merge(v5);

        // V6: Environment (Lat: 40.7526, Lon: -73.9734 -> Midtown East, Manhattan)
        Indirizzo indV6 = new Indirizzo(null, "New York", "NY", "10017", "Lexington Ave", 16);
        indV6 = indirizzoDAO.save(indV6);
        Utente v6 = new Utente();
        v6.setEmail("matteo.rizzi90@libero.it");
        v6.setPassword("password");
        v6.setNome("Matteo");
        v6.setCognome("Rizzi");
        v6.setRuolo(Utente.Ruolo.Volontario);
        v6.setAmbito("Environment");
        v6.setDescrizione("Ambientalista e Vegano");
        v6.setRecapitoTelefonico("333000006");
        v6.setIndirizzo(indV6);
        try { registrazioneService.registraUtente(v6); } catch (Exception e) { }
        v6 = entityManager.merge(v6);

        // V7: Strengthening Communities (Lat: 40.7091, Lon: -74.0068 -> Financial District, Manhattan)
        Indirizzo indV7 = new Indirizzo(null, "New York", "NY", "10038", "John St", 17);
        indV7 = indirizzoDAO.save(indV7);
        Utente v7 = new Utente();
        v7.setEmail("chiara.deluca@yahoo.it");
        v7.setPassword("password");
        v7.setNome("Chiara");
        v7.setCognome("Deluca");
        v7.setRuolo(Utente.Ruolo.Volontario);
        v7.setAmbito("Strengthening Communities");
        v7.setRecapitoTelefonico("333000007");
        v7.setIndirizzo(indV7);
        try { registrazioneService.registraUtente(v7); } catch (Exception e) { }
        v7 = entityManager.merge(v7);

        // V8: Strengthening Communities (Lat: 40.6671, Lon: -73.8851 -> East New York, Brooklyn)
        Indirizzo indV8 = new Indirizzo(null, "Brooklyn", "NY", "11207", "Liberty Ave", 18);
        indV8 = indirizzoDAO.save(indV8);
        Utente v8 = new Utente();
        v8.setEmail("nicola_colombo@yahoo.it");
        v8.setPassword("password");
        v8.setNome("Nicola");
        v8.setCognome("Colombo");
        v8.setRuolo(Utente.Ruolo.Volontario);
        v8.setAmbito("Strengthening Communities");
        v8.setRecapitoTelefonico("333000008");
        v8.setIndirizzo(indV8);
        try { registrazioneService.registraUtente(v8); } catch (Exception e) { }
        v8 = entityManager.merge(v8);

        // V9: Strengthening Communities (Lat: 40.7285, Lon: -73.9985 -> Greenwich Village, Manhattan)
        Indirizzo indV9 = new Indirizzo(null, "New York", "NY", "10012", "Thompson St", 19);
        indV9 = indirizzoDAO.save(indV9);
        Utente v9 = new Utente();
        v9.setEmail("federico_ferrari@icloud.com");
        v9.setPassword("password");
        v9.setNome("Federico");
        v9.setCognome("Ferrari");
        v9.setRuolo(Utente.Ruolo.Volontario);
        v9.setAmbito("Strengthening Communities");
        v9.setRecapitoTelefonico("333000009");
        v9.setIndirizzo(indV9);
        try { registrazioneService.registraUtente(v9); } catch (Exception e) { }
        v9 = entityManager.merge(v9);

        // V10: Health (Lat: 40.7677, Lon: -73.9705 -> Upper East Side, Manhattan)
        Indirizzo indV10 = new Indirizzo(null, "New York", "NY", "10065", "65th St", 20);
        indV10 = indirizzoDAO.save(indV10);
        Utente v10 = new Utente();
        v10.setEmail("sofia.rinaldi97@gmail.com");
        v10.setPassword("password");
        v10.setNome("Sofia");
        v10.setCognome("Rinaldi");
        v10.setRuolo(Utente.Ruolo.Volontario);
        v10.setAmbito("Health");
        v10.setDescrizione("Volontario di Medici Senza Frontiere");
        v10.setRecapitoTelefonico("333000010");
        v10.setIndirizzo(indV10);
        try { registrazioneService.registraUtente(v10); } catch (Exception e) { }
        v10 = entityManager.merge(v10);

        // V11: Strengthening Communities (Lat: 40.6858, Lon: -73.9803 -> Boerum Hill, Brooklyn)
        Indirizzo indV11 = new Indirizzo(null, "Brooklyn", "NY", "11217", "Nevins St", 21);
        indV11 = indirizzoDAO.save(indV11);
        Utente v11 = new Utente();
        v11.setEmail("filippoparisi@yahoo.it");
        v11.setPassword("password");
        v11.setNome("Medici Senza Frontiere");
        v11.setRuolo(Utente.Ruolo.Ente);
        v11.setAmbito("Strengthening Communities");
        v11.setRecapitoTelefonico("333000011");
        v11.setIndirizzo(indV11);
        try { registrazioneService.registraUtente(v11); } catch (Exception e) { }
        v11 = entityManager.merge(v11);

        // V12: Strengthening Communities (Lat: 40.7209, Lon: -73.9979 -> Nolita, Manhattan)
        Indirizzo indV12 = new Indirizzo(null, "New York", "NY", "10012", "Mulberry St", 22);
        indV12 = indirizzoDAO.save(indV12);
        Utente v12 = new Utente();
        v12.setEmail("serena.bianchi87@gmail.com");
        v12.setPassword("password");
        v12.setNome("Oxfam");
        v12.setRuolo(Utente.Ruolo.Ente);
        v12.setAmbito("Strengthening Communities");
        v12.setRecapitoTelefonico("333000012");
        v12.setIndirizzo(indV12);
        try { registrazioneService.registraUtente(v12); } catch (Exception e) { }
        v12 = entityManager.merge(v12);

        // V13: Environment (Lat: 40.7339, Lon: -74.0049 -> West Village, Manhattan)
        Indirizzo indV13 = new Indirizzo(null, "New York", "NY", "10014", "Hudson St", 23);
        indV13 = indirizzoDAO.save(indV13);
        Utente v13 = new Utente();
        v13.setEmail("alessandro.mancini92@gmail.com");
        v13.setPassword("password");
        v13.setNome("Save the Children");
        v13.setRuolo(Utente.Ruolo.Ente);
        v13.setAmbito("Environment");
        v13.setDescrizione("Lotto per il futuro dei nostri figli <3");
        v13.setRecapitoTelefonico("333000013");
        v13.setIndirizzo(indV13);
        try { registrazioneService.registraUtente(v13); } catch (Exception e) { }
        v13 = entityManager.merge(v13);

        // V14: Helping Neighbors in Need (Lat: 40.8030, Lon: -73.9529 -> Harlem, Manhattan)
        Indirizzo indV14 = new Indirizzo(null, "New York", "NY", "10026", "Frederick Douglass Blvd", 24);
        indV14 = indirizzoDAO.save(indV14);
        Utente v14 = new Utente();
        v14.setEmail("laura.villa85@yahoo.it");
        v14.setPassword("password");
        v14.setNome("Caritas Internationalis");
        v14.setRuolo(Utente.Ruolo.Ente);
        v14.setAmbito("Helping Neighbors in Need");
        v14.setRecapitoTelefonico("333000014");
        v14.setIndirizzo(indV14);
        try { registrazioneService.registraUtente(v14); } catch (Exception e) { }
        v14 = entityManager.merge(v14);

        // V15: Strengthening Communities (Lat: 40.7137, Lon: -74.0054 -> Civic Center, Manhattan)
        Indirizzo indV15 = new Indirizzo(null, "New York", "NY", "10007", "Chambers St", 25);
        indV15 = indirizzoDAO.save(indV15);
        Utente v15 = new Utente();
        v15.setEmail("tommaso.deluca@icloud.com");
        v15.setPassword("password");
        v15.setNome("Emergency");
        v15.setRuolo(Utente.Ruolo.Ente);
        v15.setAmbito("Strengthening Communities");
        v15.setRecapitoTelefonico("333000015");
        v15.setIndirizzo(indV15);
        try { registrazioneService.registraUtente(v15); } catch (Exception e) { }
        v15 = entityManager.merge(v15);

        // V16: Education (Lat: 40.8166, Lon: -73.8609 -> Soundview, Bronx)
        Indirizzo indV16 = new Indirizzo(null, "Bronx", "NY", "10473", "Soundview Ave", 26);
        indV16 = indirizzoDAO.save(indV16);
        Utente v16 = new Utente();
        v16.setEmail("danielevilla@outlook.it");
        v16.setPassword("password");
        v16.setNome("Amnesty International");
        v16.setRuolo(Utente.Ruolo.Ente);
        v16.setAmbito("Education");
        v16.setRecapitoTelefonico("333000016");
        v16.setIndirizzo(indV16);
        try { registrazioneService.registraUtente(v16); } catch (Exception e) { }
        v16 = entityManager.merge(v16);

        // V17: Helping Neighbors in Need (Lat: 40.7313, Lon: -73.9887 -> East Village, Manhattan)
        Indirizzo indV17 = new Indirizzo(null, "New York", "NY", "10003", "13th St", 27);
        indV17 = indirizzoDAO.save(indV17);
        Utente v17 = new Utente();
        v17.setEmail("matteo_leone@libero.it");
        v17.setPassword("password");
        v17.setNome("Mezzaluna Rossa Internazionale");
        v17.setRuolo(Utente.Ruolo.Ente);
        v17.setAmbito("Helping Neighbors in Need");
        v17.setRecapitoTelefonico("333000017");
        v17.setIndirizzo(indV17);
        try { registrazioneService.registraUtente(v17); } catch (Exception e) { }
        v17 = entityManager.merge(v17);

        // V18: Education (Lat: 40.7920, Lon: -73.9445 -> East Harlem, Manhattan)
        Indirizzo indV18 = new Indirizzo(null, "New York", "NY", "10029", "2nd Ave", 28);
        indV18 = indirizzoDAO.save(indV18);
        Utente v18 = new Utente();
        v18.setEmail("simonefabbri@yahoo.it");
        v18.setPassword("password");
        v18.setNome("ActionAid");
        v18.setRuolo(Utente.Ruolo.Ente);
        v18.setAmbito("Education");
        v18.setRecapitoTelefonico("333000018");
        v18.setIndirizzo(indV18);
        try { registrazioneService.registraUtente(v18); } catch (Exception e) { }
        v18 = entityManager.merge(v18);

        // V19: Helping Neighbors in Need (Lat: 40.7166, Lon: -74.0041 -> Tribeca, Manhattan)
        Indirizzo indV19 = new Indirizzo(null, "New York", "NY", "10013", "Thomas St", 29);
        indV19 = indirizzoDAO.save(indV19);
        Utente v19 = new Utente();
        v19.setEmail("giulia.barbieri@libero.it");
        v19.setPassword("password");
        v19.setNome("Project HOPE");
        v19.setRuolo(Utente.Ruolo.Ente);
        v19.setAmbito("Helping Neighbors in Need");
        v19.setRecapitoTelefonico("333000019");
        v19.setIndirizzo(indV19);
        try { registrazioneService.registraUtente(v19); } catch (Exception e) { }
        v19 = entityManager.merge(v19);


        // --- BENEFICIARI LOCALI (B0 - B3) ---

        // B0: Cerca "Strengthening Communities" a MANHATTAN (Vicino a V0: East Village)
        Indirizzo indB0 = new Indirizzo(null, "New York", "NY", "10009", "E 10th St", 990);
        indB0 = indirizzoDAO.save(indB0);
        Utente b0 = new Utente();
        b0.setEmail("bisognoso.manhattan@test.it");
        b0.setPassword("password");
        b0.setNome("Mario");
        b0.setCognome("Bisognoso");
        b0.setRuolo(Utente.Ruolo.Beneficiario);
        b0.setAmbito("Strengthening Communities"); // MATCH CON V0
        b0.setDescrizione("Ho bisogno di aiuto per la comunità a Manhattan");
        b0.setRecapitoTelefonico("333999990");
        b0.setIndirizzo(indB0);
        try { registrazioneService.registraUtente(b0); } catch (Exception e) { }

        // B1: Cerca "Education" nel BRONX (Vicino a V16: Soundview, Bronx)
        Indirizzo indB1 = new Indirizzo(null, "Bronx", "NY", "10473", "Story Ave", 991);
        indB1 = indirizzoDAO.save(indB1);
        Utente b1 = new Utente();
        b1.setEmail("studente.bronx@test.it");
        b1.setPassword("password");
        b1.setNome("Luigi");
        b1.setCognome("Studente");
        b1.setRuolo(Utente.Ruolo.Beneficiario);
        b1.setAmbito("Education"); // MATCH CON V16
        b1.setDescrizione("Cerco tutor per doposcuola nel Bronx");
        b1.setRecapitoTelefonico("333999991");
        b1.setIndirizzo(indB1);
        try { registrazioneService.registraUtente(b1); } catch (Exception e) { }

        // B2: Cerca "Health" a MANHATTAN (Vicino a V10: Upper East Side)
        Indirizzo indB2 = new Indirizzo(null, "New York", "NY", "10065", "66th St", 992);
        indB2 = indirizzoDAO.save(indB2);
        Utente b2 = new Utente();
        b2.setEmail("anziano.health@test.it");
        b2.setPassword("password");
        b2.setNome("Pino");
        b2.setCognome("Salute");
        b2.setRuolo(Utente.Ruolo.Beneficiario);
        b2.setAmbito("Health"); // MATCH CON V10
        b2.setDescrizione("Ho bisogno di assistenza sanitaria leggera");
        b2.setRecapitoTelefonico("333999992");
        b2.setIndirizzo(indB2);
        try { registrazioneService.registraUtente(b2); } catch (Exception e) { }

        // B3: Cerca "Strengthening Communities" a BROOKLYN (Vicino a V4: Clinton Hill, Brooklyn)
        Indirizzo indB3 = new Indirizzo(null, "Brooklyn", "NY", "11205", "Myrtle Ave", 993);
        indB3 = indirizzoDAO.save(indB3);
        Utente b3 = new Utente();
        b3.setEmail("comunita.brooklyn@test.it");
        b3.setPassword("password");
        b3.setNome("Anna");
        b3.setCognome("Brooklyn");
        b3.setRuolo(Utente.Ruolo.Beneficiario);
        b3.setAmbito("Strengthening Communities"); // MATCH CON V4
        b3.setDescrizione("Cerco supporto per il quartiere a Brooklyn");
        b3.setRecapitoTelefonico("333999993");
        b3.setIndirizzo(indB3);
        try { registrazioneService.registraUtente(b3); } catch (Exception e) { }


        // --- RELAZIONI EXTRA (EVENTI, RACCONTI, ECC.) ---
        // (Utilizzo enti/volontari esistenti per mantenere integrità)

        Indirizzo indEvento = new Indirizzo(null, "Roma", "RM", "00184", "Piazza del Colosseo", 1);
        indEvento = indirizzoDAO.save(indEvento);

        Evento evento = new Evento();
        evento.setTitolo("Raccolta Alimentare");
        evento.setDescrizione("Raccolta cibo per i bisognosi");
        evento.setDataInizio(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setDataFine(Date.valueOf(LocalDate.now().plusDays(5)));
        evento.setMaxPartecipanti(50);
        evento.setIndirizzo(indEvento);
        evento.setUtente(ente);
        eventoDAO.save(evento);

        Evento evento2 = new Evento();
        evento2.setTitolo("Corso Primo Soccorso");
        evento2.setDescrizione("Impara a salvare vite");
        evento2.setDataInizio(Date.valueOf(LocalDate.now().plusDays(10)));
        evento2.setDataFine(Date.valueOf(LocalDate.now().plusDays(12)));
        evento2.setMaxPartecipanti(30);
        evento2.setIndirizzo(indEvento);
        evento2.setUtente(ente);
        eventoDAO.save(evento2);

        RichiestaServizio richiesta = new RichiestaServizio();
        richiesta.setTesto("Spesa a domicilio per anziani");
        richiesta.setDataRichiesta(Date.valueOf(LocalDate.now()));
        richiesta.setStato(RichiestaServizio.StatoRichiestaServizio.InAttesa);
        richiesta.setBeneficiario(beneficiario);
        richiesta.setEnteVolontario(ente);
        richiestaServizioDAO.save(richiesta);

        Partecipazione partecipazione = new Partecipazione();
        partecipazione.setEvento(evento);
        partecipazione.setVolontario(volontario); // Volontario generico 'Luigi Verdi'
        partecipazione.setData(Date.valueOf(LocalDate.now()));
        partecipazioneDAO.save(partecipazione);


        RaccoltaFondi raccolta = new RaccoltaFondi();
        raccolta.setTitolo("Nuova Ambulanza");
        raccolta.setDescrizione("Fondi per acquisto nuova ambulanza");
        raccolta.setObiettivo(new BigDecimal("50000.00"));
        raccolta.setTotaleRaccolto(new BigDecimal("1250.50"));
        raccolta.setDataApertura(Date.valueOf(LocalDate.now()));
        raccolta.setDataChiusura(Date.valueOf(LocalDate.now().plusMonths(6)));
        raccolta.setEnte(ente);
        raccoltaFondiDAO.save(raccolta);

        Racconto racconto = new Racconto();
        racconto.setTitolo("Esperienza Mensa");
        racconto.setDescrizione("Bellissima giornata di condivisione");
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

        Affiliazione affiliazione2 = new Affiliazione();
        affiliazione2.setDescrizione("Adesione standard");
        affiliazione2.setDataInizio(Date.valueOf(LocalDate.now()));
        affiliazione2.setStato(Affiliazione.StatoAffiliazione.InAttesa);
        affiliazione2.setEnte(ente);
        affiliazione2.setVolontario(v9);
        affiliazioneDAO.save(affiliazione2);

        System.out.println("Popolamento completato!");
    }
}