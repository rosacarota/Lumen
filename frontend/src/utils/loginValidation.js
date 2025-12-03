export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^.{6,}$/, // Min 6 chars
    TELEFONO: /^\d{8,15}$/,
    CAP: /^\d{5}$/,
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

        // Dati Anagrafici in base al tipo
        if (userType === 'ente') {
            if (!data.nomeEnte?.trim()) errors.nomeEnte = "Nome Ente obbligatorio";
        } else {
            if (!data.nome?.trim()) errors.nome = "Nome obbligatorio";
            if (!data.cognome?.trim()) errors.cognome = "Cognome obbligatorio";
        }

        // Telefono (Opzionale ma se c'è deve essere valido)
        if (data.telefono && !REGEX.TELEFONO.test(data.telefono)) {
            errors.telefono = "Numero non valido";
        }
    }

    // --- VALIDAZIONE REGISTRAZIONE STEP 2 ---
    if (step === 2) {
        // CAP (Opzionale ma se c'è deve essere 5 cifre)
        if (data.cap && !REGEX.CAP.test(data.cap)) {
            errors.cap = "CAP deve essere 5 cifre";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};