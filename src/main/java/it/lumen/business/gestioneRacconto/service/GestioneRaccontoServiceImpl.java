package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import it.lumen.data.entity.Utente;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GestioneRaccontoServiceImpl implements GestioneRaccontoService {

    private final RaccontoDAO raccontoDAO;

    @Autowired
    public GestioneRaccontoServiceImpl(RaccontoDAO raccontoDAO) {
        this.raccontoDAO = raccontoDAO;
    }

    @Override
    @Transactional
    public Racconto aggiungiRacconto(Racconto racconto) {

        return raccontoDAO.save(racconto);
    }

    @Override
    @Transactional
    public Racconto modificaRacconto(Racconto nuovoRacconto) {

        return raccontoDAO.save(nuovoRacconto);
    }

    @Override
    @Transactional
    public void eliminaRacconto(Integer idRacconto) {

        raccontoDAO.removeByIdRacconto(idRacconto);
    }

    public Racconto getByIdRacconto(int idRacconto) {

        return raccontoDAO.getRaccontoByIdRacconto(idRacconto);

    }

    public boolean checkId(int idRacconto) {

        return raccontoDAO.existsById(idRacconto);

    }

    public List<Racconto> listaRaccontiUtente(String email) {

        return raccontoDAO.findAllByUtente_Email(email);


    }
}
