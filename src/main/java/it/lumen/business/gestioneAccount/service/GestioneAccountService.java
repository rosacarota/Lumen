package it.lumen.business.gestioneAccount.service;

import it.lumen.data.entity.Utente;

/**
 * Interfaccia per i servizi relativi alla gestione dell'account utente.
 */
public interface GestioneAccountService {
    /**
     * Modifica i dati di un utente esistente.
     *
     * @param utente L'oggetto Utente con i dati aggiornati.
     */
    public void modificaUtente(Utente utente);
}
