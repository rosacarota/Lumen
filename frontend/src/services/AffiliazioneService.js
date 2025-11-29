const API_URL = 'http://localhost:8080/affiliazione';

class AffiliazioneService {

    //1. Verifica se esiste già un'affiliazione e ritorna JSON (true/false)
    async checkAffiliazione(emailEnte, token) {
        const params = new URLSearchParams({ 
            emailEnte: emailEnte, 
            token: token 
        });

        const response = await fetch(`${API_URL}/check?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Errore check affiliazione: ${response.status}`);
        }

        return await response.json(); // Il backend restituisce un booleano
    }

    //2. Invia una richiesta di affiliazione e ritorna Stringa (messaggio di successo/errore)
    async richiediAffiliazione(descrizione, emailEnte, token) {
        const params = new URLSearchParams({ token: token });
        
        const body = {
            descrizione: descrizione,
            ente: {
                email: emailEnte
            }
        };

        const response = await fetch(`${API_URL}/richiedi?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Gestione specifica per leggere il messaggio di errore dal backend (es. "Richiesta già presente")
        if (!response.ok) {
            const errorMessage = await response.text(); 
            throw new Error(errorMessage || `Errore nella richiesta: ${response.status}`);
        }

        return await response.text(); // Il backend restituisce una stringa semplice
    }

    //3. Visualizza Richieste in Attesa e ritorna JSON (Lista oggetti complessi)
    async getRichiesteInAttesa(token) {
        const params = new URLSearchParams({ token: token });

        const response = await fetch(`${API_URL}/richiesteInAttesa?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Errore recupero richieste: ${response.status}`);
        }

        return await response.json();
    }

    //4. Accetta una richiesta e ritorna Stringa
    async accettaAffiliazione(idAffiliazione, token) {
        const params = new URLSearchParams({ 
            idAffiliazione: idAffiliazione, 
            token: token 
        });

        const response = await fetch(`${API_URL}/accetta?${params}`, {
            method: 'GET', // Il tuo controller usa @GetMapping anche per accettare
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return await response.text();
    }

    //5. Rifiuta una richiesta e ritorna Stringa
    async rifiutaAffiliazione(idAffiliazione, token) {
        const params = new URLSearchParams({ 
            idAffiliazione: idAffiliazione, 
            token: token 
        });

        const response = await fetch(`${API_URL}/rifiuta?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return await response.text();
    }

    //6. Lista Affiliati e ritorna JSON (Lista DTO)
    async getListaAffiliati(token) {
        const params = new URLSearchParams({ token: token });

        const response = await fetch(`${API_URL}/listaAffiliati?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Errore recupero lista affiliati: ${response.status}`);
        }

        return await response.json();
    }
}

export default new AffiliazioneService();