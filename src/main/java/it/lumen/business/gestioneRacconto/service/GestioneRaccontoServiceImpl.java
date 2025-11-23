package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
