
export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Password min 6 caratteri
    PASSWORD: /^.{6,}$/, 
    // Telefono solo numeri
    TELEFONO: /^\d{8,15}$/,
    // CAP 5 cifre
    CAP: /^\d{5}$/,
};

export const validateRegistration = (data) => {
    const errors = {};

    if (!REGEX.EMAIL.test(data.email)) errors.email = "Email non valida";
    if (!data.password || !REGEX.PASSWORD.test(data.password)) errors.password = "Password troppo corta (min 6)";
    
    // Validazioni condizionali (solo se il campo è compilato)
    if (data.telefono && !REGEX.TELEFONO.test(data.telefono)) {
        errors.telefono = "Formato telefono non valido";
    }
    if (data.cap && !REGEX.CAP.test(data.cap)) {
        errors.cap = "CAP non valido (5 cifre)";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};