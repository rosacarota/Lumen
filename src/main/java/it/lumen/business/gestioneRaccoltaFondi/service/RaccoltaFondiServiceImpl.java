package it.lumen.business.gestioneRaccoltaFondi.service;

import it.lumen.data.dao.RaccoltaFondiDAO;
import it.lumen.data.entity.RaccoltaFondi;

import it.lumen.data.entity.Utente;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class RaccoltaFondiServiceImpl implements RaccoltaFondiService {

    private final RaccoltaFondiDAO  raccoltaFondiDAO;

    @Autowired
    public RaccoltaFondiServiceImpl(RaccoltaFondiDAO raccoltaFondiDAO) {this.raccoltaFondiDAO = raccoltaFondiDAO;}

    @Override
    @Transactional
    public void avviaRaccoltaFondi(RaccoltaFondi raccoltaFondi){raccoltaFondiDAO.save(raccoltaFondi);}

    @Override
    @Transactional
    public void terminaRaccoltaFondi(RaccoltaFondi raccoltaFondi){raccoltaFondiDAO.save(raccoltaFondi);}

    @Override
    public List <RaccoltaFondi> ottieniRaccolteDiEnte(Utente utente){
        return raccoltaFondiDAO.findAllByEnte_Email(utente.getEmail());
    }



}

