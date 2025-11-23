package it.lumen.business.gestioneRacconto.service;

import it.lumen.data.dao.RaccontoDAO;
import it.lumen.data.entity.Racconto;
import org.springframework.stereotype.Service;

@Service
public class RaccontoServiceImpl implements RaccontoService{

    private RaccontoDAO raccontoDAO;

    @Override
    public void aggiungiRacconto(Racconto racconto) {

        raccontoDAO.save(racconto);
    }

    @Override
    public void modificaRacconto(Racconto nuovoRacconto) {

        raccontoDAO.save(nuovoRacconto);
    }

    @Override
    public void eliminaRacconto(Integer idRacconto) {

        raccontoDAO.removeByIdRacconto(idRacconto);
    }
}
