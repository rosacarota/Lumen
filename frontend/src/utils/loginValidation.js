export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^.{6,}$/, // Min 6 chars
    PHONE: /^\d{10}$/,
    CAP: /^\d{5}$/,
    CIVICO: /^\d+$/,
    ONLY_LETTERS: /^[a-zA-Z\s']+$/, // Nomi persona, Città
    ALPHANUMERIC_NAME: /^[a-zA-Z0-9\s']+$/, // Nome Ente
    PROVINCIA: /^[A-Z]{2}$/
};

// Validazione centralizzata
export const validateForm = (data, isLogin, userType, step) => {
    const errors = {};

    // --- VALIDAZIONE LOGIN ---
    if (isLogin) {
        if (!data.email?.trim()) errors.email = "Inserisci l'email";
        if (!data.password) errors.password = "Inserisci la password";
        return { isValid: Object.keys(errors).length === 0, errors };
    }

    // --- VALIDAZIONE REGISTRAZIONE STEP 1 ---
    if (step === 1) {
        // Email
        if (!data.email?.trim()) errors.email = "Campo obbligatorio";
        else if (!REGEX.EMAIL.test(data.email)) errors.email = "Email non valida";

        // Password
        if (!data.password) errors.password = "Campo obbligatorio";
        else if (!REGEX.PASSWORD.test(data.password)) errors.password = "Minimo 6 caratteri";

        // Conferma Password
        if (!data.confirmPassword) errors.confirmPassword = "Campo obbligatorio";
        else if (data.password !== data.confirmPassword) errors.confirmPassword = "Le password non coincidono";

        // Dati Anagrafici
        if (userType === 'ente') {
            if (!data.nomeEnte?.trim()) errors.nomeEnte = "Nome Ente obbligatorio";
            else if (!REGEX.ALPHANUMERIC_NAME.test(data.nomeEnte)) errors.nomeEnte = "Caratteri non validi";
        } else {
            if (!data.nome?.trim()) errors.nome = "Nome obbligatorio";
            else if (!REGEX.ONLY_LETTERS.test(data.nome)) errors.nome = "Solo lettere ammesse";

            if (!data.cognome?.trim()) errors.cognome = "Cognome obbligatorio";
            else if (!REGEX.ONLY_LETTERS.test(data.cognome)) errors.cognome = "Solo lettere ammesse";
        }

        // Telefono (Opzionale ma se c'è deve essere valido)
        if (data.telefono && !REGEX.PHONE.test(data.telefono)) {
            errors.telefono = "Formato non valido (10 cifre)";
        }
    }

    // --- VALIDAZIONE REGISTRAZIONE STEP 2 ---
    if (step === 2) {
        // Citta
        if (data.citta && !REGEX.ONLY_LETTERS.test(data.citta)) {
            errors.citta = "Solo lettere ammesse";
        }

        // Provincia 
        if (data.provincia && !REGEX.PROVINCIA.test(data.provincia)) {
            errors.provincia = "Due lettere maiuscole (es. MI)";
        }

        // CAP
        if (data.cap && !REGEX.CAP.test(data.cap)) {
            errors.cap = "CAP deve essere 5 cifre";
        }

        // Civico
        if (data.nCivico && !REGEX.CIVICO.test(data.nCivico)) {
            errors.nCivico = "Solo numeri";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};