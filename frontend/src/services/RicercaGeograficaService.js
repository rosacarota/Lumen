import { useState } from 'react';
import api from '../utils/api';

const useRicercaGeografica = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchResults = async (category) => {
        // Se non c'è categoria, pulisci i risultati ma non fare la chiamata
        if (!category) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        if (!token) {
            console.warn("Nessun token trovato in localStorage");
            setError("Autenticazione richiesta");
            setIsLoading(false);
            return;
        }

        try {
            const data = await api.post("/ricercaUtente/ricercaGeografica", {
                category: category,
                subcategory: ''
            });

            setResults(data);
        } catch (err) {
            console.error('Errore di rete/API:', err);
            setResults([]);
            // err.message contains the error text from api.js if available
            setError(err.message || "Errore di connessione al server");
        } finally {
            setIsLoading(false);
        }
    };

    return { results, isLoading, error, fetchResults, setResults };
};

export default useRicercaGeografica;
