const API_BASE_URL = "http://localhost:8080";

export const getAuthToken = () => localStorage.getItem("token");


async function parseError(response) {
    const errText = await response.text();
    if (!errText) return "Errore sconosciuto";

    // 1. Tentativo parsing JSON standard
    try {
        let json = JSON.parse(errText);
        // Gestione caso JSON codificato come stringa
        if (typeof json === 'string') {
            try { json = JSON.parse(json); } catch { }
        }

        if (typeof json === 'object' && json !== null) {
            const msg = json.message || json.error || json.msg || json.dettagli;
            if (msg) return String(msg);
        }
    } catch {
    }

    const match = errText.match(/(?:["']?(?:message|error|msg|dettagli)["']?)\s*[:=]\s*(?:["']([^"']*)["']|([^,}\]]*))/i);
    if (match) {
        const extracted = match[1] || match[2];
        if (extracted) return extracted.trim();
    }

    return errText;
}

const api = {
    get: async (endpoint, params = {}) => {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        const token = getAuthToken();
        if (token) url.searchParams.append("token", token);

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(await parseError(response));
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        return response.text();
    },

    post: async (endpoint, body, params = {}) => {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        const token = getAuthToken();
        if (token) url.searchParams.append("token", token);

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(await parseError(response));
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        return response.text();
    }
};

export default api;
