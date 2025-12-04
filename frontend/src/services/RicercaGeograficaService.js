import { useState } from 'react';

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
            const response = await fetch(`http://localhost:8080/ricercaUtente/ricercaGeografica?token=${encodeURIComponent(token)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: category,
                    subcategory: ''
                })
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                console.error('Errore API:', response.status);
                setResults([]);
                setError(`Errore del server: ${response.status}`);
            }
        } catch (err) {
            console.error('Errore di rete:', err);
            setResults([]);
            setError("Errore di connessione al server");
        } finally {
            setIsLoading(false);
        }
    };

    return { results, isLoading, error, fetchResults, setResults };
};

export default useRicercaGeografica;
